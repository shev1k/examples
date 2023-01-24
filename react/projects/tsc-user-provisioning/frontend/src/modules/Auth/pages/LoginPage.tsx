import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { authAtom } from 'atoms';
import LoginForm from '../forms/LoginForm';
import ResetPasswordForm from '../forms/ResetPasswordForm';
import { FORMS } from '../enums';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuth } = useRecoilValue(authAtom);
  const [form, setForm] = useState(FORMS.LOGIN);

  useEffect(() => {
    if (isAuth) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  return (
    <Container>
      <Form>
        {form === FORMS.LOGIN && <LoginForm setForm={setForm} />}
        {form === FORMS.RESET_PASSWORD && <ResetPasswordForm setForm={setForm} />}
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.div`
  width: 400px;
  padding: 10px 15px;
  border: 1px solid #047e8b;
  border-radius: 3px;
`;

export default LoginPage;
