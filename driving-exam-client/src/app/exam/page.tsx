'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Module {
  guid: string;
  name: string;
  number: number;
}

export default function Exam() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedGuids, setSelectedGuids] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    api.get('/modules')
      .then(res => setModules(res.data))
      .catch(console.error);
  }, []);

  const toggleSelection = (guid: string) => {
    setSelectedGuids(prev =>
      prev.includes(guid)
        ? prev.filter(g => g !== guid)
        : [...prev, guid]
    );
  };

  const startExam = () => {
    if (selectedGuids.length === 0) {
      alert('Bitte wählen Sie mindestens ein Modul aus.');
      return;
    }
    // Weiterleitung auf die Fragenseite
    router.push(`/exam/start?modules=${selectedGuids.join(',')}`);
  };

  return (
    <div>
      <h1>Prüfungssimulation</h1>
      <ul>
        {modules.map(mod => (
          <li key={mod.guid}>
            <label>
              <input
                type="checkbox"
                checked={selectedGuids.includes(mod.guid)}
                onChange={() => toggleSelection(mod.guid)}
              />
              {mod.name}
            </label>
          </li>
        ))}
      </ul>

      <button onClick={startExam}>Prüfung starten</button>
    </div>
  );
}
