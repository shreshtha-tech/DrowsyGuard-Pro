import { AlertTriangle } from 'lucide-react';

const Incidents = () => (
  <section className="space-y-6">
    <header>
      <h1 className="text-2xl font-bold sm:text-3xl">Incidents</h1>
      <p className="mt-1 text-sm text-gray-400">Safety alerts and SOS events.</p>
    </header>
    <div className="rounded-xl border border-gray-700 bg-gray-800 px-5 py-12 text-center sm:px-8">
      <AlertTriangle className="mx-auto h-10 w-10 text-gray-500" />
      <h2 className="mt-4 text-lg font-semibold">Incident records are not connected</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-gray-400">
        The API can record SOS incidents, but it does not yet provide a dashboard incidents endpoint. No live incident list can be shown here.
      </p>
    </div>
  </section>
);

export default Incidents;
