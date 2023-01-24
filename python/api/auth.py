from werkzeug.security import check_password_hash
from datetime import datetime, timezone

from flask_jwt_extended import create_access_token
from flask_jwt_extended import create_refresh_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_restful import reqparse, Resource
from src.utils import get_session
from src.data.web.users import Users
from src.data.web.tenant import Tenant
from src.data.web.token import Token
from src.data.web.jwt_token_blocklist import JwtTokenBlocklist


post_parser = reqparse.RequestParser()
post_parser.add_argument(
    'password', dest='password'
)
post_parser.add_argument(
    'useremail', dest='useremail'
)


class UserLogin(Resource):

    def post(self):
        args = post_parser.parse_args()
        session = get_session()
        user = session.query(Users).filter_by(email=args.useremail).first()
        if not user:
            return {'msg': 'Invalid user'}, 401
        if not check_password_hash(user.password, args.password):
            return {'msg': 'Invalid password'}, 401
        access_token = create_access_token(identity=args.useremail)
        refresh_token = create_refresh_token(identity=args.useremail)
        return {"msg": "login successful", 'access_token': access_token, 'refresh_token': refresh_token}, 200


class UserLogout(Resource):

    decorators = [jwt_required()]

    def delete(self):
        session = get_session()
        jti = get_jwt()["jti"]
        now = datetime.now(timezone.utc)
        session.add(JwtTokenBlocklist(jti=jti, created=now))
        session.commit()
        return {'msg': 'JWT revoked'}, 200


class UserRefreshToken(Resource):

    decorators = [jwt_required(refresh=True)]

    def post(self):
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity)
        return {'access_token': access_token}, 200


class UserGenerateToken(Resource):
    
    decorators = [jwt_required()]

    def get(self):
        # TODO: duplicated in onboarding, need to unify
        session = get_session()
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        if user.current_tenant:
            tenant = session.query(Tenant).filter_by(id=user.current_tenant).first()
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
            return {"msg": "You have no active workspaces"}, 200

        return {"msg": "Somethng went wrong"}, 400


class UserTokenEntity(Resource):

    decorators = [jwt_required()]

    def get(self):
        # TODO: duplicated in onboarding, need to unify
        session = get_session()
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        if user.current_tenant:
            tenant = session.query(Tenant).filter_by(id=user.current_tenant).first()
            if user and tenant:
                if not user.active:
                    return {"msg": "User is not active"}, 200
                if not tenant.active:
                    return {"msg": "Tenant is not active"}, 200
                active_token = session.query(Token).filter_by(tenant_id=tenant.id, user_id=user.id, active=True).one()

                return {"msg": "Current active token", "token": active_token.value}, 200
            return {"msg": "You have no active workspaces"}, 200

        return {"msg": "Somethng went wrong"}, 400
