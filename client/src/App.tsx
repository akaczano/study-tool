import React from 'react';
import AppNav from './components/AppNav'
import { Container } from 'react-bootstrap';
import { 
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { 
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

import Home from './pages/Home';
import Terms from './pages/Terms';
import Charts from './pages/Charts';
import Notes from './pages/Notes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
