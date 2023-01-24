import json
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_restful import reqparse, Resource
from src.utils import get_session


from src.routes import token_required
from src.utils import get_logger
from src.dashboard_data import get_sprint_stat
from src.data.result.azimu.project_activity import ProjectActivity

from sqlalchemy import desc

logger = get_logger('ProjectFeed')

parser = reqparse.RequestParser()

parser.add_argument('project_key', type=str, required=True, location='args')
parser.add_argument('limit', type=str, required=False, default=3, location='args')


class ProjectFeed(Resource):
    decorators = [token_required]

    def get(self):
        session = get_session()
        args = parser.parse_args()
        project_key = args.project_key
        limit = args.limit

        try:
            if not limit:
                limit = 100
            project_feed = session.query(ProjectActivity)\
                .filter(ProjectActivity.event_type.in_(('appraisal', 'positive')))\
                .order_by(desc(ProjectActivity.start_event)).limit(100)
            if project_feed:
                res = [i.get_dict() for i in project_feed]
                return {'success': True, 'data': res}, 200, {'ContentType': 'application/json'}

        except Exception as e:
            logger.error(f'ERROR - {e}')
            return {'success': False, 'message': 'Failed to fetch sprint stats', 'data': []}, 418, {'ContentType': 'application/json'}
