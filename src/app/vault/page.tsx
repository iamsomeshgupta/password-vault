"use client";

import { useState, useEffect } from "react";
import PasswordGen from "../components/PasswordGen";
import { importKeyFromB64, encryptJSON, decryptJSON } from "../utils/crypto";

interface VaultItem {
  _id?: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

export default function VaultPage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
    (async () => {
      try {
        const r = await fetch("/api/vault", { headers: { Authorization: `Bearer ${token}` } });
        const list = await r.json();
        const keyB64 = localStorage.getItem("vaultKey");
        if (!keyB64) return;
        const key = await importKeyFromB64(keyB64);
        const decrypted: VaultItem[] = [];
        for (const it of list) {
          try {
            const data = await decryptJSON(it.ciphertext, it.iv, key);
            decrypted.push({ _id: it._id, title: data.title, username: data.username, password: data.password, url: data.url, notes: data.notes });
          } catch {}
        }
        setItems(decrypted);
      } catch {}
    })();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-semibold mb-6">Your Vault</h1>

      <section className="mb-8 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Add Item</h2>
        {msg && (
          <div className="mb-3 text-sm text-red-400">{msg}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="p-2 rounded bg-gray-700" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="p-2 rounded bg-gray-700" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input className="p-2 rounded bg-gray-700" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <input className="p-2 rounded bg-gray-700" placeholder="URL" value={url} onChange={e=>setUrl(e.target.value)} />
          <input className="p-2 rounded bg-gray-700 md:col-span-2" placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
        <div className="mt-3">
          <PasswordGen onChange={setPassword} />
        </div>
        <div className="mt-3">
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            onClick={async ()=>{
              setMsg("");
              const token = localStorage.getItem("token");
              if (!token) { setMsg("Session expired. Please log in again."); return; }
              if (!title || !username || !password) { setMsg("Fill title, username, and password."); return; }
              try {
                const keyB64 = localStorage.getItem("vaultKey");
                if (!keyB64) { setMsg("Missing encryption key. Log in again."); return; }
                const key = await importKeyFromB64(keyB64);
                const { ciphertext, iv } = await encryptJSON({ title, username, password, url, notes }, key);
                const res = await fetch("/api/vault", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ ciphertext, iv })
                });
                if (res.ok) {
                  const newItem = await res.json();
                  setItems(prev=>[...prev, { _id: newItem._id, title, username, password, url, notes }]);
                  setTitle(""); setUsername(""); setPassword(""); setUrl(""); setNotes("");
                  setMsg("Added.");
                } else {
                  const data = await res.json().catch(()=>({ error: "Request failed" }));
                  setMsg(data.error || `Error ${res.status}`);
                }
              } catch (e: any) {
                setMsg(e?.message || "Unexpected error");
              }
            }}
          >Add</button>
        </div>
      </section>
      <input
        type="text"
        placeholder="Search..."
        className="w-full max-w-md mb-6 p-2 rounded bg-gray-800 text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <p className="text-gray-400">No passwords saved yet.</p>
        ) : (
          items
            .filter((item) =>
              (item.title + " " + item.username + " " + (item.url||"") + " " + (item.notes||"")).toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <div
                key={item._id}
                className="bg-gray-800 p-4 rounded-lg shadow-md"
              >
                {editingId === item._id ? (
                  <>
                    <input className="mb-2 p-2 rounded bg-gray-700 w-full" value={item.title} onChange={e=>setItems(prev=>prev.map(x=>x._id===item._id?{...x,title:e.target.value}:x))} />
                    <input className="mb-2 p-2 rounded bg-gray-700 w-full" value={item.username} onChange={e=>setItems(prev=>prev.map(x=>x._id===item._id?{...x,username:e.target.value}:x))} />
                    <input className="mb-2 p-2 rounded bg-gray-700 w-full" value={item.password} onChange={e=>setItems(prev=>prev.map(x=>x._id===item._id?{...x,password:e.target.value}:x))} />
                    <input className="mb-2 p-2 rounded bg-gray-700 w-full" placeholder="URL" value={item.url||""} onChange={e=>setItems(prev=>prev.map(x=>x._id===item._id?{...x,url:e.target.value}:x))} />
                    <input className="mb-2 p-2 rounded bg-gray-700 w-full" placeholder="Notes" value={item.notes||""} onChange={e=>setItems(prev=>prev.map(x=>x._id===item._id?{...x,notes:e.target.value}:x))} />
                    <div className="flex gap-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm" onClick={async ()=>{
                        try {
                          const token = localStorage.getItem("token");
                          const keyB64 = localStorage.getItem("vaultKey");
                          if (!token || !keyB64 || !item._id) return;
                          const key = await importKeyFromB64(keyB64);
                          const { ciphertext, iv } = await encryptJSON({ title: item.title, username: item.username, password: item.password, url: item.url, notes: item.notes }, key);
                          const res = await fetch("/api/vault", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: item._id, ciphertext, iv }) });
                          if (res.ok) setEditingId(null);
                        } catch {}
                      }}>Save</button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm" onClick={()=>setEditingId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-bold">{item.title}</h2>
                    <p className="text-sm text-gray-400">{item.username}</p>
                    {item.url && <a className="text-blue-400 text-sm" href={item.url} target="_blank">{item.url}</a>}
                    {item.notes && <p className="text-sm text-gray-300 mt-1">{item.notes}</p>}
                    <div className="mt-2 flex gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        onClick={() => navigator.clipboard.writeText(item.password)}
                      >
                        Copy Password
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm" onClick={()=>setEditingId(item._id||null)}>Edit</button>
                    </div>
                  </>
                )}
                <button
                  className="mt-2 ml-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  onClick={async ()=>{
                    const token = localStorage.getItem("token");
                    if (!token || !item._id) return;
                    const res = await fetch("/api/vault", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ id: item._id })
                    });
                    if (res.ok) setItems(prev=>prev.filter(x=>x._id!==item._id));
                  }}
                >Delete</button>
              </div>
            ))
        )}
      </div>
    </main>
  );
}
