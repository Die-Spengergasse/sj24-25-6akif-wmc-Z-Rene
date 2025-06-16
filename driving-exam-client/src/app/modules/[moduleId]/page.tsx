'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface Topic {
  guid: string;
  name: string;
}

export default function ModuleTopics() {
  const { moduleId } = useParams();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    api.get(`/topics?assignedModule=${moduleId}`)
      .then(response => setTopics(response.data))
      .catch(console.error);
  }, [moduleId]);

  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map(topic => (
          <li key={topic.guid}>
            <a href={`/modules/${moduleId}/topics/${topic.guid}`}>{topic.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
