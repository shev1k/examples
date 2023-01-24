import { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

import { InputLabel, Message } from 'components';
import { main } from 'configs/theme';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<IInputProps> = ({
  label,
  id,
  error,
  helperText,
  ...inputProps
}) => (
  <Container>
    {label && id && <InputLabel htmlFor={id}>{label}</InputLabel>}
    <StyledInput isError={!!error} id={id} {...inputProps} />
    {(error || helperText) && (
      <Message variant={error ? 'error' : 'success'}>{error || helperText}</Message>
    )}
  </Container>
);

const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 15px;
`;

const StyledInput = styled.input<{ isError: boolean }>`
  width: 100%;
  padding: 5px;
  border: 1px solid #047e8b;
  border-radius: 3px;

  ${({ isError }) => isError && `border: 2px solid ${main.palette.error};`}}
`;

export default Input;
