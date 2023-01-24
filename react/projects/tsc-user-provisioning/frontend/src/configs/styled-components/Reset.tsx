import { createGlobalStyle } from 'styled-components';

const Reset = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  html {
    font-size: 14px;
  }

  html, body, #root, #root > * {
    height: 100%;
  }
`;

export default Reset;
