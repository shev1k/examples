import { Grid } from '@mui/material';

import { FormTextField } from 'components';
import { UseUserFormReturn } from '../hooks/useUserForm';
import FormSection from '../layout/FormSection';

interface IUserContactSectionProps {
  control: UseUserFormReturn['control'];
}

const UserContactSection: React.FC<IUserContactSectionProps> = ({ control }) => {
  return (
    <FormSection title="Contact">
      <Grid item xs={12}>
        <FormTextField
          required
          fullWidth
          control={control}
          id="firstname"
          name="firstname"
          label="First Name"
        />
      </Grid>
      <Grid item xs={12}>
        <FormTextField
          required
          fullWidth
          control={control}
          id="lastname"
          name="lastname"
          label="Last Name"
        />
      </Grid>
      <Grid item xs={12}>
        <FormTextField
          required
          fullWidth
          type="email"
          control={control}
          id="email"
          name="email"
          label="Email"
        />
      </Grid>
    </FormSection>
  );
};

export default UserContactSection;
