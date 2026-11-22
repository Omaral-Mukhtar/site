# Building Omar Mokhtar's Portfolio and AI Digital Twin

## What you will learn

This tutorial explains the portfolio website in this project from the perspective of a complete beginner in frontend coding. It is written around the code that is already here, rather than as a separate framework exercise.

By the end, you will understand:

- what Next.js, React, TypeScript, and Tailwind CSS do;
- how the website's files fit together;
- how a server and browser communicate;
- how the digital twin sends prompts through OpenRouter;
- how the design works on desktop and mobile;
- which parts you could improve next.

## Technology summary

| Technology | What it does in this project |
|---|---|
| Next.js | Runs the React website, provides routing, serves static files, and handles server API routes. |
| React | Builds the interface from reusable pieces called components. |
| TypeScript | Adds data and type checks to JavaScript. It catches mistakes while editing or building. |
| Tailwind CSS | Provides CSS utility classes. This project combines utilities with custom CSS in `globals.css`. |
| OpenRouter | Provides a single API for sending prompts to AI models. This project uses it from the server. |
| Nemotron 3 Ultra | The named OpenRouter model used by the digital twin. |
| Geist | A font package used in the root layout. |
| npm | Installs dependencies and runs project commands. |

The application is an App Router Next.js project. The App Router convention means that files in `src/app` become pages or server endpoints.

## Project structure

```text
.
|-- .env                         # Private local environment variables
|-- Profile.pdf                  # Original LinkedIn profile document
|-- public/
|   `-- Profile.pdf              # Copy served by the website
|-- package.json                 # Dependencies and npm scripts
|-- src/
|   `-- app/
|       |-- api/
|       |   `-- chat/
|       |       `-- route.ts     # Server-side OpenRouter endpoint
|       |-- DigitalTwin.tsx      # Interactive client-side chat component
|       |-- favicon.ico
|       |-- globals.css          # Complete visual design and responsive rules
|       |-- layout.tsx           # Shared document layout and metadata
|       `-- page.tsx             # Main portfolio page
`-- tutorial.md                  # This tutorial
```

### How to read this structure

Think of `page.tsx` as the main document. `layout.tsx` wraps every page with shared HTML, fonts, and page metadata. `globals.css` controls the visual appearance. `DigitalTwin.tsx` creates the interactive chat. `api/chat/route.ts` acts as a private backend that talks to OpenRouter.

## How the complete website works

```text
Browser
  |
  | requests http://127.0.0.1:3000
  v
Next.js page (`page.tsx`)
  |
  | sends normal HTML and JavaScript
  v
Browser renders the page
  |
  | user asks the digital twin
  v
DigitalTwin.tsx sends POST /api/chat
  |
  v
API route (`route.ts`) reads the private key
  |
  v
OpenRouter receives the prompt
  |
  v
Nemotron 3 Ultra creates an answer
  |
  v
API route validates and returns JSON
  |
  v
DigitalTwin.tsx displays the answer
```

The key security idea is that the browser never receives `OPENROUTER_API_KEY`. It only calls the internal `/api/chat` route. The API route reads the key from the server environment and contacts OpenRouter.

## Starting the project

In a terminal opened in the project directory, install dependencies once:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Open `http://127.0.0.1:3000`.

Create a production build:

```powershell
npm run build
```

Start the production server:

```powershell
npm run start
```

