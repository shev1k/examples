import { Navigate } from 'react-router-dom';

interface IPrivateRouteProps {
  isAllowed: boolean;
  redirectPath?: string;
  element: JSX.Element;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({
  isAllowed,
  redirectPath = '/login',
  element,
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return element;
};

export default PrivateRoute;
