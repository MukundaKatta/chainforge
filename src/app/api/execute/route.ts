import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, model, temperature, maxTokens } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: `[Simulated ${model} response] Based on the prompt: "${prompt.slice(0, 100)}..." — This is a simulated response. Configure OPENAI_API_KEY for real responses.`,
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: temperature || 0.7,
        max_tokens: maxTokens || 2048,
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No response";
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