The scripts come from `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

## High-level walkthrough

### 1. The root layout

`src/app/layout.tsx` defines metadata and the outer HTML structure:

```tsx
export const metadata: Metadata = {
  title: "Omar Mokhtar — Software Engineer",
  description:
    "Software engineer specializing in backend development and cloud infrastructure.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- `metadata` controls the browser title and search-engine description.
- `RootLayout` is shared by every route.
- `children` means "insert this route's page here."
- The font variables come from the Geist imports.

This file imports `globals.css`, so the full stylesheet is available everywhere in the app.

### 2. The main portfolio page

`src/app/page.tsx` is the main server component. It contains the navigation, hero, ticker, About, journey timeline, portfolio placeholder, contact section, footer, and digital twin.

The navigation uses normal fragment links:

```tsx
<a href="#about">About</a>
<a href="#journey">Journey</a>
<a href="#work">Work</a>
```

Each link targets a matching ID such as:

```tsx
<section className="about shell" id="about">
```

This creates smooth in-page movement because `globals.css` includes:

```css
html {
  scroll-behavior: smooth;
}
```

### 3. Server versus client components

Next.js components are server components by default. A server component is useful for static content because it can be rendered ahead of time and does not need browser interactions.

The digital twin needs React state, button events, text input, and browser-only effects. That is why its file begins with:

```tsx
"use client";
```

The directive tells Next.js to run the component in the browser. The rest of the page stays a server component, with the chat mounted near the end:

```tsx
<footer className="footer shell">
  {/* footer content */}
</footer>
<DigitalTwin />
```

### 4. React state in the chat

State is a variable React observes. When state changes, React rerenders the component.

The chat uses three important pieces:

```tsx
const [open, setOpen] = useState(false);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
```

- `open` decides whether the chat panel appears.
- `input` stores what the visitor types.
- `loading` disables sending again while the model is working.

The message history is also state:

```tsx
type Message = {
  role: "user" | "assistant";
  content: string;
};

const [messages, setMessages] = useState<Message[]>([
  {
    role: "assistant",
    content: "Hi, I’m Omar’s digital twin...",
  },
]);
```

The `Message` type helps TypeScript ensure that every message has a role and a string body.

### 5. Opening and closing the chat

The launcher button toggles `open`:

```tsx
<button
  type="button"
  onClick={() => setOpen((value) => !value)}
  aria-expanded={open}
  aria-controls="digital-twin"
>
  {/* launcher content */}
</button>
```

The panel is rendered only when `open` is true:

```tsx
{open && (
  <aside id="digital-twin" aria-label="Chat with Omar's digital twin">
    {/* chat content */}
  </aside>
)}
```

The curly braces tell JSX to execute JavaScript. The `&&` means "render this only if `open` is true."

### 6. Sending a message

`sendMessage` is the main interaction function:

```tsx
async function sendMessage(event?: FormEvent, preset?: string) {
  event?.preventDefault();
  const content = (preset ?? input).trim();

  if (!content || loading) return;

  const nextMessages: Message[] = [
    ...messages,
    { role: "user", content },
  ];

  setMessages(nextMessages);
  setInput("");
  setLoading(true);
}
```

The function:

1. prevents the form from refreshing the page;
2. chooses typed text or a suggested question;
3. removes accidental outer spaces;
4. refuses blank messages;
5. immediately adds the visitor's message to the UI;
6. clears the input;
7. turns on the loading state.

It then makes a browser request:

```tsx
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: nextMessages }),
});
```

`/api/chat` is relative to the current website. The browser sends JSON containing the recent conversation.

The response is read and the assistant message is appended:

```tsx
const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "Unable to respond.");
}

setMessages([
  ...nextMessages,
  { role: "assistant", content: data.answer },
]);
```

Finally, `setLoading(false)` ends the pending state, even if the request failed.

### 7. Starter questions

Three common questions are declared once:

```tsx
const starters = [
  "What is Omar's experience?",
  "What cloud skills does he have?",
  "Tell me about his DevOps work.",
];
```

They are converted into buttons through `map`:

```tsx
{starters.map((starter) => (
  <button
    type="button"
    key={starter}
    onClick={() => sendMessage(undefined, starter)}
  >
    {starter}
  </button>
))}
```

`map` loops over the array and creates one button per question. `key` gives React a stable identity for each button.

### 8. Scrolling to the latest message

A ref points to the bottom of the chat:

```tsx
const endRef = useRef<HTMLDivElement>(null);
```

An effect runs after messages or loading states change:

```tsx
useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, open, loading]);
```

- `useRef` gives React a reference to a DOM element.
- `useEffect` runs side effects after rendering.
- `scrollIntoView` moves the chat to the newest message.

This is much cleaner than manually calculating the scroll position.

## Detailed code review: the OpenRouter API route

The route is at `src/app/api/chat/route.ts`. Its file location controls its URL:

```text
src/app/api/chat/route.ts -> /api/chat
```

### Reading the request

```tsx
export async function POST(request: Request) {
  const body = await request.json();
  const messages = body?.messages;
}
```

The browser uses `POST`, so Next.js calls the `POST` function. `request.json()` reads the JSON body.

The route rejects empty or malformed requests:

```tsx
if (!Array.isArray(messages) || messages.length === 0) {
  return Response.json(
    { error: "A message is required." },
    { status: 400 },
  );
}
```

Status `400` means the client sent a bad request.

### Keeping the API key private

```tsx
const apiKey = process.env.OPENROUTER_API_KEY;
```

`process.env` reads the server environment. The key is stored in `.env` as:

```env
OPENROUTER_API_KEY=your-private-key
```

Never expose a real key inside `page.tsx`, `DigitalTwin.tsx`, HTML, or browser JavaScript.

The route also checks that the key exists:

```tsx
if (!apiKey) {
  return Response.json(
    { error: "OpenRouter is not configured." },
    { status: 500 },
  );
}
```

Status `500` means the server configuration is incomplete.

### Limiting the conversation

The route accepts only user and assistant messages and sends at most the latest 12:

```tsx
const recentMessages = messages
  .filter((message) =>
    message &&
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string"
  )
  .slice(-12)
  .map((message) => ({
    role: message.role,
    content: message.content.slice(0, 4000),
  }));
```

This is a basic cost and prompt-size control. It prevents one oversized or malformed request from passing too much text to the model.

### Calling OpenRouter

The route calls OpenRouter's chat completions endpoint:

```tsx
const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
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
        /* system prompt and conversation */,
      ],
    }),
  },
);
```

The exact model name is a real OpenRouter model identifier. Changing it requires a matching model that is available to the account.

### The system prompt

The system message is a set of instructions that define the assistant's identity and facts:

```tsx
{
  role: "system",
  content:
    "You are Omar Mokhtar's professional digital twin. " +
    "Use only the verified career profile provided. " +
    "Do not invent employers, projects, metrics, or dates.",
}
```

The actual project uses a fuller version containing verified education and experience. It also tells the model to say when it does not know and to direct the visitor to Omar.

A system prompt is important because language models can guess. A concrete profile and prohibition against invented facts reduce unsupported claims.

### Returning a safe answer

OpenRouter's response shape contains an array of choices. This project takes the first choice:

```tsx
const data = await response.json();
const answer = data?.choices?.[0]?.message?.content;
```

Optional chaining, written as `?.`, safely reads nested properties even if they are missing.

The route validates the answer before returning JSON:

```tsx
if (typeof answer !== "string" || !answer.trim()) {
  return Response.json(
    { error: "The model returned no answer." },
    { status: 502 },
  );
}

return Response.json({ answer: answer.trim() });
```

Status `502` means the upstream service returned an invalid response.

### Error handling

The outer `try/catch` catches network and parsing failures:

```tsx
try {
  // validate, call OpenRouter, and return
} catch (error) {
  console.error("Digital twin chat error:", error);
  return Response.json(
    { error: "Unable to reach the AI service." },
    { status: 500 },
  );
}
```

It does not send internal provider details to the browser. It only returns a useful public error.

## Detailed code review: styling

The visual system is in `src/app/globals.css`.

### Design tokens

The stylesheet begins with reusable CSS variables:

```css
:root {
  --ink: #111511;
  --paper: #f4f5ef;
  --green: #c5ff3d;
  --line: rgba(17, 21, 17, 0.14);
}
```

Tokens make repeated colors consistent. Changing `--ink`, for example, updates every place that uses that variable.

The base layout uses:

- `shell` for maximum-width content;
- CSS grid for major sections;
- media queries for tablet and mobile;
- custom utility classes for the chat;
- borders and restrained shadows for an enterprise editorial look.

Example:

```css
.shell {
  width: min(1180px, calc(100% - 64px));
  margin-inline: auto;
}
```

This means the content is at most 1180 pixels wide, but on narrower screens it leaves 32 pixels on each side.

### The fixed chat surface

The floating launcher is removed visually when the panel opens:

```css
.twin-launcher.is-open {
  opacity: 0;
  pointer-events: none;
}
```

The chat panel uses a fixed position so it stays accessible as the visitor scrolls:

```css
.twin-panel {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: min(390px, calc(100vw - 32px));
  height: min(590px, calc(100vh - 48px));
  z-index: 51;
}
```

On mobile, an additional media query reduces the margins and uses nearly the full viewport width.

### Accessibility details already present

The chat includes several important accessibility choices:

- descriptive `aria-label` attributes;
- `aria-expanded` on the launcher;
- `aria-controls` linking the launcher to the panel;
- a live region for newly generated messages;
- a visible text label on the send button;
- disabled sending when input is empty or loading.

These do not replace keyboard testing or screen-reader testing, but they are strong foundations.

## Detailed code review: data flow

Here is the complete typed lifecycle:

```text
typed question
  -> input state
  -> sendMessage
  -> nextMessages array
  -> POST /api/chat
  -> server validates request
  -> server adds system prompt
  -> OpenRouter request
  -> model response
  -> server validates answer
  -> JSON response
  -> browser appends assistant message
```

The browser and server share a JSON contract:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What are Omar's cloud skills?"
    }
  ]
}
```

A successful API response is:

```json
{
  "answer": "Omar's primary cloud experience includes AWS..."
}
```

An error response is:

```json
{
  "error": "A useful public error message"
}
```

Keeping API requests and responses in predictable shapes makes frontend and backend code easier to debug.

## Debugging guide

### The page does not open

Check that the terminal still has the development server running and open:

```text
http://127.0.0.1:3000
```

If the server stopped, restart it:

```powershell
npm run dev
```

### The chat says OpenRouter is not configured

Confirm `.env` contains:

```env
OPENROUTER_API_KEY=your-key
```

Restart `npm run dev` after changing `.env`. Environment files are loaded when the server starts.

### The model is unavailable

Check that the model identifier is exactly:

```text
nvidia/nemotron-3-ultra-550b-a55b:free
```

Also verify that the OpenRouter account and model are available. If provider capacity is exhausted, the server may return a provider error rather than a chat answer.

### The build fails

Run:

```powershell
npm run build
```

Read the first red or TypeScript error at the bottom of the output. Fix the reported file and line, then rebuild. Do not ignore the build just because the page appears in development mode.

## Testing the chat manually

Open the website and:

1. click **Ask me anything**;
2. try **What is Omar's experience?**;
3. ask a follow-up question;
4. verify that loading appears;
5. verify that the answer is grounded in the profile;
6. test an empty or oversized message;
7. resize the window to phone width;
8. refresh the page and confirm the local chat UI opens again.

You can test the route directly with PowerShell:

```powershell
$body = @{
  messages = @(
    @{
      role = "user"
      content = "What cloud experience does Omar have?"
    }
  )
} | ConvertTo-Json -Depth 4

Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:3000/api/chat" `
  -ContentType "application/json" `
  -Body $body
```

