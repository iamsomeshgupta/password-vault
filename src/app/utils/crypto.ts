const encoder = new TextEncoder();
const decoder = new TextDecoder();

function b64ToArr(b64: string) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
}
function arrToB64(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export async function deriveKey(password: string, saltB64: string) {
  const salt = b64ToArr(saltB64);
  const pwKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" },
    pwKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function exportKeyB64(key: CryptoKey) {
  const raw = await crypto.subtle.exportKey("raw", key);
  return arrToB64(raw);
}

export async function importKeyFromB64(b64: string) {
  const raw = b64ToArr(b64);
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
}

export async function encryptJSON<T extends object>(obj: T, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = encoder.encode(JSON.stringify(obj));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { ciphertext: arrToB64(ct), iv: arrToB64(iv.buffer) };
}

export async function decryptJSON(ciphertext: string, iv: string, key: CryptoKey) {
  const ct = b64ToArr(ciphertext);
  const ivBuf = new Uint8Array(b64ToArr(iv));
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivBuf }, key, ct);
  return JSON.parse(decoder.decode(pt));
}
