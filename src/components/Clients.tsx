const clients = [
  { name: "Coca-Cola", logo: "/logos/cocacola.svg" },
  { name: "Razorfish", logo: "/logos/razorfish.svg" },
  { name: "Johnson & Johnson", logo: "/logos/jnj.svg" },
  { name: "American Express", logo: "/logos/americanexpress.svg" },
  { name: "DBS Bank", logo: "/logos/dbs.svg" },
  { name: "Uber", logo: "/logos/uber.svg" },
  { name: "BigSpring", logo: "/logos/bigspring.svg" },
  { name: "Arixa Capital", logo: "/logos/arixacapital.svg" },
  { name: "Publicis Media", logo: "/logos/publicismedia.svg" },
  { name: "Velocity Road", logo: "/logos/velocityroad.svg" },
];

function LogoPill({ client }: { client: typeof clients[0] }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center px-6 py-3 rounded-full mx-3"
      style={{ background: "rgba(255,255,255,0.95)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={client.logo}
        alt={client.name}
        className="h-6 w-auto object-contain"
        loading="lazy"
      />
    </div>
  );
}

export default function Clients() {
  return (
    <section className="py-12 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6">
        <p className="label-mono text-center" style={{ color: "var(--fg-dim)" }}>
          Brands we&apos;ve worked with
        </p>
      </div>

      <div className="relative space-y-4">
        {/* Row 1 — left */}
        <div className="relative overflow-hidden">
          <div className="marquee-track">
            {[...clients, ...clients].map((client, i) => (
              <LogoPill key={`r1-${i}`} client={client} />
            ))}
          </div>
        </div>

        {/* Row 2 — right */}
        <div className="relative overflow-hidden">
          <div className="marquee-track-reverse">
            {[...clients, ...clients].map((client, i) => (
              <LogoPill key={`r2-${i}`} client={client} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
