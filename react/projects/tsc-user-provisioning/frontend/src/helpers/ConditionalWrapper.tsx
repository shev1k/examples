import { PropsWithChildren } from 'react';

interface IConditionalWrapperProps extends PropsWithChildren<any> {
  condition: boolean;
  wrapper: React.FC<any>;
}

const ConditionalWrapper: React.FC<IConditionalWrapperProps> = ({
  condition,
  children,
  wrapper: Wrapper,
}) => (condition ? <Wrapper>{children}</Wrapper> : children);

export default ConditionalWrapper;
