'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Image from 'next/image';

interface Answer {
  guid: string;
  text: string;
}

interface Question {
  guid: string;
  number: number;
  text: string;
  points: number;
  imageUrl?: string;
  answers: Answer[];
}

interface CheckResult {
  pointsReachable: number;
  pointsReached: number;
  checkResult: { [key: string]: boolean };
}

export default function TopicQuestions() {
  const { moduleId, topicId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkedAnswers, setCheckedAnswers] = useState<{ [key: string]: boolean }>({});
  const [result, setResult] = useState<CheckResult | null>(null);

  // Fragen laden
  useEffect(() => {
    api.get(`/questions?moduleGuid=${moduleId}&topicGuid=${topicId}`)
      .then(response => setQuestions(response.data))
      .catch(console.error);
  }, [moduleId, topicId]);

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentIndex];

  const handleCheckboxChange = (answerGuid: string) => {
    setCheckedAnswers(prev => ({
      ...prev,
      [answerGuid]: !prev[answerGuid]
    }));
  };

  const handleCheckAnswers = async () => {
    const payload = {
      checkedAnswers: currentQuestion.answers.map(answer => ({
        guid: answer.guid,
        isChecked: checkedAnswers[answer.guid] || false
      }))
    };

    try {
      const response = await api.post(`/questions/${currentQuestion.guid}/checkanswers`, payload);
      setResult(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextQuestion = () => {
    setResult(null);
    setCheckedAnswers({});
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{currentQuestion.text}</h1>

      {currentQuestion.imageUrl && (
        <Image
          src={currentQuestion.imageUrl}
          alt="Question image"
          width={400}
          height={300}
        />
      )}

      <ul>
        {currentQuestion.answers.map(answer => {
          const isChecked = checkedAnswers[answer.guid] || false;
          const isCorrect = result?.checkResult[answer.guid];

          let backgroundColor = '';
          if (result) {
            backgroundColor = isCorrect ? 'lightgreen' : 'salmon';
          }

          return (
            <li key={answer.guid} style={{ backgroundColor, marginBottom: '0.5rem' }}>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={!!result}
                  onChange={() => handleCheckboxChange(answer.guid)}
                />
                {answer.text}
              </label>
            </li>
          );
        })}
      </ul>

      {!result ? (
        <button onClick={handleCheckAnswers}>Antwort prüfen</button>
      ) : (
        <>
          <div>
            {result.pointsReached}/{result.pointsReachable} Punkte
          </div>
          {currentIndex < questions.length - 1 ? (
            <button onClick={handleNextQuestion}>Nächste Frage</button>
          ) : (
            <div>Alle Fragen abgeschlossen!</div>
          )}
        </>
      )}
    </div>
  );
}
