import axios from "axios";

export async function analyzeScreen(
  buffer: Buffer | null,
  prompt: string = "Analyze the following screenshot and provide a detailed description of its contents.",
): Promise<string> {
  if (!buffer) return "";

  const { data } = await axios.post("http://localhost:11434/api/generate", {
    model: "moondream",
    prompt,
    images: [buffer.toString("base64")],
    stream: false,
  });

  return data.response;
}
