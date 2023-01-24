from src.utils import execute_query_to_list

SANKEY_QUERY = """
    select sprint_name
         , start_date
         , sum(is_dragged::int) as added_from_prev
         , sum(is_unplanned_removed::int) as added_removed
         , sum(is_unplanned_unresolved::int) as added_unresolved
         , sum(is_unplanned_closed::int) as added_closed
         , sum(is_dragged_removed::int) as from_prev_removed
         , sum(is_dragged_unresolved::int) as from_prev_unresolved
         , sum(is_dragged_closed::int) as from_prev_closed
         , sum(is_planned_removed::int) as native_removed
         , sum(is_planned_unresolved::int) as native_unresolved
         , sum(is_planned_closed::int) as native_closed
    from sprint_issues_view
    where project_key ilike '{_pattern}'
      and sprint_state in ('active', 'closed')
    group by 1, 2
    order by 2 desc
    limit {_limit}
"""


ESTIMATION_HIT_MARKERS_QUERY = """
    with sprint_names as (
        select name
             , min(staging_jira_sprint.start_date) as start_date
        from staging_jira_sprint
        where lower(state) in ('active', 'closed')
        group by 1
        order by 2 desc
        limit {_limit}
    )
    ,  sprint_number as (
        select name
             , start_date
             , row_number() over (order by start_date) as sprint_num
        from sprint_names
    )
    select sprint_num
         , sprint_name
         , category
         , time_rate
         , category = lead(category, 1) over (order by category, sprint_num, time_rate) as is_next_same_category
    from estimation_rates_view erv
    join sprint_number sn on sn.name = erv.sprint_name
    order by 3, 1, 4
"""


ESTIMATION_HIT_LINES_QUERY = """
    with sprint_names as (
        select name
             , min(staging_jira_sprint.start_date) as start_date
        from staging_jira_sprint
        where lower(state) in ('active', 'closed')
        group by 1
        order by 2 desc
        limit {_limit}
    )
    ,  sprint_number as (
        select name
             , start_date
             , row_number() over (order by start_date) as sprint_num
        from sprint_names
    )
    , avg_cat as (
        select sprint_num
             , sprint_name
             , category
             , avg(time_rate) as avg_rate
        from estimation_rates_view erv
                 join sprint_number sn on sn.name = erv.sprint_name
        group by 1, 2, 3
    )
    select sprint_num
         , sprint_name
         , category
         , avg_rate
         , category = lead(category, 1) over (order by category, sprint_num) as is_next_same_category
    from avg_cat
    order by 3, 1
"""

SPRINT_COMPLETED_QUERY = """
    with sprint_names as (
            select name
                 , max(staging_jira_sprint.start_date) as start_date
            from staging_jira_sprint
            where lower(state) in ('active', 'closed')
            group by 1
            order by 2 desc
            limit {_limit}
    )
    , sprint_commits as (
        select case when sprint_day > -1 then sprint_day else -1 end as sprint_day
             , committed_date
             , resolved
             , unresolved
             , removed
             , untracked
        from sprint_commits_view
        where sprint_name = (select name from sprint_names)
    )
    select sprint_day
         , row_number() over (partition by sprint_day order by committed_date) com_order
         , date(committed_date)::varchar as committed_date
         , resolved
         , unresolved
         , removed
         , untracked
    from sprint_commits
    order by 1, 2
"""


SPRINT_PLANNED_QUERY = """
    with sprint_names as (
            select name
                 , max(staging_jira_sprint.start_date) as start_date
            from staging_jira_sprint
            where lower(state) in ('active', 'closed')
            group by 1
            order by 2 desc
            limit {_limit}
    )
    , sprint_commits as (
        select case when sprint_day > -1 then sprint_day else -1 end as sprint_day
             , committed_date
             , is_native_added
             , is_added_added
             , is_from_prev_added
             , untracked
        from sprint_commits_view
        where sprint_name = (select name from sprint_names)
    )
    select sprint_day
         , row_number() over (partition by sprint_day order by committed_date) com_order
         , date(committed_date)::varchar as committed_date
         , is_native_added
         , is_added_added
         , is_from_prev_added
         , untracked
    from sprint_commits
    order by 1, 2
"""

