import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — AARKA",
  description: "How AARKA collects, uses, and protects your information.",
};

const sections = [
  {
    title: "Who we are",
    body: [
      "AARKA (aarka.io) is a strategic consulting and AI-first ventures practice led by Kabir Agarwal. For anything related to this policy or your data, contact kabir@aarka.io.",
    ],
  },
  {
    title: "What we collect",
    body: [
      "Contact form: when you send us a message, we receive the name, email address, area of interest, and message you provide. We use this solely to respond to your inquiry.",
      "Technical data: our hosting provider processes standard request logs (such as IP address and browser type) to serve and secure the site, as any web host does.",
      "Preferences: your light/dark theme choice is stored locally in your browser (localStorage). It never leaves your device. We do not use tracking cookies or analytics.",
    ],
  },
  {
    title: "How your information is used",
    body: [
      "Messages you send through the contact form are delivered to our email inbox and used only to respond to you and carry on the conversation you started. We do not add you to mailing lists, send marketing, or sell or share your information with third parties for their own use.",
    ],
  },
  {
    title: "Services we rely on",
    body: [
      "The site runs on Vercel (hosting), contact form email is delivered via Resend, and our mailbox is hosted on Google Workspace. Each processes data only as needed to provide their service to us.",
    ],
  },
  {
    title: "Retention",
    body: [
      "We keep correspondence for as long as it is relevant to our exchange or a working relationship. If you would like your messages deleted, just ask.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can request a copy of the information we hold about you, ask us to correct it, or ask us to delete it at any time by emailing kabir@aarka.io. We will respond promptly.",
    ],
  },
  {
    title: "Changes",
    body: [
      "If we change how the site handles data, we will update this page. Last updated: July 16, 2026.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-12 pb-24">
        <Link
          href="/"
          className="label-mono inline-block mb-16 transition-colors hover:text-[var(--accent-indigo)]"
          style={{ color: "var(--fg-dim)" }}
        >
          &larr; AARKA
        </Link>

        <span className="label-mono mb-4 block" style={{ color: "var(--accent-indigo)" }}>
          Legal
        </span>
        <h1 className="display-lg mb-16" style={{ color: "var(--fg-heading)" }}>
          Privacy <span className="gradient-text">Policy</span>
        </h1>

        <div className="space-y-12">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-black tracking-tight mb-4" style={{ color: "var(--fg-heading)" }}>
                {s.title}
              </h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-base leading-relaxed mb-3" style={{ color: "var(--fg-muted)" }}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
