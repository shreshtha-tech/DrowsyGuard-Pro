import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldAlert } from 'lucide-react';
import { demoDrivers } from '../data/demoDrivers';

const DriverDetails = () => {
  const { driverId } = useParams();
  const driver = demoDrivers.find((item) => item.id === Number(driverId));

  if (!driver) {
    return (
      <section className="rounded-xl border border-gray-700 bg-gray-800 p-6">
        <h1 className="text-2xl font-bold">Driver not found</h1>
        <Link to="/drivers" className="mt-4 inline-flex min-h-11 items-center gap-2 text-indigo-300 hover:text-indigo-200">
          <ArrowLeft className="h-4 w-4" /> Back to drivers
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Link to="/drivers" className="inline-flex min-h-11 items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200">
        <ArrowLeft className="h-4 w-4" /> Back to drivers
      </Link>
      <div className="rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Prototype record</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{driver.name}</h1>
            <p className="mt-2 flex items-center gap-2 text-gray-400"><MapPin className="h-4 w-4" />{driver.location}</p>
          </div>
          <span className="rounded-full bg-gray-900 px-3 py-1 text-sm text-gray-200">{driver.status}</span>
        </div>
        <div className="mt-8 rounded-lg bg-gray-900 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-gray-300"><ShieldAlert className="h-5 w-5" /> Drowsiness score</span>
            <strong className={driver.score >= 80 ? 'text-red-400' : driver.score >= 50 ? 'text-yellow-400' : 'text-green-400'}>{driver.score}%</strong>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-700">
            <div className={`h-full ${driver.score >= 80 ? 'bg-red-500' : driver.score >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${driver.score}%` }} />
          </div>
          <p className="mt-3 text-sm text-gray-500">This score is static demo content. Live detection history is not connected to the dashboard.</p>
        </div>
      </div>
    </section>
  );
};

export default DriverDetails;