RISKS_QUERY = """
    select key
         , url
         , summary
         , assignee_displayname
         , status_name
         , status_category_name
         , short_description
         , risk_group
         , issuetype_name
         , count(*) over (partition by key) as cnt
    from (select
             distinct key
             , url
             , summary
             , assignee_displayname
             , status_name
             , status_category_name
             , short_description
             , risk_group
             , issuetype_name
        from ac_change_risk_view
        where project_key ilike '{_pattern}'
        and sprint_state ilike 'active'
        and status_category_name in ('To Do', 'In Progress', 'Done')
        and risk_id > 0) as r
    group by 1, 2 , 3, 4, 5, 6, 7, 8, 9
    order by cnt desc, key;
"""

ISSUES_QUERY = """
with ir as (
    select key
         , url
         , summary
         , assignee_displayname
         , status_name
         , status_category_name
         , short_description
         , risk_group
         , issuetype_name
         , description
         , count(*) over (partition by key) as cnt
         , calculate_date
         , risk_id
    from (select
             distinct key
             , url
             , summary
             , assignee_displayname
             , status_name
             , status_category_name
             , short_description
             , risk_group
             , issuetype_name
             , description
             , calculate_date
             , risk_id
        from ac_change_risk_view
        where project_key ilike '{_pattern}'
        and sprint_state ilike 'active'
        and status_category_name in ('To Do', 'In Progress', 'Done')
        and risk_id > 0) as r
    group by 1, 2 , 3, 4, 5, 6, 7, 8, 9, 10, 12, 13
    order by cnt desc, key)

    select
        ji.key
      , ji.url
      , ji.summary
      , ji.assignee_displayname
      , ji.status_name
      , ji.status_category_name
      , coalesce(ji.timeoriginalestimate, 0) as timeoriginalestimate
      , coalesce(ji.aggregatetimeoriginalestimate, 0) as aggregatetimeoriginalestimate
      , coalesce(ir.short_description, '') as short_description
      , coalesce(ir.risk_group, '') as risk_group
      , ji.issuetype_name
      , coalesce(ir.cnt, 0) as cnt
      , ji.description
      , ji.parent_id
      , ji.parent_key
      , ir.calculate_date
      , ir.risk_id
      , ji.issuetype_subtask
    from staging_jira_issue ji
        left join ir on ir.key = ji.key
        join sprint_stats_view on ji.sprint_id = sprint_stats_view.sprint_id
    where
        sprint_stats_view.sprint_state = 'active'
        and sprint_stats_view.project_key ilike '{_pattern}'
    order by cnt desc, ji.key
"""

EPIC_RISKS_QUERY = """
    with compare_date as (
            -- after implementation of tenant settings get value from there
            select current_date - 7 as compare_day
        )
        , current_risks as (select
                     distinct key
                     , url
                     , summary
                     , assignee_displayname
                     , status_name
                     , status_category_name
                     , short_description
                     , risk_group
                     , issuetype_name
                     , epic_issue_id
                     , epic_issue_key
                     , jsonb_build_object('risk_group', risk_group, 'short_description', short_description) risk_descr
                from ac_change_risk_view
                where project_key ilike '{_pattern}'
                and sprint_state ilike 'active'
                and status_category_name in ('To Do', 'In Progress')
                and issuetype_name not in ('Sub-task', 'Bug-Subtask')
                and risk_id > 0)
        , past_risks as (
            select key
                 , count(distinct(risk_id)) as issue_risk_cnt
            from ac_change_risk_hist
            where key in (select key from current_risks)
              and risk_id > 0
              and run_date = (select compare_day from compare_date)
            group by 1
        )
    select r.key
           , r.url
           , r.summary
           , r.assignee_displayname
           , r.status_name
           , r.status_category_name
           , r.issuetype_name
           , r.epic_issue_key
           , i.summary as epic_summary
           , concat('https://', (string_to_array(i.url, '/'))[3], '/browse/', r.epic_issue_key) as epic_url
           , i.assignee_displayname as epic_assignee
           , i.status_category_name as epic_status_category_name
           , i.created > (select compare_day from compare_date) as is_new_epic
           , sum((risk_group='code')::int) as risk_code_cnt
           , sum((risk_group='clarity')::int) as risk_clarity_cnt
           , sum((risk_group='focus')::int) as risk_focus_cnt
           , count(*) as risk_cnt
           , count(*) - case when i2.created < (select compare_day from compare_date) then coalesce(p.issue_risk_cnt, 0) end as diff_risk_cnt
           , array_agg(risk_descr) as data
        from current_risks as r
        left join staging_jira_issue i on i.id = r.epic_issue_id
        left join staging_jira_issue i2 on i2.key = r.key
        left join past_risks p on r.key = p.key
        group by 1,2,3,4,5,6,7,8,9,10,11,12,13,i2.created,p.issue_risk_cnt
        order by 9, risk_cnt desc
"""

