import { Grid } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { authAtom } from 'atoms';
import { FormSelect, FormCheckbox } from 'components';
import { EmploymentStatus, UserRole } from 'enums';
import { EMPLOYMENT_STATUS_DISPLAY_MAP, LEARNER_ROLE_DISPLAY_MAP } from 'maps';
import { getOptions } from 'utils';
import { UseUserFormReturn } from '../hooks/useUserForm';
import FormSection from '../layout/FormSection';
import { ROLE_EMPLOYMENT_STATUS_MAP } from '../maps';

interface IUserOrganizationSectionProps {
  control: UseUserFormReturn['control'];
  setValue: UseUserFormReturn['setValue'];
  watch: UseUserFormReturn['watch'];
}

const UserOrganizationSection: React.FC<IUserOrganizationSectionProps> = ({
  control,
  setValue,
  watch,
}) => {
  const user = useRecoilValue(authAtom).user;

  const role = watch('role');
  const decentralizedCafes = watch('decentralized_cafes');

  const roleOptions = useMemo(
    () => getOptions(Object.keys(UserRole), LEARNER_ROLE_DISPLAY_MAP),
    [],
  );

  const employmentStatusOptions = useMemo(
    () => getOptions(Object.keys(EmploymentStatus), EMPLOYMENT_STATUS_DISPLAY_MAP),
    [],
  );

  const decentralizedCafesOptions = useMemo(
    () => getOptions(user.decentralizedCafes, EMPLOYMENT_STATUS_DISPLAY_MAP),
    [user],
  );

  useEffect(() => {
    setValue('employment_status', ROLE_EMPLOYMENT_STATUS_MAP[role]);

    if (role !== UserRole.franchisee) {
      setValue('decentralized_cafes', '');
    }
  }, [role, setValue]);

  const isFranchisee = role === UserRole.franchisee;
  const isDecentralizedCafeSelected =
    decentralizedCafes && decentralizedCafes.length > 0;

  return (
    <FormSection title="Organization">
      <Grid item marginTop={2} xs={6}>
        <FormSelect
          formControlProps={{
            fullWidth: true,
            required: true,
          }}
          options={roleOptions}
          control={control}
          id="role"
          name="role"
          label="Learner Role"
        />
      </Grid>
      <Grid item marginTop={2} xs={6}>
        <FormSelect
          formControlProps={{
            fullWidth: true,
            required: true,
          }}
          options={employmentStatusOptions}
          control={control}
          id="employment_status"
          name="employment_status"
          label="Employment Status"
        />
      </Grid>
      {isFranchisee && (
        <Grid item xs={6}>
          <FormSelect
            formControlProps={{
              fullWidth: true,
              required: true,
            }}
            options={decentralizedCafesOptions}
            control={control}
            id="decentralized_cafes"
            name="decentralized_cafes"
            label="Decentralized Cafes"
          />
        </Grid>
      )}
      {isFranchisee && isDecentralizedCafeSelected && (
        <Grid item xs={6}>
          <FormCheckbox
            control={control}
            name="is_head_of_decentralized_cafes"
            label="Decentralized cafes manager"
          />
        </Grid>
      )}
    </FormSection>
  );
};

export default UserOrganizationSection;
