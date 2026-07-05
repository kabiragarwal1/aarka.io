"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Rocket,
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
} from "lucide-react";

const engagements: Record<
  string,
  {
    icon: typeof Briefcase;
    title: string;
    subtitle: string;
    description: string;
    details: string[];
    process: { step: string; desc: string }[];
    formFields: { name: string; label: string; type: string; placeholder: string; options?: string[] }[];
  }
> = {
  consulting: {
    icon: Briefcase,
    title: "Consulting Engagement",
    subtitle: "Strategic operating reviews, AI-readiness assessments, and execution design.",
    description:
      "Ideal for companies looking to modernize operations, adopt AI, or enter new markets. We embed with your team for 4–12 weeks to deliver implementation-ready strategy and roadmaps.",
    details: [
      "End-to-end operational review & process mapping",
      "AI strategy & automation roadmap",
      "Implementation-ready deliverables & playbooks",
      "Stakeholder alignment & change management",
      "Technology stack assessment & recommendations",
      "KPI framework design & measurement strategy",
    ],
    process: [
      { step: "Discovery", desc: "Deep-dive into your operations, goals, and pain points." },
      { step: "Analysis", desc: "Map processes, identify bottlenecks, and benchmark against best practices." },
      { step: "Strategy", desc: "Design actionable roadmap with clear milestones and ownership." },
      { step: "Delivery", desc: "Present implementation-ready deliverables with stakeholder buy-in." },
    ],
    formFields: [
      { name: "name", label: "Your Name", type: "text", placeholder: "Jane Smith" },
      { name: "email", label: "Work Email", type: "email", placeholder: "jane@company.com" },
      { name: "company", label: "Company", type: "text", placeholder: "Your company name" },
      { name: "size", label: "Company Size", type: "select", placeholder: "Select team size", options: ["1–10", "11–50", "51–200", "201–1000", "1000+"] },
      { name: "challenge", label: "Primary Challenge", type: "textarea", placeholder: "Describe the operational challenge or opportunity you'd like to address..." },
      { name: "timeline", label: "Desired Timeline", type: "select", placeholder: "When do you want to start?", options: ["Immediately", "Within 1 month", "1–3 months", "Exploring options"] },
    ],
  },
  hiring: {
    icon: Users,
    title: "Collaborate on Projects",
    subtitle: "Join our active ventures or bring your team to co-build with us.",
    description:
      "We're always building — and we want the right people in the room. Whether you're an individual contributor, a small team, or a studio looking for your next project, our collaborative universe is open. Plug into one of our active ventures or propose a collaboration on something new.",
    details: [
      "Join active builds across AI, SaaS & media intelligence",
      "Contribute as an individual or bring your team",
      "Work across product, data, engineering & design",
      "Flexible engagement — part-time, full-time, or project-based",
      "Shape products from the ground up alongside our core team",
      "Open to remote collaborators worldwide",
    ],
    process: [
      { step: "Reach Out", desc: "Tell us who you are, what you're great at, and what excites you." },
      { step: "Align", desc: "We match your skills and interests with our active projects and needs." },
      { step: "Onboard", desc: "Get context, access, and clarity — then start contributing immediately." },
      { step: "Co-Create", desc: "Build together with shared ownership, transparent workflows, and real impact." },
    ],
    formFields: [
      { name: "name", label: "Your Name", type: "text", placeholder: "Jane Smith" },
      { name: "email", label: "Email", type: "email", placeholder: "jane@example.com" },
      { name: "type", label: "You Are", type: "select", placeholder: "How would you describe yourself?", options: ["Individual contributor", "Small team / Studio", "Freelancer / Consultant", "Agency or company"] },
      { name: "skills", label: "Your Skills & Expertise", type: "textarea", placeholder: "What do you bring to the table? (e.g., full-stack engineering, product design, data science, growth marketing...)" },
      { name: "interest", label: "What Interests You?", type: "select", placeholder: "Which area excites you most?", options: ["AI & machine learning", "Product & design", "Engineering & infrastructure", "Data & analytics", "Growth & go-to-market", "Open to anything"] },
      { name: "message", label: "Tell Us More", type: "textarea", placeholder: "What kind of collaboration are you looking for? Any specific ventures of ours that caught your eye?" },
    ],
  },
  ventures: {
    icon: Rocket,
    title: "Venture Collaboration",
    subtitle: "Co-build AI-native products with strategic partnership and execution capability.",
    description:
      "Looking for a co-builder or strategic partner for an AI-native product? We bring capital strategy, product thinking, and hands-on execution capability. Equity, hybrid, or revenue-share models available.",
    details: [
      "Co-building AI-first products from 0 → 1",
      "Capital strategy & investor positioning",
      "Go-to-market execution & launch strategy",
      "Technical architecture & product roadmap",
      "Equity, hybrid, or revenue-share structures",
      "Long-term strategic partnership & advisory",
    ],
    process: [
      { step: "Evaluate", desc: "Assess the opportunity, market, and alignment with our thesis." },
      { step: "Structure", desc: "Design partnership terms, equity splits, and governance." },
      { step: "Build", desc: "Co-develop product with shared technical and strategic ownership." },
      { step: "Scale", desc: "Launch, iterate, and scale with ongoing strategic support." },
    ],
    formFields: [
      { name: "name", label: "Your Name", type: "text", placeholder: "Jane Smith" },
      { name: "email", label: "Email", type: "email", placeholder: "jane@startup.com" },
      { name: "venture", label: "Venture / Idea Name", type: "text", placeholder: "What are you building?" },
      { name: "stage", label: "Current Stage", type: "select", placeholder: "Where are you now?", options: ["Idea stage", "MVP / Prototype", "Early traction", "Growth stage", "Scaling"] },
      { name: "pitch", label: "Tell Us About It", type: "textarea", placeholder: "Describe the venture, market opportunity, and what kind of collaboration you're looking for..." },
      { name: "model", label: "Preferred Model", type: "select", placeholder: "Partnership structure", options: ["Equity partnership", "Revenue share", "Hybrid (equity + fee)", "Open to discussion"] },
    ],
  },
};

