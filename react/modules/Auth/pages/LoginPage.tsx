import React from 'react';
import styled from 'styled-components';

import Footer from 'components/Footer';
import LoginForm from '../forms/LoginForm';

const LoginPage = () => {
  return (
    <Wrapper>
      <LoginForm />
      <Footer />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
`;

export default LoginPage;
