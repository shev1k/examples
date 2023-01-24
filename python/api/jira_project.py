import json
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_restful import reqparse, Resource
from src.utils import get_session
from src.data.web.users import Users
from src.data.web.jira_servers import JiraServerSettings


from src.data.staging.jira.jira_project import JiraProjectInfo
from src.dashboard_data import get_projects_health
from src.routes import token_required
from src.utils import get_logger

logger = get_logger('JiraProjects')

PROJECTS_HEALTH = """
    select
     distinct project_id
     , project_key
     , project_name
     , ahead_rate_per_sprint
     , future_sprints_cnt
     , backlog_health_rate
     , current_risk_rate
     , current_risksy_issues_cnt
     , risk_diff
     , delivery_output_rate
     , future_issues_cnt
    from projects_health_view
"""
class JiraProjects(Resource):
    decorators = [token_required]

    def get(self):
        session = get_session()
        projects_health = []
        try:

            jira_projects = session.query(JiraProjectInfo).all()
            try:
                projects_health_rows = get_projects_health()
                projects_health = [dict(i) for i in projects_health_rows]
            except:
                pass
            if not projects_health:
                projects_health = [{"project_id": i.id,
                                    "project_key": i.key,
                                    "project_name": i.name,
                                    "ahead_rate_per_sprint": 1,
                                    "future_sprints_cnt": 1,
                                    "backlog_health_rate": 0,
                                    "current_risk_rate": 0,
                                    "current_risksy_issues_cnt": 0,
                                    "risk_diff": 0,
                                    "delivery_output_rate": 0,
                                    "future_issues_cnt": 0,
                                    } for i in jira_projects]
            for proj in projects_health:
                if 'azimu' in proj['project_name']:
                    proj['project_name'] = 'Amber Inc'
            return {'success': True, 'jira_projects': projects_health}, 200, {'ContentType': 'application/json'}
        except Exception as e:
            logger.error(f'ERROR - {e}')
            return json.dumps({'success': False, 'message': 'Failed to fetch jira projects', 'projects': []}), 418, {'ContentType': 'application/json'}


class JiraProjectsKeys(Resource):

    decorators = [token_required]

    def get(self):
        session = get_session()
        return {'success': True, 'project_keys': [i.key for i in session.query(JiraProjectInfo).all()]}, 200, {'ContentType': 'application/json'}
