from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_restful import Resource, reqparse
from src.utils import get_session, json_serial
from src.data.web.users import Users
from src.data.web.tenant import Tenant
from src.routes import token_required

import json

post_parser = reqparse.RequestParser()
post_parser.add_argument(
    'tenant_id', dest='tenant_id'
)

class Tenants(Resource):
    decorators = [token_required]

    def get(self):
        session = get_session()
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        if user:
            return {"msg": "Success", "current_tenant": user.current_tenant, "user_tenants": [i.get_dict() for i in user.tenants]}, 200, {'ContentType': 'application/json'}
        return {"msg": "Somethng went wrong"}, 400


class TenantEntity(Resource):
    decorators = [token_required]

    def get(self):
        session = get_session()
        args = post_parser.parse_args()
        tenant = session.query(Tenant).filter_by(id=args.tenant_id).one()
        if tenant:
            return {"msg": "Success", "tenant": tenant.get_dict()}, 200, {'ContentType': 'application/json'}
        return {"msg": "Somethng went wrong"}, 400
