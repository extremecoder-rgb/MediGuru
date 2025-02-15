import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Message, streamText } from "ai";
import { rateLimiter } from "@/utils/rateLimiter";

// Maximum request time
export const maxDuration = 60;

// Verify environment variable
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing required environment variables");
}

// Initialize Gemini AI
const google = createGoogleGenerativeAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY!,
});

const model = google("models/gemini-1.5-pro", {
  safetySettings: [
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ],
});

export async function POST(req: Request) {
  try {
    if (!rateLimiter.canMakeRequest("gemini")) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          details: "Please wait before making more requests",
        }),
        { status: 429 }
      );
    }

    const {
      messages,
      data,
    }: { messages: Message[]; data: { reportData: string; userLang?: string } } = await req.json();

    const userQuestion = messages[messages.length - 1]?.content || "";
    const reportData = data?.reportData || "";
    const userLang = data?.userLang || "en"; // Default to English if no language detected

    if (!userQuestion) {
      return new Response(
        JSON.stringify({ error: "Invalid request. Missing data." }),
        { status: 400 }
      );
    }

    // Construct multilingual prompt
    const prompt = `
You are a multilingual medical AI assistant. Analyze the following clinical report and answer the question in the same language as the user. 

Clinical Report:
${reportData}

Question: ${userQuestion}

Reply in this language: ${userLang}`;

    // Send request to Gemini
    console.log(`Sending request to Gemini in language: ${userLang}...`);
    const result = await streamText({
      model,
      messages: [{ role: "user", content: prompt }],
    });

    rateLimiter.addRequest("gemini");
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Failed to process request",
        details: error?.message || "Unknown error",
      }),
      { status: error?.status || 500 }
    );
  }
}
