import * as R from 'ramda';
import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import styled from 'styled-components';

import * as authActions from 'modules/auth/AuthActions';
import { isBusinessEmail } from 'utils/utils';
import firebase, {
  functions,
  microsoftOAuthProvider,
} from 'modules/firebase/firebase.app';

import SignInWithMicrosoft from '../components/SignInWithMicrosoft';

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

export interface IState {
  email: string;
  errorMessage?: string;
  isSubmitting: boolean;
  name: string;
  password: string;
}

class SignUp extends PureComponent<any, any> {
  public constructor(props: any) {
    super(props);

    this.state = {
      email: '',
      name: '',
      password: '',
      privacy: true,
      isBusinessUser: false,
      isSubscribed: true,
      isSubmitting: false,
      isSubmitDisabled: true,
    };
  }

  private setProfileLanguage = async () => {
    const updateProfileLanguage = functions.httpsCallable(
      'updateProfileLanguage',
    );

    await updateProfileLanguage({ language: navigator.language });
  };

  private handleAzure = () => {
    firebase
      .auth()
      .signInWithPopup(microsoftOAuthProvider)
      .then((data: Record<string, any>) => {
        const { isSubscribed } = this.state;
        const { displayName, email } = data.user;
        this.props.addEmailSubscription({
          name: displayName,
          email,
          isSubscribed,
        });
      })
      .then(() => {
        const updatePolicyAcceptDate = functions.httpsCallable(
          'updatePolicyAcceptDate',
        );

        updatePolicyAcceptDate();
      })
      .then(() => this.setProfileLanguage())
      .catch(err => {
        if (err.code === ERROR_CODE_ACCOUNT_EXISTS) {
          this.setState({
            errorMessage:
              'An account with this E-Mail address already exists. Try to login with this account instead.',
          });
          return;
        }
        this.setState({
          errorMessage: 'An error occures during Microsoft sign in',
        });
      });
  };

  private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      this.state.isSubmitting ||
      this.state.name === '' ||
      this.state.email === '' ||
      this.state.password === ''
    ) {
      return;
    }

    this.setState({ isSubmitting: true, errorMessage: undefined });

    const { email, name, password, isSubscribed } = this.state;
    const { t } = this.props;

    try {
      await this.props.firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const {
        token,
      } = await this.props.firebase.auth().currentUser.getIdTokenResult(true);
      const updateUserName = functions.httpsCallable('updateUserName');
      const updatePolicyAcceptDate = functions.httpsCallable(
        'updatePolicyAcceptDate',
      );
      await updatePolicyAcceptDate();
      await updateUserName({ name });
      await this.setProfileLanguage();
      await this.props.addEmailSubscription({ name, email, isSubscribed });
      await this.props.updateAuthToken({
        accessToken: token,
        tokenCreationTime: Number(new Date()),
      });
      this.props.history.push('/transcripts');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.setState({ errorMessage: t('homePage.form.errors.emailInUse') });
          break;
        case 'auth/invalid-email':
          this.setState({
            errorMessage: t('homePage.form.errors.emailInvalid'),
          });
          break;
        case 'auth/weak-password':
          this.setState({
            errorMessage: t('homePage.form.errors.weakPassword'),
          });
          break;
        default:
          this.setState({ errorMessage: error.message });
          break;
      }

      ReactGA.exception({
        description: error.message,
        fatal: false,
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  private handleFormValuesChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const { isSubmitting } = this.state;

    const newState = {
      ...this.state,
    };

    if (e.target.type === 'checkbox') {
      newState[e.target.name] = !this.state[e.target.name];
    } else {
      newState[e.target.name] = e.target.value;
    }

    if (e.target.name === 'email') {
      newState.isBusinessUser = isBusinessEmail(e.target.value);
    }

    const isSubmitDisabled =
      isSubmitting ||
      R.isEmpty(newState.name) ||
      R.isEmpty(newState.email) ||
      R.isEmpty(newState.password) ||
      !newState.privacy;

    return this.setState({ ...newState, isSubmitDisabled });
  };

  public render() {
    const { t } = this.props;

    return (
      <Segment stacked={false}>
        <Header as="h1">{t('homePage.form.header')}</Header>
        <Form
          onChange={this.handleFormValuesChange}
          onSubmit={this.handleSubmit}
        >
          <Hideable isHidden={this.state.isBusinessUser}>
            <FormField>
              <label>{t('common.name')}</label>
              <Form.Input type="text" name="name" value={this.state.name} />
            </FormField>
          </Hideable>

          <FormField>
            <label>{t('common.email')}</label>
            <Form.Input type="text" name="email" value={this.state.email} />
          </FormField>
          <Hideable isHidden={this.state.isBusinessUser}>
            <FormField>
              <label>{t('common.password')}</label>
              <Form.Input
                type="password"
                name="password"
                value={this.state.password}
              />
            </FormField>
            <CheckboxContainer>
              <FormFieldInline>
                <FormInput
                  checked={this.state.privacy}
                  type="checkbox"
                  name="privacy"
                />
                <span>
                  {t('signUp.accept')}{' '}
                  <Link to="/privacy-policy">{t('signUp.privacy')}</Link>
                </span>
              </FormFieldInline>
              <FormFieldInline>
                <FormInput
                  checked={this.state.isSubscribed}
                  type="checkbox"
                  name="isSubscribed"
                />
                <span>{t('signUp.newsletter')}</span>
              </FormFieldInline>
            </CheckboxContainer>
          </Hideable>
          <RowContainer>
            {!this.state.isBusinessUser && (
              <Button
                disabled={this.state.isSubmitDisabled}
                primary={true}
                loading={this.state.isSubmitting}
                type="submit"
                size="large"
              >
                {t('homePage.form.submit')}
              </Button>
            )}
            <MicrosoftButton type="button" onClick={this.handleAzure}>
              <SignInWithMicrosoft />
            </MicrosoftButton>
          </RowContainer>

          {this.state.errorMessage && (
            <Message negative={true} content={this.state.errorMessage} />
          )}
        </Form>
      </Segment>
    );
  }
}

const Hideable = styled.div<{ isHidden: boolean }>`
  width: 100%;
  display: ${({ isHidden }) => (isHidden ? 'none' : 'block')};
`;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const FormField = styled(Form.Field)`
  && {
    margin-bottom: 1em !important;
  }
`;

const FormInput = styled(Form.Input)`
  && {
    margin-bottom: 0 !important;
  }
`;

const FormFieldInline = styled(Form.Field)`
  && {
    display: flex;
    margin-right: 10px !important;

    > div {
      margin-right: 5px !important;
    }

    > span {
      margin-right: 20px !important;
    }
  }
`;

const MicrosoftButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  margin-left: 5px;
  height: 41px;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
`;

const mapDispatchToProps = {
  updateAuthToken: authActions.updateAuthToken,
  addEmailSubscription: authActions.addEmailSubscription,
};

export default compose(
  // eslint-disable-next-line prettier/prettier
  connect(null, mapDispatchToProps),
  withFirebase,
  withRouter,
  withTranslation(),
)(SignUp);