export default function EngagePage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = engagements[slug];

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const shapeY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const dotY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const glowY3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--fg-heading)" }}>Not Found</h1>
          <Link href="/" className="inline-flex items-center gap-2" style={{ color: "var(--accent)" }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  const inputStyle: React.CSSProperties = {
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-text)",
  };

  return (
    <main ref={ref} className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[200px]" style={{ background: "var(--hero-glow-a)" }} />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[200px]" style={{ background: "var(--hero-glow-b)" }} />
          <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full blur-[180px]" style={{ background: "var(--hero-glow-c)" }} />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
          <Link
            href="/#work-with-us"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-80"
            style={{ color: "var(--fg-muted)" }}
          >
            <ArrowLeft size={14} /> Back to Work With Us
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, var(--accent-indigo), var(--accent-rose))` }}>
              <Icon size={26} className="text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4" style={{ color: "var(--fg-heading)" }}>
              {data.title}
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {data.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details + Process */}
      <section className="relative py-20 overflow-hidden" style={{ background: "var(--section-warm)" }}>
        <motion.div className="absolute top-[20%] right-0 w-[400px] h-[400px] rounded-full blur-[180px] pointer-events-none" style={{ background: "var(--hero-glow-c)", y: glowY2 }} />
        <motion.div className="absolute bottom-[15%] left-0 w-[300px] h-[300px] rounded-full blur-[180px] pointer-events-none" style={{ background: "var(--hero-glow-d)", y: glowY2 }} />
        <motion.div className="absolute top-[30%] left-[5%] w-12 h-12 rounded-xl rotate-45 opacity-[0.04] hidden lg:block pointer-events-none" style={{ y: shapeY, border: "2px solid var(--accent-indigo)" }} />
        <motion.div className="absolute bottom-[20%] right-[8%] w-16 h-16 rounded-full opacity-[0.03] hidden lg:block pointer-events-none" style={{ y: shapeY, background: "var(--accent-amber)" }} />
        <motion.div className="absolute inset-0 opacity-[0.012] pointer-events-none" style={{ y: dotY, backgroundImage: "radial-gradient(var(--accent-indigo) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* What's included */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--fg-heading)" }}>What&apos;s Included</h2>
              <p className="mb-8 leading-relaxed" style={{ color: "var(--fg-muted)" }}>{data.description}</p>
              <div className="space-y-3">
                {data.details.map((d, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: "var(--accent-cyan)" }} />
                    <span className="text-sm" style={{ color: "var(--fg-muted)" }}>{d}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Process */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--fg-heading)" }}>Our Process</h2>
              <div className="space-y-6">
                {data.process.map((p, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))` }}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: "var(--fg-heading)" }}>{p.step}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="relative py-20 overflow-hidden" style={{ background: "var(--bg)" }}>
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[200px] pointer-events-none" style={{ background: "var(--hero-glow-a)", y: glowY3 }} />
        <motion.div className="absolute top-[20%] right-0 w-[350px] h-[350px] rounded-full blur-[180px] pointer-events-none" style={{ background: "var(--hero-glow-b)", y: glowY3 }} />
        <motion.div className="absolute top-[10%] right-[10%] w-10 h-10 rounded-lg rotate-12 opacity-[0.04] hidden lg:block pointer-events-none" style={{ y: shapeY, border: "2px solid var(--accent-rose)" }} />
        <motion.div className="absolute bottom-[10%] left-[12%] w-14 h-14 rounded-2xl -rotate-6 opacity-[0.03] hidden lg:block pointer-events-none" style={{ y: shapeY, border: "2px solid var(--accent-emerald)" }} />

        <div className="relative z-10 max-w-2xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: "var(--fg-heading)" }}>Get Started</h2>
            <p className="text-center mb-10" style={{ color: "var(--fg-muted)" }}>
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {data.formFields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg-heading)" }}>
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows={4}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                      style={inputStyle}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all appearance-none"
                      style={inputStyle}
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-4"
                style={{ background: `linear-gradient(to right, var(--accent-rose), var(--accent-indigo), var(--accent-blue))` }}
              >
                <Send size={16} />
                Submit Inquiry
              </button>
            </form>

            <p className="text-xs text-center mt-6" style={{ color: "var(--fg-dim)" }}>
              Or email us directly at{" "}
              <a href="mailto:kabir@aarka.io" className="underline" style={{ color: "var(--accent)" }}>kabir@aarka.io</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Other engagements */}
      <section className="relative py-16 overflow-hidden" style={{ background: "var(--section-warm)" }}>
        <motion.div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ y: dotY, backgroundImage: "radial-gradient(var(--accent-pink) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm font-mono tracking-wider uppercase mb-6" style={{ color: "var(--fg-dim)" }}>
            Other Ways to Work Together
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(engagements)
              .filter(([key]) => key !== slug)
              .map(([key, eng]) => (
                <Link
                  key={key}
                  href={`/engage/${key}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
                  style={{ border: "1px solid var(--surface-border)", background: "var(--surface-bg)", color: "var(--fg-muted)" }}
                >
                  {eng.title}
                  <ArrowRight size={14} />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
