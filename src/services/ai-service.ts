export async function analyzeScreen(buffer: Buffer | null): Promise<string> {
  if (!buffer) return "";

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "moondream",
      prompt:
        "Analyze the following screenshot and provide a detailed description of its contents.",
      images: [buffer.toString("base64")],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}
