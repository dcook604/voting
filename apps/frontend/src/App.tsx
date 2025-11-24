import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { BatchDetail } from './pages/BatchDetail';
import { Dashboard } from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/batches/:id" element={<BatchDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
