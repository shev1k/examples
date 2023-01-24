import styled from 'styled-components';

import UpdatePasswordForm from '../forms/UpdatePasswordForm';

const ResetPasswordPage = () => (
  <Container>
    <Form>
      <UpdatePasswordForm />
    </Form>
  </Container>
);

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

export default ResetPasswordPage;
