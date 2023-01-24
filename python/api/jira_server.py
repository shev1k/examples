from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_restful import reqparse, Resource
from src.utils import get_session
from src.data.web.users import Users
from src.data.web.tenant import Tenant
from src.data.web.token import Token
from src.data.web.jira_servers import JiraServerSettings
from src.routes import token_required
from src.jira.webhook import create_webhook

from src.utils import get_logger
from flask import request
logger = get_logger('JiraServer')

post_parser = reqparse.RequestParser()
post_parser.add_argument(
    'api_token', dest='api_token', type=str
)
post_parser.add_argument(
    'jira_domain', dest='jira_domain', type=str
)

post_parser.add_argument(
    'jira_user', dest='jira_user', type=str
)

delete_parser = reqparse.RequestParser()
delete_parser.add_argument(
    'id', dest='id'
)


class JiraServer(Resource):
    decorators = [token_required]

    def post(self):
        args = post_parser.parse_args()
        session = get_session()
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        jira_domain = args.jira_domain.strip()
        api_token = args.api_token.strip()
        jira_user = args.jira_user.strip()
        jira_server_settings = JiraServerSettings(jira_server=jira_domain, jira_api_key=api_token, jira_user=jira_user)
        jira_server_settings.tenant_id = user.current_tenant
        session.add(jira_server_settings)
        session.commit()
        tenant = session.query(Tenant).filter_by(id=user.current_tenant).first()
        try:
            token = session.query(Token).filter_by(tenant_id=user.current_tenant,
                                                   user_id=user.id, active=True).one()
            resutl = create_webhook(jira_server_settings.jira_server,
                                    jira_server_settings.jira_user,
                                    jira_server_settings.jira_api_key,
                                    token.value,
                                    get_session())
        except:
            logger.error('No api token is present. Please generate it.')

        return {"msg": "Settings created successfully", 'jira_servers': [i.get_dict() for i in tenant.jira_settings if i.active]}, 200

    def get(self):
        session = get_session()
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        if user and user.current_tenant:
            tenant = session.query(Tenant).filter_by(id=user.current_tenant).first()
            return {"msg": "Success", 'jira_servers': [i.get_dict() for i in tenant.jira_settings if i.active]}, 200
        return {"msg": "Success", 'jira_servers': []}, 200

    def delete(self):
        args = delete_parser.parse_args()
        session = get_session()
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        jira_settings = session.query(JiraServerSettings).filter_by(id=args.id).one()
        jira_settings.active = False
        session.add(jira_settings)
        session.commit()
        tenant = session.query(Tenant).filter_by(id=user.current_tenant).first()
        return {"msg": "Settings were removed", 'jira_servers': [i.get_dict() for i in tenant.jira_settings if i.active]}, 200
