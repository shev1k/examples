import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import React from 'react';
import { CCol } from '@coreui/react';

import ProjectRisksTableWrapper from '../tables/ProjectRisksTableWrapper';
import { client } from 'src/services/client';
import { statusCategories } from 'src/constants/constants';
import { risksSelector, selectedProjectSelector } from '../reducer';
import { setRisks, setSelectedProject } from '../actions';
import ProjectSelect from 'src/components/ProjectSelect';

class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    // If the project is already selected we fetch to update data
    if (this.props.currentProjectKey.label) {
      this.loadChangeRisks();
    }
  }

  componentDidUpdate(prevProps) {
    const prevSelectedProject = prevProps.currentProjectKey.label || null;
    const nextSelectedProject = this.props.currentProjectKey.label || null;

    if (prevSelectedProject !== nextSelectedProject) {
      this.loadChangeRisks();
    }
  }

  removeRisksDuplicates = (risks) => {
    const ids = risks.map((r) => r.risk_id);

    if (ids.includes(8) && ids.includes(9)) {
      return risks.filter((r) => r.risk_id !== 9);
    }

    return risks;
  };

  removeStrikesDuplicates = (strikes) => {
    const ids = strikes.map((s) => Number(s.event_value));

    if (ids.includes(8) && ids.includes(9)) {
      return strikes.filter((s) => Number(s.event_value) !== 9);
    }

    return strikes;
  };

  normalizeIssues = (issues) =>
    issues.map((issue) => {
      const {
        aggregatetimeoriginalestimate,
        description,
        strikes = [],
        risks,
        status_category_name,
        status_name,
      } = issue;
      const newStrikes = [...strikes];
      let newRisks = [...risks];

      if (description) {
        newStrikes.push({ event_value: 12 });
        newRisks = newRisks.filter((r) => r.risk_id !== 12);
      }

      if (aggregatetimeoriginalestimate) {
        newStrikes.push({ event_value: 11 });
        newRisks = newRisks.filter((r) => r.risk_id !== 11);
      }

      // If the issue is in qa or testing we replace status_category_name with "in qa"
      // otherwise we use current status category
      let mapped_status = status_category_name;
      if (status_name.toLowerCase().match(/qa|test/)) {
        mapped_status = statusCategories.IN_QA;
      }

      return {
        ...issue,
        strikes: this.removeStrikesDuplicates(newStrikes),
        risks: this.removeRisksDuplicates(newRisks),
        status_category_name: mapped_status,
      };
    });

  loadChangeRisks = async () => {
    this.setState({ loading: true });
    const { setRisks } = this.props;
    const params = {
      project_key: this.props.currentProjectKey.label || '',
    };

    try {
      await client.get('/data/all_risks/', { params }).then(({ data }) => {
        setRisks({ risks: this.normalizeIssues(data.data) });
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <>
        <CCol md="12">
          <ProjectSelect />
        </CCol>
        <CCol md="12">
          {this.state.loading ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginTop: 25,
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            this.props.change_risks &&
            this.props.change_risks.length !== 0 && (
              <ProjectRisksTableWrapper initialData={this.props.change_risks} />
            )
          )}
        </CCol>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  change_risks: risksSelector(state),
  currentProjectKey: selectedProjectSelector(state),
});

const mapDispatchToProps = {
  setRisks,
  setSelectedProject,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
