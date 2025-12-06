'use client';
import { useState } from 'react';

type VoteResults = {
  A: number;
  B: number;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VoteResults | null>(null);

  async function vote(option: string) {
    setLoading(true);
    await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify({ option }),
    });
    setLoading(false);
    fetchResults();
  }

  async function fetchResults() {
    const res = await fetch('/api/results');
    setResults(await res.json());
  }

  return (
    <main className="h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Sistema de Votação</h1>

      <div className="flex gap-4">
        <button onClick={() => vote('A')} className="px-4 py-2 bg-blue-600 rounded">
          Votar em A
        </button>

        <button onClick={() => vote('B')} className="px-4 py-2 bg-green-600 rounded">
          Votar em B
        </button>
      </div>

      <button onClick={fetchResults} className="px-3 py-2 bg-gray-700 rounded">
        Atualizar resultados
      </button>

      {results && (
        <div className="mt-4 text-lg">
          <p>Votos A: {results.A}</p>
          <p>Votos B: {results.B}</p>
        </div>
      )}

      {loading && <p>Enviando voto...</p>}
    </main>
  );
}
