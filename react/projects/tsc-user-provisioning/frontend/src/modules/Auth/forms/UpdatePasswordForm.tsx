import { ArrowBack } from '@mui/icons-material';
import { Typography, IconButton } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Input, Button, Message } from 'components';
import { authService } from 'services';
import {
  Form,
  FormRow,
  FormBody,
  FormHeader,
  PasswordUpdateSuccess,
} from '../components';

const initialValues = {
  password: '',
  passwordConfirmation: '',
};

const UpdatePasswordForm = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { search } = useLocation();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const query = new URLSearchParams(search);
    const token = query.get('token');

    if (!token) return;

    try {
      const { password, passwordConfirmation } = values;
      await authService.updatePassword(password, passwordConfirmation, token);
      setValues(initialValues);
      setSuccess('Password updated successfully');
    } catch (error) {
      setError(error.message || error.password || error.passwordConfirmation);
    }
  };

  const onBack = () => navigate('/login');

  if (success) return <PasswordUpdateSuccess />;

  return (
    <Form onSubmit={onSubmit}>
      <FormHeader>
        <Typography variant="h3">Update password</Typography>
        <IconButton onClick={onBack}>
          <ArrowBack htmlColor="#000" fontSize="large" />
        </IconButton>
      </FormHeader>
      <Typography variant="body1" fontSize={16} marginTop={1.5}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, maxime.
      </Typography>
      <FormBody>
        <FormRow>
          <Input
            onChange={onChange}
            value={values.password}
            id="password"
            name="password"
            type="password"
            label="Password"
          />
        </FormRow>

        <FormRow>
          <Input
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            label="Password Confirmation"
            value={values.passwordConfirmation}
            onChange={onChange}
          />
        </FormRow>
      </FormBody>

      {error && <Message variant="error">{error}</Message>}
      <FormRow>
        <span />
        <Button type="submit">Submit</Button>
      </FormRow>
    </Form>
  );
};

export default UpdatePasswordForm;