GANTT_QUERY = """
    select
           issue_id
         , start_date
         , end_date
         , forecast_bucket
         , features_contributions
         , text
         , issuetype_name
         , aggregatetimeoriginalestimate
         , aggregatetimespent
         , labels
         , assignee_displayname
         , status_category_name
         , summary
         , sprint_id
         , progress
         , jira_project
    from gantt_view
        where jira_project ilike '{_pattern}'
        order by case when lower(status_category_name) = 'in progress' then 1
                  when lower(status_category_name) = 'to do' then 2
                  when lower(status_category_name) = 'done' then 3
                  else 4 end;
"""


ACTIVE_WORK_QUERY = """
    select
         key
         , url
         , assignee
         , source
         , type
         , value
         , time
    from active_work_view
    where is_activity_24h = true
    and "key" ilike '{_pattern}%'
"""


ACTIVE_LAST_24H_NUM = """
    select count(distinct issue_id) 
    from active_work_view 
    where is_activity_24h is true
    and "key" ilike '{_pattern}%'
"""

LAST_24H_COMMITS_NUM = """
    select count(*) 
    from active_work_view
    where is_activity_24h is true
    and source = 'Git'
    and "key" ilike '{_pattern}%'
"""

REWORK_NUM = """
    select count(distinct id)
    from ac_change_risk_view
    where risk_id = 7
    and project_key ilike '{_pattern}'
"""

# New risks that are in table today but were not in the table yesterday
NEW_RISKS = """
    select count(*)
    from ac_change_risk_view v
    left join ac_change_risk_hist t
        on v.id = t.id
        and v.risk_id = t.risk_id
        and t.calculate_date = v.calculate_date
        and t.run_date = current_date - 1
    where t.id is null
    and v.project_key ilike '{_pattern}'
"""

# New risks that are in table today but were not in the table yesterday
SPRINT_STATS = """
    select
       sprint_id
     , sprint_name
     , sprint_state
     , start_date
     , case when sprint_state = 'active' then end_date
            when sprint_state = 'future' then null
            else complete_date end as complete_date
     , start_tickets_cnt
     , max_cnt
     , start_is_too_big
     , start_is_no_est
     , start_is_no_descr
     , start_avg_descr_upd
     , now_planned_resolved_cnt
     , now_unplanned_resolved_cnt
     , now_dragged_resolved_cnt
     , now_resolved_cnt
     , committed_total_estimate
     , closed_total_estimate
     , committed_too_big_total_esimate
     , committed_no_description_total_estimate
     , closed_dragged_total_estimate
     , closed_planned_total_estimate
     , closed_unplanned_total_estimate
    from sprint_stats_view
    where project_key ilike '{_pattern}'
    order by start_date desc
    limit {_limit}
"""

TOTAL_NUMBER_OF_SPRINT_STATS = """
    select count(sprint_id)
    from sprint_stats_view
    where project_key ilike '{_pattern}'
"""

# New risks that are in table today but were not in the table yesterday
RISK_GROUP_RATE = """
    select risk_group, issues_in_group, risk_rate, hist_rate
    from risk_rates_view
    where project_key ilike '{_pattern}'
"""


ALL_ACTIVITY = """
    select
        change_time
    ,   change_author
    ,   assignee
    ,   change_type
    ,   prev_value
    ,   new_value
    from all_activity
    order by change_time desc
    limit 200
"""

PROJECTS_HEALTH = """
    select
     distinct project_id
     , project_key
     , project_name
     , ahead_rate_per_sprint
     , future_sprints_cnt
     , backlog_health_rate
     , current_risk_rate
     , current_risksy_issues_cnt
     , risk_diff
     , delivery_output_rate
     , future_issues_cnt
    from projects_health_view 
"""

PLANNING_ISSUES_RISKS = """
    select 
        distinct id
        , key
        , project_key
        , issuetype_name
        , risk_group
        , short_description
        , sprint_state
    from ac_change_risk_view
    where
        issuetype_name != 'Epic'
        and sprint_state = 'future'
        and project_key ilike '{_pattern}'
"""

PROJECT_ACTIVITY_STRIKES = """
    select 
       distinct issue_id
     , key
     , project_key
     , event_type
     , event_value
     , is_active
     , body
    from project_activity
    where event_type = 'strike'
          and project_key ilike '{_pattern}'
          and is_active = true
"""

