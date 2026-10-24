import { useEffect, useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const COMPACT_KEY = 'drowsyguard.compactCards';
const REDUCED_MOTION_KEY = 'drowsyguard.reducedMotion';

const readPreference = (key: string) => typeof window !== 'undefined' && window.localStorage.getItem(key) === 'true';

const Settings = () => {
  const [compactCards, setCompactCards] = useState(() => readPreference(COMPACT_KEY));
  const [reducedMotion, setReducedMotion] = useState(() => readPreference(REDUCED_MOTION_KEY));

  useEffect(() => {
    document.documentElement.dataset.compactCards = String(compactCards);
    window.localStorage.setItem(COMPACT_KEY, String(compactCards));
  }, [compactCards]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
    window.localStorage.setItem(REDUCED_MOTION_KEY, String(reducedMotion));
  }, [reducedMotion]);

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-gray-400">Preferences for this browser.</p>
      </header>

      <div className="divide-y divide-gray-700 rounded-xl border border-gray-700 bg-gray-800">
        <PreferenceRow
          title="Compact driver cards"
          description="Use less space for driver cards on the dashboard and Drivers page."
          checked={compactCards}
          onChange={setCompactCards}
        />
        <PreferenceRow
          title="Reduce motion"
          description="Minimize interface animation and transitions."
          checked={reducedMotion}
          onChange={setReducedMotion}
        />
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-gray-700 bg-gray-800/60 p-4 text-sm text-gray-400">
        <SettingsIcon className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" />
        <p>These preferences are stored in this browser only. Account, fleet, alert, and notification settings are not available yet.</p>
      </div>
    </section>
  );
};

function PreferenceRow({ title, description, checked, onChange }: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-20 cursor-pointer items-center justify-between gap-4 p-4 sm:p-5">
      <span>
        <span className="block font-medium text-white">{title}</span>
        <span className="mt-1 block text-sm text-gray-400">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 shrink-0 accent-indigo-500"
      />
    </label>
  );
}

export default Settings;
