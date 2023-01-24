import json
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_restful import reqparse, Resource
from src.utils import get_session


from src.routes import token_required
from src.utils import get_logger
from src.dashboard_data import get_sprint_stat

logger = get_logger('SprintStats')

parser = reqparse.RequestParser()

parser.add_argument('project_key', type=str, required=True, location='args')
parser.add_argument('limit', type=str, required=False, default=3, location='args')

class SprintStats(Resource):
    decorators = [token_required]

    def get(self):
        session = get_session()
        args = parser.parse_args()
        project_key = args.project_key
        limit = args.limit

        try:
            sprint_stats = get_sprint_stat(project_key, limit)
            if sprint_stats:
                sprint_stats = [i for i in sprint_stats]
                keys = sprint_stats[0].keys();
                res = [{key: item[key] for key in keys} for item in sprint_stats]

                return {'success': True, 'data': res}, 200, {'ContentType': 'application/json'}

        except Exception as e:
            logger.error(f'ERROR - {e}')
            return {'success': False, 'message': 'Failed to fetch sprint stats', 'data': []}, 418, {'ContentType': 'application/json'}
