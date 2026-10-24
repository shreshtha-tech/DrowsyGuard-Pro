export interface Driver {
  id: number;
  name: string;
  status: 'Active' | 'Warning' | 'Danger';
  score: number;
  location: string;
}

// These records are for the dashboard prototype; they are not live driver data.
export const demoDrivers: Driver[] = [
  { id: 1, name: 'John Doe', status: 'Active', score: 15, location: 'San Francisco, CA' },
  { id: 2, name: 'Jane Smith', status: 'Warning', score: 65, location: 'Oakland, CA' },
  { id: 3, name: 'Mike Ross', status: 'Danger', score: 92, location: 'San Jose, CA' },
];
