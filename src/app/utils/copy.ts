export async function copyWithAutoClear(text: string, clearMs = 12000) {
  await navigator.clipboard.writeText(text);
  setTimeout(async () => {
    try {
      await navigator.clipboard.writeText("");
    } catch {}
  }, clearMs);
}
