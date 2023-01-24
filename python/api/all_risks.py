import json
from flask_restful import reqparse, Resource
from src.utils import get_session


from src.routes import token_required
from src.utils import get_logger
from src.utils import json_serial
from src.dashboard_data import get_issues_and_risks
from src.dashboard_data import get_project_activity_strikes
from src.dashboard_data import get_active_sprint_issues_activity_history

logger = get_logger('AllRisks')

parser = reqparse.RequestParser()

parser.add_argument('project_key', type=str, required=True, location='args')


class AllRisks(Resource):
    decorators = [token_required]

    def get(self):
        session = get_session()
        args = parser.parse_args()
        project_key = args.project_key

        if not project_key:
            return {'data': [], 'result': 200}
        try:
            risks_data = get_issues_and_risks(project_key)
            if not risks_data:
                return json.dumps({'data': [], 'message': 'No risks to fetch'}, default=json_serial), 204, {'ContentType': 'application/json'}
            
            # strikes = get_project_activity_strikes(project_key)
            # strikes_map = {}
            # for row in strikes:
            #     row = {key: row[key] for key in row.keys()}
            #     key = row['key']
            #     if not strikes_map.get(key):
            #         strikes_map[key] = []
            #     strikes_map[key].append(row)

            issues_activity_history = get_active_sprint_issues_activity_history(project_key)
            issues_activity_map = {}
            for row in issues_activity_history:
                row = {key: row[key] for key in row.keys()}
                key = row['key']
                if not issues_activity_map.get(key):
                    issues_activity_map[key] = []
                issues_activity_map[key].append(row)

            res_map = {}
            for row in risks_data:
                row = {key: row[key] for key in row.keys()}
                key = row['key']
                if not res_map.get(key):
                    res_map[key] = {
                        'key': row['key'],
                        'url': row['url'],
                        'summary': row['summary'],
                        'issuetype_name': row['issuetype_name'],
                        'assignee_displayname': row['assignee_displayname'],
                        'status_name': row['status_name'],
                        'status_category_name': row['status_category_name'],
                        'timeoriginalestimate': row['timeoriginalestimate'],
                        'aggregatetimeoriginalestimate': row['aggregatetimeoriginalestimate'],
                        'short_description': row['short_description'],
                        'cnt': row['cnt'],
                        'description': row['description'],
                        'parent_id': row['parent_id'],
                        'parent_key': row['parent_key'],
                        'issuetype_subtask': row['issuetype_subtask'],
                        'risks': [],
                        # 'strikes': strikes_map.get(key) or [],
                        'activity_history': issues_activity_map.get(key) or [],
                    }

                    if row['risk_id']:
                        res_map[key]['risks'].append({
                            'short_description': row['short_description'],
                            'risk_group': row['risk_group'],
                            'calculate_date': row['calculate_date'],
                            'risk_id': row['risk_id'],
                        })
                else:
                    # we use short_description to filter unique risks
                    # we don't use risk_id since there's risk_id 8 and 9, which are the same
                    risk_descriptions = [r['short_description'] for r in res_map[key]['risks']]
                    if row['short_description'] not in risk_descriptions:
                        res_map[key]['risks'].append({
                            'short_description': row['short_description'],
                            'risk_group': row['risk_group'],
                            'calculate_date': row['calculate_date'],
                            'risk_id': row['risk_id'],
                        })

            res = list(res_map.values())
            return {'data': res, 'result': 200}
        except Exception as e:
            logger.error(f'Error during all risk request: {e}')
            return json.dumps({'data': [], 'result': 200, 'message': 'Failed to fetch risks'}, default=json_serial), 418, {'ContentType': 'application/json'}
