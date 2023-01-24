import * as R from 'ramda';
import firebase from 'modules/firebase/firebase.app';

import * as actions from './AuthActions';

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string;
  tokenCreationTime?: number;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: '',
  tokenCreationTime: null,
};

const AuthReducer = (
  state: AuthState = initialState,
  action: Record<string, any>,
) => {
  switch (action.type) {
    case actions.UPDATE_AUTH_TOKEN: {
      return R.merge(state, { ...action.payload });
    }
    case actions.LOGOUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export const getIsAuthenticated = () =>
  firebase ? Boolean(firebase.auth().currentUser) : false;
export const getAuthToken = R.path(['auth', 'accessToken']);
export const getTokenCreationTime = R.path(['auth', 'tokenCreationTime']);

export default AuthReducer;
