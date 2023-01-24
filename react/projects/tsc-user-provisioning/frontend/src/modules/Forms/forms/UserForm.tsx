import { Container, FormFooter, FormHeader } from '../layout';

import UserContactSection from '../sections/UserContactSection';
import UserOrganizationSection from '../sections/UserOrganizationSection';
import UserCafeDetailsSection from '../sections/UserCafeDetailsSection';
import useUserForm from '../hooks/useUserForm';

const UserForm = () => {
  const { isEdit, control, setValue, handleSubmit, watch } = useUserForm();

  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Container onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title={`${isEdit ? 'Update' : 'New'} Café User`} />
      <UserContactSection control={control} />
      <UserOrganizationSection control={control} setValue={setValue} watch={watch} />
      <UserCafeDetailsSection control={control} />
      <FormFooter submitLabel={isEdit ? 'Save' : 'Create'} />
    </Container>
  );
};

export default UserForm;
