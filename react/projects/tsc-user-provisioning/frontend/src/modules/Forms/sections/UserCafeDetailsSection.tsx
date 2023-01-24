import { Grid } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';

import { authAtom } from 'atoms';
import { FormChipsSelect } from 'components';
import { getOptions } from 'utils';
import { UseUserFormReturn } from '../hooks/useUserForm';
import FormSection from '../layout/FormSection';

interface IUserCafeDetailsSectionProps {
  control: UseUserFormReturn['control'];
}

const UserCafeDetailsSection: React.FC<IUserCafeDetailsSectionProps> = ({
  control,
}) => {
  const user = useRecoilValue(authAtom).user;

  const cafeNumbersOptions = useMemo(() => getOptions(user.cafeNumbers), [user]);

  return (
    <FormSection title="Café Details">
      <Grid item marginTop={2} xs={12}>
        <FormChipsSelect
          formControlProps={{
            fullWidth: true,
            required: true,
          }}
          options={cafeNumbersOptions}
          control={control}
          id="cafe_number"
          name="cafe_number"
          label="Café Number"
        />
      </Grid>
    </FormSection>
  );
};

export default UserCafeDetailsSection;
