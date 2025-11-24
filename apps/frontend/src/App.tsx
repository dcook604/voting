import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { BatchDetail } from './pages/BatchDetail';
import { CreateBatch } from './pages/CreateBatch';
import { Dashboard } from './pages/Dashboard';
import { InfractionDetail } from './pages/InfractionDetail';
import { Login } from './pages/Login';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/batches/new" element={<CreateBatch />} />
        <Route path="/batches/:batchId" element={<BatchDetail />} />
        <Route path="/batches/:batchId/infractions/:infractionId" element={<InfractionDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
