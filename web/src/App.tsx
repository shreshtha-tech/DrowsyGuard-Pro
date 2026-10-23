import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white md:flex md:h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 pb-24 sm:p-6 sm:pb-24 md:min-h-0 md:overflow-auto md:p-6">
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
