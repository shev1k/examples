import json
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_restful import reqparse, Resource
from src.utils import get_session


from src.routes import token_required
from src.utils import get_logger
from src.dashboard_data import get_active_work

logger = get_logger('AllActivity')

parser = reqparse.RequestParser()

parser.add_argument('project_key', type=str, required=True, location='args')

class AllActivity(Resource):
    decorators = [token_required]

    def get(self):
        session = get_session()
        args = parser.parse_args()
        project_key = args.project_key
        try:
            all_activity = get_active_work(project_key)
            if all_activity:
                all_activity = [i for i in all_activity]
                keys = all_activity[0].keys()
                res_dict = {}
                for item in all_activity:
                    item = {key: item[key] for key in keys}
                    change_time = item['time'].strftime('%Y-%m-%d')
                    if change_time not in res_dict:
                        res_dict[change_time] = []
                    res_dict[change_time].append(item)
                return {'success': True, 'all_activity': res_dict}, 200, {'ContentType': 'application/json'}
        except Exception as e:
            logger.error(f'ERROR - {e}')
            return json.dumps({'success': False, 'message': 'Failed to fetch all activity', 'all_activity': []}), 418, {'ContentType': 'application/json'}
