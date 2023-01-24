import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

import { UserRole, EmploymentStatus } from 'enums';
import { IUserFormFields } from '../interfaces';
import useGetUser from '../queries/useGetUser';
import { useEffect } from 'react';

const schema = yup.object().shape({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.string().equals(Object.values(UserRole)).required(),
  employment_status: yup.string().equals(Object.values(EmploymentStatus)).required(),
  decentralized_cafes: yup.string().when('role', {
    is: (role) => role === UserRole.franchisee,
    then: (schema) => schema.required(),
  }),
  is_head_of_decentralized_cafes: yup
    .boolean()
    .when(['role', 'decentralized_cafes'], {
      is: (role, decentralized_cafes) =>
        role === UserRole.franchisee && decentralized_cafes,
      then: (schema) => schema.required(),
    }),
  cafe_number: yup.array().of(yup.string()).required(),
});

const useUserForm = () => {
  const { userId } = useParams<'userId'>();
  const { data, loading } = useGetUser({ userId });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<IUserFormFields>({
    defaultValues: data,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!loading) {
      reset(data);
    }
  }, [data, loading, reset]);

  const isEdit = !!userId;

  return {
    control,
    errors,
    isEdit,
    handleSubmit,
    reset,
    setValue,
    watch,
  };
};

export type UseUserFormReturn = ReturnType<typeof useUserForm>;

export default useUserForm;
