import { Routes as Switch, Route, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { authAtom } from 'atoms';
import { Layout } from 'components';
import LoginPage from 'modules/Auth/pages/LoginPage';
import ResetPasswordPage from 'modules/Auth/pages/ResetPasswordPage';
import PrivateRoute from './PrivateRoute';
import { routes } from './constants';

const Routes = () => {
  const { isAuth, user } = useRecoilValue(authAtom);

  const renderPrivateRoutes = () =>
    routes.map(({ path, roles, Component, componentProps = {} }, index) => {
      const isAllowed = isAuth && roles.includes(user.accountType);

      return (
        <Route
          key={index}
          path={path}
          element={
            <PrivateRoute
              isAllowed={isAllowed}
              element={<Component {...componentProps} />}
            />
          }
        />
      );
    });

  return (
    <Switch>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/password-reset" element={<ResetPasswordPage />} />
      <Route element={<PrivateRoute isAllowed={isAuth} element={<Layout />} />}>
        {renderPrivateRoutes()}
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Switch>
  );
};

export default Routes;