ACTIVE_SPRINT_ISSUES_ACTIVITY_HISTORY = """
    with active_sprint as (
        select sprint_id
        from sprint_stats_view
        where project_key = '{_pattern}'
        and sprint_state = 'active'
        limit 1
    ),
    active_sprint_issues as (
        select key, sprint_id
        from staging_jira_issue
        where sprint_id = (select sprint_id from active_sprint)
    )
    select 
       id
     , key
     , change_type
     , change_author
     , source
     , change_time
     , prev_value
     , new_value
     , project_key
    from all_activity
    where
       key in (select key from active_sprint_issues)
       and change_type in (
          'description'
        , 'status'
        , 'assignee'
        , 'timeoriginalestimate'
        , 'timespent'
        , 'Sprint'
        , 'commit'
        , 'message'
        , 'comment'
        , 'risk_added'
        , 'risk_closed'
        , 'Acceptance Criteria'
    )
"""


def _get_data(query, **kwargs):
    formatted_query = query.format(**kwargs)
    return execute_query_to_list(formatted_query)


def get_sankey_data(project_sprint_pattern, limit):
    return _get_data(SANKEY_QUERY, _pattern=project_sprint_pattern, _limit=limit)


def get_estimation_hit_markers(project_sprint_pattern, limit):
    return _get_data(ESTIMATION_HIT_MARKERS_QUERY, _pattern=project_sprint_pattern, _limit=limit)


def get_estimation_hit_lines(project_sprint_pattern, limit):
    return _get_data(ESTIMATION_HIT_LINES_QUERY, _pattern=project_sprint_pattern, _limit=limit)


def get_sprint_completed_markers(project_sprint_pattern, limit):
    return _get_data(SPRINT_COMPLETED_QUERY, _pattern=project_sprint_pattern, _limit=limit)


def get_sprint_planned_markers(project_sprint_pattern, limit):
    return _get_data(SPRINT_PLANNED_QUERY, _pattern=project_sprint_pattern, _limit=limit)


def get_current_risks(project_sprint_pattern):
    return _get_data(RISKS_QUERY, _pattern=project_sprint_pattern)


def get_issues_and_risks(project_sprint_pattern):
    return _get_data(ISSUES_QUERY, _pattern=project_sprint_pattern)


def get_gantt(project_sprint_pattern):
    return _get_data(GANTT_QUERY, _pattern=project_sprint_pattern)


def get_active_work(project_sprint_pattern):
    return _get_data(ACTIVE_WORK_QUERY, _pattern=project_sprint_pattern)


def get_active_last_24h(project_sprint_pattern):
    return _get_data(ACTIVE_LAST_24H_NUM, _pattern=project_sprint_pattern)


def get_last_24h_commits(project_sprint_pattern):
    return _get_data(LAST_24H_COMMITS_NUM, _pattern=project_sprint_pattern)


def get_rework(project_sprint_pattern):
    return _get_data(REWORK_NUM, _pattern=project_sprint_pattern)


def get_new_risks(project_sprint_pattern):
    return _get_data(NEW_RISKS, _pattern=project_sprint_pattern)


def get_sprint_stat(project_sprint_pattern, limit):
    return _get_data(SPRINT_STATS, _pattern=project_sprint_pattern, _limit=limit)


def get_total_sprint_stats(project_sprint_pattern):
    return _get_data(TOTAL_NUMBER_OF_SPRINT_STATS, _pattern=project_sprint_pattern)


def get_risk_group_rate(project_sprint_pattern):
    return _get_data(RISK_GROUP_RATE, _pattern=project_sprint_pattern)


def get_risk_with_epics(project_sprint_pattern):
    return _get_data(EPIC_RISKS_QUERY, _pattern=project_sprint_pattern)


def get_all_activity(project_sprint_pattern):
    return _get_data(ALL_ACTIVITY, _pattern=project_sprint_pattern)

def get_projects_health():
    return _get_data(PROJECTS_HEALTH)

def get_planning_issues_risks(project_sprint_pattern):
    return _get_data(PLANNING_ISSUES_RISKS, _pattern=project_sprint_pattern)

def get_project_activity_strikes(project_sprint_pattern):
    return _get_data(PROJECT_ACTIVITY_STRIKES, _pattern=project_sprint_pattern)

def get_active_sprint_issues_activity_history(project_sprint_pattern):
    return _get_data(ACTIVE_SPRINT_ISSUES_ACTIVITY_HISTORY, _pattern=project_sprint_pattern)