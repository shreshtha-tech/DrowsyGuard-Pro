import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import DriverCard from '../components/DriverCard';
import { demoDrivers } from '../data/demoDrivers';

const Drivers = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const filteredDrivers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return demoDrivers.filter((driver) => {
      const matchesQuery = `${driver.name} ${driver.location}`.toLowerCase().includes(normalizedQuery);
      return matchesQuery && (status === 'All' || driver.status === status);
    });
  }, [query, status]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Drivers</h1>
        <p className="mt-1 text-sm text-amber-300">Showing prototype records, not live driver accounts.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 focus-within:border-indigo-400">
          <Search className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or location"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
          />
        </label>
        <select
          aria-label="Filter drivers by status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="min-h-11 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white outline-none focus:border-indigo-400"
        >
          {['All', 'Active', 'Warning', 'Danger'].map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      {filteredDrivers.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDrivers.map((driver) => <DriverCard key={driver.id} driver={driver} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-8 text-center text-gray-400">
          No prototype drivers match those filters.
        </div>
      )}
    </section>
  );
};

export default Drivers;
