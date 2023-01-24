import * as R from 'ramda';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { authAtom } from 'atoms';
import { authService, cookieService, userService } from 'services';

interface IAuthController {
  children: JSX.Element;
}

const AuthGuard: React.FC<IAuthController> = ({ children }) => {
  const setAuth = useSetRecoilState(authAtom);
  const [canRender, setCanRender] = useState(false);

  if (!canRender) {
    const { refreshToken } = cookieService.getTokens();

    setTimeout(() => {
      if (refreshToken) {
        authService
          .getCurrentUser()
          .then((user) => {
            setAuth({
              isAuth: true,
              user: R.assoc(
                'accountType',
                userService.getAccountType(user.role),
                user,
              ),
            });
          })
          .catch((_error) => {
            setAuth({ isAuth: false, user: null });
          })
          .finally(() => setCanRender(true));
      } else {
        setAuth({ isAuth: false, user: null });
        setCanRender(true);
      }
    });
  }

  return canRender ? children : <></>;
};

export default AuthGuard;
