from werkzeug.security import check_password_hash
from flask import after_this_request

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import unset_jwt_cookies
from flask_restful import reqparse, Resource
from src.utils import get_session
from src.data.web.users import Users
from src.data.web.tenant import Tenant
from src.data.web.token import Token
from src.data.staging.jira.jira_issue import JiraIssueInfo
from src.data.result.azimu.
from src.routes import token_required


post_parser = reqparse.RequestParser()
post_parser.add_argument(
    'event', dest='event'
)
post_parser.add_argument(
    'token', dest='token'
)
post_parser.add_argument(
    'team_id', dest='team_id'
)
post_parser.add_argument(
    'api_app_id', dest='api_app_id'
)

class SlackEvent(Resource):

    decorators = [token_required()]

    def post(self):

        args = post_parser.parse_args()
        session = get_session()
        logger.debug(request)
        request_data = request.get_json()
        event = args.event
        slack_event = SlackEvents(
            token=args.token,
            team_id=rargs.team_id,
            api_app_id=args.api_app_id,
            event=event
        )
        session.add(slack_event)
        session.commit()
        if event:
            event_text = event.get('text', '')
            # find candidates to check if the text is issue key
            matches = re.findall(r'\b([a-zA-Z]+)[\s-]?(\d+)\b', event_text)
            if matches:
                # replace character (-, space or null) between letters and numbers with '-'
                jira_keys = {'-'.join(x).upper() for x in matches}
                for key in jira_keys:
                    # if such key exists
                    jira_issue = session.query(JiraIssueInfo).filter(JiraIssueInfo.key == key).first().id
                    if jira_issue:
                        slack_link = SlackJiraLink(
                            timestamp=datetime.fromtimestamp(float(event.get('ts', 0))),
                            text=event_text,
                            sender=event.get('user'),
                            channel=event.get('channel'),
                            channel_type=event.get('channel_type'),
                            jira_key=key,
                            issue_id=jira_issue
                        )
                        session.add(slack_link)
                        session.commit()
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


class UserLogout(Resource):

    def post(self):
        @after_this_request
        def unset_cookie(response):
            if response.status_code == 200:
                unset_jwt_cookies(response)
            return response
        return {"msg": "logout successful"}, 200


class UserGenerateToken(Resource):
    
    decorators = [jwt_required()]

    def get(self):
        # TODO: duplicated in onboarding, need to unify
        session = get_session()
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        tenant = session.query(Tenant).filter_by(id=user.tenant_id).first()
        if user and tenant:
            if not user.active:
                return {"msg": "User is not active"}, 200
            if not tenant.active:
                return {"msg": "Tenant is not active"}, 200
            active_tokens = session.query(Token).filter_by(tenant_id=tenant.id, user_id=user.id, active=True).all()
            for active_token in active_tokens:
                active_token.active = False
                session.add(active_token)
            session.commit()
            token_value = create_access_token(
                identity=user.email,
                expires_delta=False,
                additional_claims={'tenant': tenant.name, 'tenant_id': tenant.id, 'tenant_active': tenant.active, 'user_id': user.id}
                )
            token = Token(
                    value=token_value,
                    tenant_id=tenant.id,
                    user_id=user.id
                )
            session.add(token)
            session.commit()

            return {"msg": "Token generated", "token": token_value}, 200
                
        return {"msg": "Somethng went wrong"}, 400

