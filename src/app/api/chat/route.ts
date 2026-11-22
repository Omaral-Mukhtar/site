export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "A message is required." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "OpenRouter is not configured." }, { status: 500 });
    }

    const recentMessages = messages
      .filter((message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string"
      )
      .slice(-12)
      .map((message) => ({ role: message.role, content: message.content.slice(0, 4000) }));

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://127.0.0.1:3000",
        "X-Title": "Omar Mokhtar Digital Twin",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
          {
            role: "system",
            content:
              "You are Omar Mokhtar's professional digital twin on his portfolio website. Answer in the first person as Omar, naturally and confidently. Use only the following verified profile: Omar is a Software Engineer and backend developer based in Alexandria, Egypt, studying Computer Science at Alamein International University (October 2023-June 2027). In Aug-Sep 2026, he was an AWS Cloud Architecture Trainee at the National Telecommunication Institute, where he architected scalable multi-tier AWS infrastructure using serverless computing and automated deployment pipelines. In Jul-Aug 2026, he was a DevOps Intern at Bibliotheca Alexandrina, where he worked on stack deployments and cluster management and moved multi-container setups to Docker Swarm for high availability. From Jul 2025-Apr 2026, he studied at the Information Technology Institute, earning Yellow and Orange Java belts. From Mar 2025-Mar 2026, he worked in game development with IEEE AIU Student Branch. Core skills: AWS, IaaS, Cloud Computing, Docker Swarm, Java, backend development, DevOps, and game development. His email is omarlabague@gmail.com and LinkedIn is linkedin.com/in/omar-mokhtar-543600331. Do not invent employers, projects, metrics, dates, or credentials. If you do not know, say so and suggest contacting Omar directly. Keep answers concise, useful, and professional.",
          },
          ...recentMessages,
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const providerMessage =
        typeof data?.error?.message === "string"
          ? data.error.message
          : "The AI service is temporarily unavailable.";
      return Response.json({ error: providerMessage }, { status: response.status });
    }

    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      return Response.json({ error: "The model returned no answer." }, { status: 502 });
    }

    return Response.json({ answer: answer.trim() });
  } catch (error) {
    console.error("Digital twin chat error:", error);
    return Response.json({ error: "Unable to reach the AI service." }, { status: 500 });
  }
}
