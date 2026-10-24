import { History } from 'lucide-react';

const TripHistory = () => (
  <section className="space-y-6">
    <header>
      <h1 className="text-2xl font-bold sm:text-3xl">Trip History</h1>
      <p className="mt-1 text-sm text-gray-400">Recorded trips and fatigue summaries.</p>
    </header>
    <div className="rounded-xl border border-gray-700 bg-gray-800 px-5 py-12 text-center sm:px-8">
      <History className="mx-auto h-10 w-10 text-gray-500" />
      <h2 className="mt-4 text-lg font-semibold">Trip history is not connected</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-gray-400">
        The database has a trip model, but the app does not yet record trips or expose them to this dashboard. There are no live trips to display.
      </p>
    </div>
  </section>
);

export default TripHistory;
