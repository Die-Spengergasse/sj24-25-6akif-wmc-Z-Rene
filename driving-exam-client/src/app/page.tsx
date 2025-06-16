'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Module {
  guid: string;
  name: string;
  number: number;
}

export default function Home() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    api.get('/modules')
      .then(response => setModules(response.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Module</h1>
      <ul>
        {modules.map(mod => (
          <li key={mod.guid}>
            <a href={`/modules/${mod.guid}`}>{mod.name}</a>
          </li>
        ))}
      </ul>

      <h2>Sonstiges</h2>
      <ul>
        <li>
          <Link href="/exam">Prüfungssimulation</Link>
        </li>
      </ul>
    </div>
  );
}
