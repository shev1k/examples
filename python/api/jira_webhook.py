import json
import requests

from flask import request

from requests.auth import HTTPBasicAuth
from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity


from sqlalchemy import and_
from src.utils import get_session
from src.data.web.users import Users
from src.data.web.token import Token
from src.data.web.tenant import Tenant
from src.data.web.jira_servers import JiraServerSettings
from src.data.result.azimu.jira_webhooks import JiraWebhook as db_JiraWebhook
from src.routes import token_required

from src.utils import get_logger
from src.conf.config import WEB_URL
from src.jira.webhook import create_webhook

logger = get_logger('JiraWebhook')


class JiraWebhook(Resource):
    decorators = [token_required]

    def post(self):
        session = get_session()
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        try:
            token = session.query(Token).filter_by(tenant_id=user.current_tenant,
                                                   user_id=user.id, active=True).one()
        except:
            return {"msg": 'No api token is present. Please generate it.'}, 200
        jira_server_settings = session.query(JiraServerSettings)\
            .filter(and_(JiraServerSettings.active == True,
                         JiraServerSettings.tenant_id == user.current_tenant)
                    ).first()
        resutl = create_webhook(jira_server_settings.jira_server,
                                jira_server_settings.jira_user,
                                jira_server_settings.jira_api_key,
                                token.value,
                                session)
        return resutl, 200
