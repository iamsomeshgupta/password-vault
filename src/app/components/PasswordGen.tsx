"use client";

import { useState } from 'react';

const LOOK_ALIKE = /[Il1O0o]/g;

function randomFrom(chars: string) {
  return chars[Math.floor(Math.random() * chars.length)];
}
interface PasswordGenProps {
  onChange?: (value: string) => void;
}
export default function PasswordGen({ onChange }: PasswordGenProps) {
  const [len, setLen] = useState(16);
  const [useLower, setLower] = useState(true);
  const [useUpper, setUpper] = useState(true);
  const [useNums, setNums] = useState(true);
  const [useSyms, setSyms] = useState(true);
  const [excludeLookAlikes, setExclude] = useState(true);

  function buildCharset() {
    let s = '';
    if (useLower) s += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) s += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNums) s += '0123456789';
    if (useSyms) s += '!@#$%^&*()-_=+[]{};:,.<>?';
    if (excludeLookAlikes) s = s.replace(LOOK_ALIKE, '');
    return s;
  }

  function generate() {
    const cs = buildCharset();
    if (!cs) return '';
    let out = '';
    for (let i = 0; i < len; i++) out += randomFrom(cs);
    onChange?.(out);
  }

  return (
    <div className="p-4 border rounded bg-gray-800 text-white">
      <div className="mb-2">
        <label>Length: {len}</label>
        <input type="range" min="8" max="64" value={len} onChange={e=>setLen(+e.target.value)} className="w-full" />
      </div>
      <div className="flex gap-2 flex-wrap">
        <label className="flex items-center gap-1"><input type="checkbox" checked={useLower} onChange={()=>setLower(!useLower)} /> a-z</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={useUpper} onChange={()=>setUpper(!useUpper)} /> A-Z</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={useNums} onChange={()=>setNums(!useNums)} /> 0-9</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={useSyms} onChange={()=>setSyms(!useSyms)} /> symbols</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={excludeLookAlikes} onChange={()=>setExclude(!excludeLookAlikes)} /> exclude look-alikes</label>
      </div>
      <div className="mt-3">
        <button onClick={generate} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white">Generate</button>
      </div>
    </div>
  );
}
