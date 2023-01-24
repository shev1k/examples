import { createAction } from 'typesafe-actions';

const namespace = 'AUTH';

export const ADD_EMAIL_SUBSCRIPTION = `${namespace}/ADD_EMAIL_SUBSCRIPTION`;
export const UPDATE_AUTH_TOKEN = `${namespace}/UPDATE_AUTH_TOKEN`;
export const LOGOUT = `${namespace}/LOGOUT`;

export interface UserSubscriptionModel {
  email: string;
  name: string;
  isSubscribed: boolean;
}

export const addEmailSubscription = createAction(
  ADD_EMAIL_SUBSCRIPTION,
  action => (userSubscription: UserSubscriptionModel) =>
    action({
      request: {
        url: '/user/subscribe/add',
        method: 'post',
        data: userSubscription,
      },
    }),
);

export const updateAuthToken = (payload: {
  accessToken: string;
  tokenCreationTime: number;
}) => ({
  type: UPDATE_AUTH_TOKEN,
  payload,
});

export const logout = () => ({
  type: LOGOUT,
});
