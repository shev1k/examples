import { Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useState } from 'react';

import { Input, Button } from 'components';
import { authService } from 'services';
import { Form, FormRow, FormBody, FormHeader } from '../components';
import { FORMS } from '../enums';

interface IResetPasswordForm {
  setForm: (form: FORMS) => void;
}

const ResetPasswordForm: React.FC<IResetPasswordForm> = ({ setForm }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setSuccess('');
    setEmail(event.target.value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await authService.forgotPassword(email);
      setSuccess('Reset password link is sent to your email');
    } catch (error) {
      setError(error.message || error.email);
    }
  };

  const onBack = () => setForm(FORMS.LOGIN);

  return (
    <Form onSubmit={onSubmit}>
      <FormHeader>
        <Typography variant="h3">Useful text!</Typography>
        <IconButton onClick={onBack}>
          <ArrowBack htmlColor="#000" fontSize="large" />
        </IconButton>
      </FormHeader>
      <Typography variant="body1" sx={{ fontSize: '1rem' }} marginTop={1.5}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, maxime.
      </Typography>
      <FormBody>
        <FormRow>
          <Input
            id="email"
            name="email"
            type="email"
            label="E-mail"
            value={email}
            error={error}
            helperText={success}
            onChange={onChange}
          />
        </FormRow>
      </FormBody>

      <FormRow>
        <span />
        <Button type="submit">Submit</Button>
      </FormRow>
    </Form>
  );
};

export default ResetPasswordForm;
