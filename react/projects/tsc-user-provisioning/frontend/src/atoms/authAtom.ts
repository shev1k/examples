import { atom } from 'recoil';

import { ICurrentUser } from 'modules/Auth/interfaces';

interface IAuthState {
  isAuth: boolean;
  user: ICurrentUser | null;
}

const authState = atom<IAuthState>({
  key: 'authState',
  default: {
    isAuth: false,
    user: null,
  },
});

export default authState;
