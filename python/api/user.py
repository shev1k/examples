from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_restful import reqparse, Resource
from src.utils import get_session
from src.data.web.users import Users
from src.data.web.tenant import Tenant
from src.routes import token_required

import json

post_parser = reqparse.RequestParser()
post_parser.add_argument(
    'tenant', dest='tenant'
)


class UserTenantUpdate(Resource):
    decorators = [token_required]

    def post(self):
        args = post_parser.parse_args()
        session = get_session()
        user = session.query(Users).filter_by(email=get_jwt_identity()).first()
        tenant = args.tenant
        user.current_tenant = tenant
        session.add(user)
        session.commit()
        return {"msg": "Success", 'user': user.get_dict()}, 200
