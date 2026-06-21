export async function analyzeScreen(
  buffer: Buffer,
  prompt: string = "What is on this screen? Summarize briefly.",
): Promise<string> {
  //ТoDo; axios
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "moondream",
      prompt,
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
