"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Character {
  name: string;
  element: string;
  role: string;
}

interface Build {
  character: string;
  weapon: string;
  artifacts: string[];
  stats: Record<string, string>;
  notes: string;
}

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/characters")
      .then(res => setCharacters(res.data.characters))
      .catch(err => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  const fetchBuild = (name: string) => {
    setSelectedBuild(null); // Limpia la build anterior
    axios.get(`http://127.0.0.1:8000/api/builds/${encodeURIComponent(name)}`)
      .then(res => setSelectedBuild(res.data.build))
      .catch(err => console.error("Error fetching build:", err));
  };

  if (loading) return <p className="p-4 text-center">Loading...</p>;

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Characters</h1>
        <ul className="space-y-2">
          {characters.map((char, idx) => (
            <li key={idx} className="border p-2 rounded shadow-sm cursor-pointer hover:bg-gray-100"
                onClick={() => fetchBuild(char.name)}>
              <strong className="text-blue-600">{char.name}</strong> — {char.element} — {char.role}
            </li>
          ))}
        </ul>
      </div>

      <div>
        {selectedBuild ? (
          <div className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-bold mb-2">{selectedBuild.character} Build</h2>
            <p><strong>Weapon:</strong> {selectedBuild.weapon}</p>
            <p><strong>Artifacts:</strong> {selectedBuild.artifacts.join(", ")}</p>
            <p><strong>Stats:</strong></p>
            <ul className="list-disc pl-6">
              {Object.entries(selectedBuild.stats).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
            <p className="mt-2"><strong>Notes:</strong> {selectedBuild.notes}</p>
          </div>
        ) : (
          <p className="text-gray-500">Select a character to see their build</p>
        )}
      </div>
    </div>
  );
}