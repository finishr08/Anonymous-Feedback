import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await genAI
      .getGenerativeModel({ model: "gemini-1.5-flash-latest" })
      .generateContentStream({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

    const stream = GoogleGenerativeAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof Error) {
      console.error("An unexpected error occurred:", error);
      return NextResponse.json(
        { name: error.name, message: error.message },
        { status: 500 }
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
}
