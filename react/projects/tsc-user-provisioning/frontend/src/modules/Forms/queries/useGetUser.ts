import { useQuery } from '@tanstack/react-query';

import { userService } from 'services';
import { userDefaultValues } from '../constants';

const fetchUser = async ({ userId }) => {
  if (!userId) return Promise.resolve(userDefaultValues);
  return await userService.fetchUser({ userId });
};

interface IUseGetUserOptions {
  // should be undefined when creating a user to set empty default values inside form
  userId: string | undefined;
}

const useGetUser = ({ userId }: IUseGetUserOptions) => {
  const { data, error, isLoading, isFetching } = useQuery(['user', userId], () =>
    fetchUser({ userId }),
    {
      placeholderData: userDefaultValues
    }
  );

  return { data, error, loading: isLoading || isFetching };
};

export default useGetUser;
