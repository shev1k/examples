from flask_restful import reqparse, Resource

from sqlalchemy import or_
from sqlalchemy import and_
from sqlalchemy import func
# from sqlalchemy.sql.func import max as sa_max

# from flask import _request_ctx_stack
from src.utils import get_session
# from src.data.result.azimu.issue_sprint_planning import IssueToSprintPlanning
from src.data.staging.jira.jira_issue import JiraIssueInfo
from src.data.staging.jira.jira_issue_changelog import JiraIssueChangelogInfo
from src.data.staging.jira.jira_sprint import JiraSprintInfo
from src.data.staging.jira.jira_board import JiraBoardInfo
# from src.data.web.project_settings import ProjectSettings
from src.data.staging.jira.jira_issue_changelog import JiraIssueChangelogInfo
from src.dashboard_data import PLANNING_ISSUES_RISKS
from src.routes import token_required

from src.utils import get_logger


logger = get_logger('IssuesForPlanning')

parser = reqparse.RequestParser()

parser.add_argument('project_key', type=str, required=True, location='args')
# parser.add_argument('offset', type=int, location='args')


class IssuesForPlanning(Resource):
    decorators = [token_required]

    def get(self):
        args = parser.parse_args()
        project_key = args.project_key
        session = get_session()

        subquery = session.query(JiraBoardInfo.id).filter(JiraBoardInfo.location_key == project_key).subquery()
        sprints = session.query(JiraSprintInfo)\
            .filter(JiraSprintInfo.board_id.in_(subquery))\
            .filter(JiraSprintInfo.state == 'future').all()
        sprints_names = {i.id: i.name for i in sprints}
        issues = session.query(JiraIssueInfo)\
            .filter(and_(JiraIssueInfo.issuetype_name != 'Epic'))\
            .filter(and_(JiraIssueInfo.project_key == project_key,
                    or_(JiraIssueInfo.sprint_id.in_(sprints_names.keys()),
                        JiraIssueInfo.sprint_id == None
                        ))
                    ).all()
        issue_ids = [i.id for i in issues]
        epic_links = session.query(JiraIssueChangelogInfo, JiraIssueInfo) \
            .filter(JiraIssueChangelogInfo.issue_id.in_(issue_ids)) \
            .filter(JiraIssueChangelogInfo.field == 'IssueParentAssociation') \
            .join(JiraIssueInfo, JiraIssueInfo.key == JiraIssueChangelogInfo.toString) \
            .all()
        epic_links = {i[0].issue_id: (i[0].toString, i[1].url, i[1].summary) for i in epic_links}
        query = f"""
            select
                distinct id
                , key
                , project_key
                , issuetype_name
                , risk_group
                , short_description
                , sprint_state
            from ac_change_risk_view
            where
                issuetype_name != 'Epic'
                and sprint_state = 'future'
                and project_key ilike '{project_key}'
        """
        issues_risks_rows = session.execute(query)
        issues_risks = {}
        for row in issues_risks_rows:
            if row.id not in issues_risks:
                issues_risks[row.id] = []
            issues_risks[row.id].append({
                        'short_description': row.short_description,
                        'risk_group': row.risk_group
                    })
        subtasks_map = {}
        for issue in issues:
            issue_item = issue.get_dict()
            parent_id = issue_item['parent_id']
            if issue_item['issuetype_subtask']:
                subtask = {
                    'id': issue_item['id'],
                    'key': issue_item['key'],
                    'url': issue_item['url'],
                    'summary': issue_item['summary'],
                    'description': issue_item['description'],
                    'issuetype_name': issue_item['issuetype_name'],
                    'assignee_displayname': issue_item['assignee_displayname'],
                    'timeoriginalestimate': issue_item['timeoriginalestimate'],
                    'sprint_id': issue_item['sprint_id'],
                    'risks': issues_risks.get(issue_item['id']) or [],
                    'issuetype_subtask': issue_item['issuetype_subtask'],
                }
                if not subtasks_map.get(parent_id):
                    subtasks_map[parent_id] = [subtask]
                else:
                    subtasks_map[parent_id].append(subtask)

        issues = [issue for issue in issues if not issue.issuetype_subtask]
        issue_set = set()
        res_issues = []
        for item in issues:
            issue_item = item.get_dict()
            issue = {
                'id': issue_item['id'],
                'key': issue_item['key'],
                'url': issue_item['url'],
                'summary': issue_item['summary'],
                'description': issue_item['description'],
                'issuetype_name': issue_item['issuetype_name'],
                'assignee_displayname': issue_item['assignee_displayname'],
                'timeoriginalestimate': issue_item['timeoriginalestimate'],
                'aggregatetimeoriginalestimate': issue_item['aggregatetimeoriginalestimate'],
                'sprint_id': issue_item['sprint_id'],
                'risks': [],
                'issuetype_subtask': issue_item['issuetype_subtask'],
                'subtasks': subtasks_map.get(issue_item['id']) or []
            }
            if not issue_item.get('description'):
                issue['is_no_desc'] = True
            else:
                issue['is_no_desc'] = False

            if not issue_item.get('aggregatetimeoriginalestimate'):
                issue['is_no_estimate'] = True
            else:
                issue['is_no_estimate'] = False

            if issue_item.get('timeoriginalestimate') and issue_item['timeoriginalestimate'] > 115200:
                issue['is_too_big'] = True
            else:
                issue['is_too_big'] = False

            if issue_item['id'] in epic_links:
                issue['epic_link_name'] = epic_links[issue_item['id']]
                issue['epic_link_name'] = epic_links[issue_item['id']][2]
                issue['epic_link_url'] = epic_links[issue_item['id']][1]
                issue['epic_link_key'] = epic_links[issue_item['id']][0]
            issue_item['risks'] = issues_risks.get(issue_item['id']) or []

            issue_set.add(issue['id'])
            res_issues.append(issue)

        tmp = {-1: []}
        description_updates = session\
            .query(JiraIssueChangelogInfo.issue_id, func.count(JiraIssueChangelogInfo.field))\
            .group_by(JiraIssueChangelogInfo.issue_id)\
            .filter(JiraIssueChangelogInfo.issue_id.in_(issue_set))\
            .filter(
                    or_(
                        (JiraIssueChangelogInfo.field == 'description'),
                        (JiraIssueChangelogInfo.field.like('%acceptance%')),
                    )
                )
        description_updates = description_updates.all()
        if description_updates:
            description_updates = {i[0]: i[1] for i in description_updates}

        for issue in res_issues:
            if issue['id'] in description_updates:
                if description_updates[issue['id']] > 5:
                    issue['is_low_desc_update_rate'] = False
                issue['desc_update_rate'] = description_updates[issue['id']]
            else:
                issue['is_low_desc_update_rate'] = True
                issue['desc_update_rate'] = 0
        for item in res_issues:
            if item['sprint_id']:
                if item['sprint_id'] not in tmp:
                    tmp[item['sprint_id']] = []
                tmp[item['sprint_id']].append(item)
            else:
                tmp[-1].append(item)

        for sprint in sprints:
            if sprint.id not in tmp:
                tmp[sprint.id] = []

        data = []
        for item in tmp:
            data.append({"id": item,
                         "sprint_name": sprints_names.get(item),
                         "issues": tmp[item]})
        return {
            "success": True,
            "data": data
        }, 200