This exercises the API without using the visual chat.

## Five improvements identified by a self-review

1. **Add a persistent structured profile source**

   Move the career facts into a typed data file or separate server context rather than embedding a long paragraph in the API route. This would make profile updates easier and reduce mismatches between the page, PDF, and model prompt.

2. **Add rate limiting and abuse protection**

   Add a per-IP or per-session limit in production. The current endpoint has no usage restriction, so a public deployment could generate unexpected OpenRouter usage costs.

3. **Improve streaming responses**

   Stream tokens from OpenRouter as they arrive instead of waiting for the complete answer. Streaming would make long responses feel faster and more conversational.

4. **Add automated tests**

   Add tests for message validation, missing API configuration, provider failures, starter questions, open/close behavior, and empty-message prevention. A route test should mock OpenRouter so tests do not depend on network capacity or API credits.

5. **Expand and verify accessibility**

   Add focus restoration when the panel closes, trap focus while it is open, add Escape-key support, and test with keyboard-only navigation and a screen reader. The existing labels are a good start, but a complete accessibility pass should include focus behavior.

## Final mental model

The project separates responsibilities:

- `page.tsx` assembles the portfolio.
- `globals.css` defines the visual language.
- `DigitalTwin.tsx` manages browser interaction.
- `route.ts` securely calls OpenRouter.
- `.env` stores the private key.
- `package.json` defines how the project runs.

Once you understand this separation, it becomes straightforward to customize content, change the design, add projects, or replace the chat model.
