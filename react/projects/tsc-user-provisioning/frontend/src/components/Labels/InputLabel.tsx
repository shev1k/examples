import { LabelHTMLAttributes } from 'react';
import styled from 'styled-components';

interface IInputLabel extends LabelHTMLAttributes<HTMLLabelElement> {}

const InputLabel: React.FC<IInputLabel> = ({ children, ...rest }) => (
  <Label {...rest}>{children}</Label>
);

const Label = styled.label`
  margin-bottom: 5px;
  font-size: 0.9rem;
`;

export default InputLabel;
