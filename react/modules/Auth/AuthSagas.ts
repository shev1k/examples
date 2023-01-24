import { all, call, delay, fork, put, select } from 'redux-saga/effects';

import firebase from 'modules/firebase/firebase.app';

import { updateAuthToken } from './AuthActions';
import { getIsAuthenticated, getTokenCreationTime } from './AuthReducer';

const SecondInMS = 1000;
const TenSeconds = SecondInMS * 10;
const FiveMinutes = SecondInMS * 60 * 5;
const Hour = SecondInMS * 60 * 60;

const fetchToken = async () => {
  const { token } = await firebase.auth().currentUser.getIdTokenResult(true);
  return token;
};

export function* checkTokenForExpiration() {
  while (true) {
    const isAuthenticated = yield select(getIsAuthenticated);
    if (isAuthenticated) {
      const tokenCreationTime = yield select(getTokenCreationTime);
      const tokenExpirationTime = tokenCreationTime + Hour;
      const inFiveMinutes = Number(new Date()) + FiveMinutes;

      if (tokenExpirationTime < inFiveMinutes) {
        try {
          const newToken = yield call(fetchToken);
          yield put(
            updateAuthToken({
              accessToken: newToken,
              tokenCreationTime: Number(new Date()),
            }),
          );
        } catch (err) {
          console.log(err); //eslint-disable-line no-console
        }
      }
    }

    yield delay(TenSeconds);
  }
}

function* authSagas() {
  yield all([fork(checkTokenForExpiration)]);
}

export default authSagas;
