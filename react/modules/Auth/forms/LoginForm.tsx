import * as R from 'ramda';
import React from 'react';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { compose } from 'recompose';
import { Button, Icon, Input, Message } from 'semantic-ui-react';
import styled from 'styled-components';

import * as authActions from 'modules/auth/AuthActions';
import { isBusinessEmail } from 'utils/utils';
import { validateEmail } from 'utils/utils';

import firebase, {
  microsoftOAuthProvider,
} from 'modules/firebase/firebase.app';

const authErrors = {
  invalidEmail: 'auth/invalid-email',
  userNotFound: 'auth/user-not-found',
  accountExists: 'auth/account-exists-with-different-credential',
  tooManyRequest: 'auth/too-many-requests',
  wrongPassword: 'auth/wrong-password',
};

const initialFormValues = {
  email: '',
  password: '',
};

interface IProps extends RouteComponentProps {
  updateAuthToken: (payload: {
    accessToken: string;
    tokenCreationTime: number;
  }) => void;
}

const LoginForm = ({ updateAuthToken, history }: IProps) => {
  const { t } = useTranslation();
  const [stage, setStage] = React.useState(0);
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [formValues, setValues] = React.useState(initialFormValues);
  const [error, setError] = React.useState('');

  const handleChange = (e: any) => {
    setError('');
    setValues(R.mergeLeft({ [e.target.name]: e.target.value }));
  };

  const handleBack = () => {
    setValues(R.mergeLeft({ password: '' }));
    setStage(stage - 1);
  };

  const handleFirebaseLogin = async () => {
    const { email, password } = formValues;

    setSubmitting(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const { token } = await firebase
        .auth()
        .currentUser.getIdTokenResult(true);

      updateAuthToken({
        accessToken: token,
        tokenCreationTime: Number(new Date()),
      });
      history.push('/transcripts');
    } catch (error) {
      switch (error.code) {
        case authErrors.userNotFound: {
          setError(t('login.error.userNotFound'));
          break;
        }
        case authErrors.invalidEmail: {
          setError(t('login.error.invalidEmail'));
          break;
        }
        case authErrors.tooManyRequest: {
          setError(t('login.error.tooManyRequests'));
          break;
        }
        case authErrors.wrongPassword: {
          setError(t('login.error.wrongPassword'));
          break;
        }
      }

      ReactGA.exception({
        description: error.message,
        fatal: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAzureLogin = async () => {
    firebase
      .auth()
      .signInWithPopup(microsoftOAuthProvider)
      .catch(err => {
        if (err.code === authErrors.accountExists) {
          return setError(t('login.error.accountExists'));
        }
        return setError(t('login.error.microsoft'));
      });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, password } = formValues;

    if (isSubmitting || email === '' || (stage === 1 && password === '')) {
      return;
    }

    if (stage === 0) {
      const isEmailValid = validateEmail(email);

      if (!isEmailValid) {
        setError(t('login.error.invalidEmail'));
        return;
      }

      const isBusinessAccount = isBusinessEmail(email);

      if (isBusinessAccount) {
        await handleAzureLogin();
        return;
      }

      return setStage(1);
    }

    if (stage === 1) {
      await handleFirebaseLogin();
    }
  };

  return (
    <Form data-test-id="form" onSubmit={handleSubmit}>
      <FormHeader>
        <h1>{t('login.header')}</h1>
        <span>{t('login.subHeader')}</span>
      </FormHeader>
      {stage !== 0 && (
        <Icon
          data-test-id="return-button"
          style={{
            position: 'absolute',
            top: '35px',
            left: '25px',
            cursor: 'pointer',
          }}
          name="angle left"
          size="large"
          onClick={handleBack}
        />
      )}
      <Swiper>
        <InputContainer
          data-test-id="first-log-in-step"
          isDisplayed={stage === 0}
        >
          <Input
            data-test-id="email-input"
            fluid
            onChange={handleChange}
            value={formValues.email}
            name="email"
            placeholder={t('common.email')}
          />
        </InputContainer>
        <InputContainer
          data-test-id="second-log-in-step"
          isDisplayed={stage === 1}
        >
          <Input
            data-test-id="password-input"
            fluid
            onChange={handleChange}
            value={formValues.password}
            type="password"
            name="password"
            placeholder={t('common.password')}
          />
        </InputContainer>
      </Swiper>

      {
        <CustomMessage
          data-test-id="error-message"
          style={{ display: error ? 'block' : 'none' }}
          content={error}
          size="tiny"
          negative
        />
      }

      <ButtonContainer>
        <Button
          data-test-id="submit-button"
          primary
          type="submit"
          loading={isSubmitting}
        >
          {stage === 1 ? t('login.submit') : t('login.next')}
        </Button>
      </ButtonContainer>
    </Form>
  );
};

const Form = styled.form`
  border: 1px solid #dadce0;
  border-radius: 3px;
  width: 400px;
  display: flex;
  flex-flow: column nowrap;
  padding: 60px 30px 40px 30px;
  overflow: hidden;
  margin: 80px auto 0 auto;
  position: relative;

  > div {
    width: 100%;
  }
`;

const FormHeader = styled.div`
  display: flex;
  flex-flow: column nowrap;
  text-align: center;
  margin-bottom: 25px;
  height: 80px;

  > h1 {
    margin-bottom: 0;
    min-height: auto;
  }

  > span {
    font-size: 16px;
  }
`;

const Swiper = styled.div`
  position: relative;
  height: 60px;
`;

const InputContainer = styled.div<{ isDisplayed: boolean }>`
  position: absolute;
  width: 338px;
  display: ${({ isDisplayed }) => (isDisplayed ? 'block' : 'none')};
`;

const CustomMessage = styled(Message)`
  padding: 10px !important;
  margin-top: 0 !important;
  margin-bottom: 2rem !important;
`;

const ButtonContainer = styled.div`
  text-align: right;
`;

const mapDispatchToProps = {
  updateAuthToken: authActions.updateAuthToken,
};

const enhance = compose<IProps, {}>(
  connect(null, mapDispatchToProps),
  withRouter,
);

export default enhance(LoginForm);
