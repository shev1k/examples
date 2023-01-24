import styled from 'styled-components';

const Button = styled.button`
  width: fit-content;
  color: white;
  background: #037f8b;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  font-size: 0.9rem;

  &:focus {
    background: #037f8b;
  }

  &:hover {
    cursor: pointer;
    background: #037f8b;
  }
`;

export default Button;
