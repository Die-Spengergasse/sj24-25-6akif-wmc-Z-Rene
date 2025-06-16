'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Image from 'next/image';

interface Answer {
  guid: string;
  text: string;
}

interface Question {
  guid: string;
  text: string;
  points: number;
  imageUrl?: string;
  answers: Answer[];
}

export default function ExamStart() {
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string[] }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const modulesParam = searchParams.get('modules');
    const moduleGuids = modulesParam ? modulesParam.split(',') : [];

    if (moduleGuids.length > 0) {
      api.get('/questions/exam', {
        params: {
          moduleGuids: moduleGuids,
          count: 20
        }
      })
        .then(response => setQuestions(response.data))
        .catch(err => setError(err.message));
    }
  }, [searchParams]);

  const handleAnswerChange = (questionGuid: string, answerGuid: string, checked: boolean) => {
    setUserAnswers(prev => {
      const prevAnswers = prev[questionGuid] || [];
      let updatedAnswers: string[];
      if (checked) {
        updatedAnswers = [...prevAnswers, answerGuid];
      } else {
        updatedAnswers = prevAnswers.filter(guid => guid !== answerGuid);
      }
      return { ...prev, [questionGuid]: updatedAnswers };
    });
  };

  const handleSubmit = () => {
    let reached = 0;

    questions.forEach(q => {
      const selectedAnswers = userAnswers[q.guid] || [];

      // Dummy-Bewertung: Punkte gibt’s, wenn mind. eine Antwort ausgewählt wurde
      if (selectedAnswers.length > 0) {
        reached += q.points;
      }
    });

    setScore(reached);
    setSubmitted(true);
  };

  if (error) return <div>Fehler: {error}</div>;
  if (questions.length === 0) return <div>Lade Fragen...</div>;

  return (
    <div>
      <h1>Prüfung</h1>

      {!submitted && (
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          {questions.map((q, index) => (
            <div key={q.guid} style={{ marginBottom: '20px' }}>
              <p><b>Frage {index + 1}:</b> {q.text}</p>

              {q.imageUrl && (
                <Image
                  src={q.imageUrl.startsWith('http') ? q.imageUrl : `http://localhost:5080${q.imageUrl}`}
                  alt={`Bild zur Frage ${index + 1}`}
                  width={600}
                  height={400}
                  style={{ marginBottom: '10px' }}
                />
              )}

              {q.answers.map(a => (
                <div key={a.guid}>
                  <label>
                    <input
                      type="checkbox"
                      name={`${q.guid}-${a.guid}`}
                      checked={userAnswers[q.guid]?.includes(a.guid) || false}
                      onChange={e => handleAnswerChange(q.guid, a.guid, e.target.checked)}
                    />
                    {a.text}
                  </label>
                </div>
              ))}
            </div>
          ))}

          <button type="submit">Abgeben</button>
        </form>
      )}

      {submitted && (
        <div>
          <h2>Ergebnis</h2>
          <p>Punkte erreicht: {score} von {questions.reduce((sum, q) => sum + q.points, 0)}</p>
        </div>
      )}
    </div>
  );
}
