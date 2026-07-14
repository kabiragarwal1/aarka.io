import { NextResponse } from "next/server";

const RECIPIENT = "kabir@aarka.io";
const TIMEOUT_MS = 10_000;

type Submission = { name: string; email: string; type: string; message: string };

/* Preferred transport — reliable, requires RESEND_API_KEY env var on Vercel. */
async function sendViaResend(s: Submission, apiKey: string): Promise<boolean> {
  const domain = process.env.RESEND_EMAIL_DOMAIN;
  const from =
    process.env.CONTACT_FROM_ADDRESS ||
    (domain ? `AARKA Contact Form <contact@${domain}>` : "AARKA Contact Form <onboarding@resend.dev>");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      from,
      to: [RECIPIENT],
      reply_to: s.email,
      subject: `[AARKA] ${s.type || "Inquiry"} from ${s.name}`,
      text: `Name: ${s.name}\nEmail: ${s.email}\nInterest: ${s.type || "Not specified"}\n\n${s.message}`,
    }),
  });
  if (!res.ok) {
    console.error("Resend failed:", res.status, await res.text().catch(() => ""));
  }
  return res.ok;
}

/* Fallback transport — keyless relay, requires one-time activation by the recipient. */
async function sendViaFormSubmit(s: Submission): Promise<boolean> {
  const params = new URLSearchParams({
    name: s.name,
    email: s.email,
    interest: s.type || "Not specified",
    message: s.message,
    _subject: `[AARKA] ${s.type || "Inquiry"} from ${s.name}`,
    _template: "table",
  });
  const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: params.toString(),
  });
  const data = await res.json().catch(() => null);
  const ok = res.ok && String(data?.success) === "true";
  if (!ok) {
    console.error("FormSubmit failed:", res.status, data);
  }
  return ok;
}

export async function POST(req: Request) {
  let body: Partial<Submission> & { company?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name = "", email = "", type = "", message = "", company } = body;

  // Honeypot field filled in → bot. Pretend success so it doesn't retry.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (!name.trim() || !email.trim() || !message.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  const submission: Submission = { name, email, type, message };

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const sent = apiKey
      ? await sendViaResend(submission, apiKey)
      : await sendViaFormSubmit(submission);
    if (!sent) {
      return NextResponse.json({ error: "Failed to send" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }
}
