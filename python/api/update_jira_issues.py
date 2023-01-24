from collections import defaultdict

from flask_restful import Resource, reqparse
from flask_jwt_extended import get_jwt_identity

from sqlalchemy import func
from sqlalchemy import and_
from src.utils import get_session
from src.data.result.azimu.issue_sprint_planning import IssueToSprintPlanning
from src.data.web.users import Users
from src.data.web.jira_servers import JiraServerSettings
from src.routes import token_required

from src.utils import get_logger

from jira import JIRA

logger = get_logger('UpdateJiraIssues')

post_parser = reqparse.RequestParser()
post_parser.add_argument(
    'sprints', type=dict, dest='sprints'
)


class UpdateJiraIssues(Resource):
    decorators = [token_required]

    def post(self):
        session = get_session()
        args = post_parser.parse_args()
        sprints = args.sprints
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        res = {}
        for sprint_id in sprints:
            res[sprint_id] = [i['id'] for i in sprints[sprint_id]['issues']]
        # subquery = session.query(func.max(IssueToSprintPlanning.id))\
        #     .group_by(IssueToSprintPlanning.issue_id).subquery()

        # issues_to_sprint = session.query(IssueToSprintPlanning).filter(IssueToSprintPlanning.id.in_(subquery)).all()
        # for row in issues_to_sprint:
        #     res[row.sprint_id].append(row.issue_id)

        jira_server_settings = session.query(JiraServerSettings)\
            .filter(and_(JiraServerSettings.active == True,
                         JiraServerSettings.tenant_id == user.current_tenant)
                    ).first()

        jira_client = JIRA(
            {'server': jira_server_settings.jira_server, 'agile_rest_path': 'agile'},
            basic_auth=(jira_server_settings.jira_user, jira_server_settings.jira_api_key)
        )
        for sprint_id in res:
            # Sprint
            if int(sprint_id) >= 0:
                jira_client.add_issues_to_sprint(sprint_id, res[sprint_id])
            # Backlog
            else:
                jira_client.move_to_backlog(res[sprint_id])

        return {"msg": f"Sprints were updated"}, 200
