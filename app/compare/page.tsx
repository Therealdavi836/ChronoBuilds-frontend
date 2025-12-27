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

export default function Compare() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const [build1, setBuild1] = useState<Build | null>(null);
  const [build2, setBuild2] = useState<Build | null>(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/characters")
      .then(res => setCharacters(res.data.characters))
      .catch(err => console.error(err));
  }, []);

  const fetchBuild = async (name: string, setter: Function) => {
    if (!name) return;
    try {
      const res = await axios.get(`http://localhost:8000/api/builds/${encodeURIComponent(name)}`);
      setter(res.data.build);
    } catch (err) {
      console.error("Failed to fetch build:", err);
      alert(`Could not load build for ${name}. Check if the database is seeded.`);
      setter(null);
    }
  };

  useEffect(() => {
    fetchBuild(selected1, setBuild1);
  }, [selected1]);

  useEffect(() => {
    fetchBuild(selected2, setBuild2);
  }, [selected2]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Compare Characters</h1>
      <div className="flex gap-4 mb-6">
        <select value={selected1} onChange={e => setSelected1(e.target.value)} className="border p-2 rounded">
          <option value="">Select Character 1</option>
          {characters.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>

        <select value={selected2} onChange={e => setSelected2(e.target.value)} className="border p-2 rounded">
          <option value="">Select Character 2</option>
          {characters.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {build1 && (
          <div className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-bold mb-2">{build1.character} Build</h2>
            <p><strong>Weapon:</strong> {build1.weapon}</p>
            <p><strong>Artifacts:</strong> {build1.artifacts.join(", ")}</p>
            <ul className="list-disc pl-6">
              {Object.entries(build1.stats).map(([key, value]) => <li key={key}>{key}: {value}</li>)}
            </ul>
            <p className="mt-2"><strong>Notes:</strong> {build1.notes}</p>
          </div>
        )}

        {build2 && (
          <div className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-bold mb-2">{build2.character} Build</h2>
            <p><strong>Weapon:</strong> {build2.weapon}</p>
            <p><strong>Artifacts:</strong> {build2.artifacts.join(", ")}</p>
            <ul className="list-disc pl-6">
              {Object.entries(build2.stats).map(([key, value]) => <li key={key}>{key}: {value}</li>)}
            </ul>
            <p className="mt-2"><strong>Notes:</strong> {build2.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}