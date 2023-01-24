from flask_restful import reqparse, Resource
from src.utils import get_session
from src.data.result.azimu.issue_sprint_planning import IssueToSprintPlanning
from src.routes import token_required

from src.utils import get_logger
logger = get_logger('JiraServer')

post_parser = reqparse.RequestParser()
post_parser.add_argument(
    'issue_id', dest='issue_id', type=int
)
post_parser.add_argument(
    'sprint_id', dest='sprint_id', type=int
)


delete_parser = reqparse.RequestParser()
delete_parser.add_argument('offset', type=int)


class IssuePlanning(Resource):
    decorators = [token_required]

    def post(self):
        args = post_parser.parse_args()
        session = get_session()
        issue_to_sprint = IssueToSprintPlanning(issue_id=args.issue_id, sprint_id=args.sprint_id)
        session.add(issue_to_sprint)
        session.commit()
        return {
            "msg": "Issue to sprint mapping was updated",
            "issue_to_sprint": issue_to_sprint.get_dict()
        }, 200

    def delete(self):
        args = delete_parser.parse_args()
        session = get_session()
        offset = args.offset
        if offset:
            session.execute(f"""
                            DELETE FROM issue_to_sprint_planning
                            WHERE id IN (
                                SELECT id
                                FROM issue_to_sprint_planning
                                ORDER BY id
                                LIMIT {offset}
                            )
                            """)
        else:
            session.execute('''TRUNCATE TABLE issue_to_sprint_planning''')
        session.commit()
        return {"msg": "issue_to_sprint_planning was truncated"}, 200
