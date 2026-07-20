import { Globe, Linkedin } from "lucide-react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "What We Do", href: "/#ventures" },
  { label: "Journey", href: "/#journey" },
  { label: "Work With Us", href: "/#work-with-us" },
];

export default function Footer() {
  return (
    <footer className="py-16" style={{ borderTop: "1px solid var(--footer-border)", background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <span className="label-mono flex items-center gap-3" style={{ color: "var(--fg-dim)" }}>
            AARKA &copy; {new Date().getFullYear()}
            <span aria-hidden="true">·</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
              style={{ color: "var(--fg-dim)" }}
            >
              Privacy Policy
            </a>
          </span>

          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="label-mono transition-colors hover:text-white"
                style={{ color: "var(--fg-muted)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <
              href="https://www.linkedin.com/company/aarka1"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
              style={{ color: "var(--fg-muted)" }}
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://aarka.io"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
              style={{ color: "var(--fg-muted)" }}
              aria-label="aarka.io"
            >
              <Globe size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
