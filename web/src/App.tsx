import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
