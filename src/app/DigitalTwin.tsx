"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starters = [
  "What is Omar's experience?",
  "What cloud skills does he have?",
  "Tell me about his DevOps work.",
];

export default function DigitalTwin() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I’m Omar’s digital twin. Ask me about my experience, skills, education, or career journey.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  async function sendMessage(event?: FormEvent, preset?: string) {
    event?.preventDefault();
    const content = (preset ?? input).trim();
    if (!content || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to respond.");
      setMessages([...nextMessages, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "I’m unable to respond right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        id="digital-twin-launcher"
        className={`twin-launcher ${open ? "is-open" : ""}`}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="digital-twin"
      >
        <span className="twin-launcher-avatar">OM</span>
        <span className="twin-launcher-copy">
          <small>AI DIGITAL TWIN</small>
          <strong>{open ? "Close chat" : "Ask me anything"}</strong>
        </span>
        <span className="twin-launcher-icon">{open ? "×" : "↗"}</span>
      </button>

      {open && (
        <aside className="twin-panel" id="digital-twin" aria-label="Chat with Omar's digital twin">
          <header className="twin-header">
            <div className="twin-avatar">OM<span /></div>
            <div>
              <p>Omar Mokhtar</p>
              <span><i /> Digital twin · Online</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>

          <div className="twin-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`twin-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.role === "assistant" && <span className="twin-message-avatar">OM</span>}
                <p>{message.content}</p>
              </div>
            ))}
            {loading && (
              <div className="twin-message assistant">
                <span className="twin-message-avatar">OM</span>
                <p className="thinking"><i /><i /><i /></p>
              </div>
            )}
            {messages.length === 1 && (
              <div className="twin-starters">
                {starters.map((starter) => (
                  <button type="button" key={starter} onClick={() => sendMessage(undefined, starter)}>
                    {starter} <span>↗</span>
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form className="twin-form" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about my career..."
              aria-label="Your question"
              maxLength={500}
            />
            <button type="submit" disabled={!input.trim() || loading} aria-label="Send message">↑</button>
          </form>
          <div className="twin-powered">Powered by Nemotron 3 Ultra</div>
        </aside>
      )}
    </>
  );
}
