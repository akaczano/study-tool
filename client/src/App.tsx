import React from 'react';
import AppNav from './components/AppNav'
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { 
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

import Home from './pages/Home';
import Terms from './pages/Terms';
import Charts from './pages/Charts';
import Notes from './pages/Notes';
import ViewChart from './components/charts/ViewChart';
import EditChart from './components/charts/EditChart';

const queryClient = new QueryClient();


function App() {
  return (
    
    <QueryClientProvider client={queryClient}>              
        <BrowserRouter>
          <AppNav />  
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/charts/:chartId" element={<ViewChart />} />
            <Route path="/charts/:chartId/edit" element={<EditChart />} /> 
            <Route path="/notes" element={<Notes />} />
          </Routes>
        </BrowserRouter>
    </QueryClientProvider>
  
  );
}

export default App;
