from flask_restful import reqparse, Resource
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import and_

from src.utils import get_session
from src.data.web.jira_servers import JiraServerSettings
from src.data.web.users import Users
from src.data.staging.jira.jira_custom_fields import CustomFields
from src.data.staging.jira.jira_issue import JiraIssueInfo
from src.data.staging.jira.jira_issue import get_jira_issue_info
from src.routes import token_required

from src.utils import get_logger

from jira import JIRA

logger = get_logger('UpdateBacklogIssues')

parser = reqparse.RequestParser()

parser.add_argument('project_key', type=str, required=True, location='args')


class UpdateBacklogIssues(Resource):
    decorators = [token_required]

    def get(self):
        args = parser.parse_args()
        session = get_session()
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        jira_server_settings = session.query(JiraServerSettings)\
            .filter(and_(JiraServerSettings.active == True,
                         JiraServerSettings.tenant_id == user.current_tenant)
                    ).first()
        jira_client = JIRA(
            {'server': jira_server_settings.jira_server, 'agile_rest_path': 'agile'},
            basic_auth=(jira_server_settings.jira_user, jira_server_settings.jira_api_key)
        )
        jql = f'project = {args.project_key} and ((Sprint is EMPTY and issuetype !=epic and status != done) or (Sprint  in futureSprints()))'
        issues = jira_client.search_issues(jql, maxResults=False)
        custom_fields = {row.azimu_name: row.custom_field for row in session.query(CustomFields).all()}
        coounter = 0
        for item in issues:
            issue = get_jira_issue_info(item, custom_fields)
            session.add(issue)
            coounter += 1

        session.commit()
        return {"msg": f"{coounter} issues were retrieved"}, 200
