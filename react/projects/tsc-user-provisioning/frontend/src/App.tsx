import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';

import { AuthGuard } from 'guards';
import { DebugObserver } from 'helpers';
import { Reset } from 'configs/styled-components';
import { Routes } from 'configs/routes';
import { mui } from 'configs/theme';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider theme={mui}>
        <RecoilRoot>
          <Reset />
          <DebugObserver />
          <AuthGuard>
            <Routes />
          </AuthGuard>
        </RecoilRoot>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
