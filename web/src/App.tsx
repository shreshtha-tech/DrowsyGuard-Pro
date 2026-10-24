import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Drivers from './pages/Drivers';
import DriverDetails from './pages/DriverDetails';
import Incidents from './pages/Incidents';
import TripHistory from './pages/TripHistory';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white md:flex md:h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 pb-24 sm:p-6 sm:pb-24 md:min-h-0 md:overflow-auto md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/drivers/:driverId" element={<DriverDetails />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/history" element={<TripHistory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NotFound() {
  return (
    <section className="mx-auto max-w-xl rounded-xl border border-gray-700 bg-gray-800 p-6 text-center sm:p-10">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-400">That dashboard page does not exist.</p>
      <Link className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-4 font-medium hover:bg-indigo-700" to="/">
        Return to dashboard
      </Link>
    </section>
  );
}

export default App;
