import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Shield,
  Sparkles,
  Crown,
  Film,
  ArrowRight,
  Mail,
  ExternalLink,
  Quote,
  Check,
  Ticket,
  LogIn,
  User,
} from "lucide-react";

// ------------------------------------------------------------
// THE UPGRADE SOCIETY — Single-file website (React)
// - Tailwind CSS assumed available
// - Hash-based routing (no deps)
// - YouTube integration: hero sizzle + 6 testimonial embeds
// - Black + gold design language
// ------------------------------------------------------------

const BRAND = {
  name: "THE UPGRADE SOCIETY",
  subtitle: "Ultimate Masterclass",
  tagline: "5-star living. 3-star budget.",
  presenter: "KRIS BUBAN",
  role: "Luxury Lifestyle Strategist & Educator",
  email: "support@theupgradesociety.com",
};

// Put these files in /public (Vite) or your host's public folder.
const ASSETS = {
  logoSrc: "/upgrade-society-logo.png",
  aboutPhotoSrc: "/kris.jpg",
};

// Replace with your actual YouTube IDs
const YT = {
  heroVideoId: "dQw4w9WgXcQ",
  testimonials: [
    { id: "M7lc1UVf-VE", name: "Marcus T.", note: "Ritz suite for $127" },
    { id: "ysz5S6PUM-U", name: "Jennifer K.", note: "Status stacking + luxury rentals" },
    { id: "ScMzIvxBSi4", name: "David R.", note: "Business credit breakthrough" },
    { id: "aqz-KE-bpKQ", name: "Member 4", note: "Hotel upgrades" },
    { id: "w7ejDZ8SWv8", name: "Member 5", note: "Points strategy" },
    { id: "dQw4w9WgXcQ", name: "Member 6", note: "Lifestyle ROI" },
  ],
};

// Stripe Payment Links (Paste your real Stripe payment link URLs here)
// If left blank, checkout buttons will route to #/contact.
const CHECKOUT = {
  hotelHack: "", // e.g. "https://buy.stripe.com/xxxx"
  fullCourse: "", // e.g. "https://buy.stripe.com/yyyy"
};

// Optional cross-property authority + community destination
const LINKS = {
  theStandard: "", // e.g. "https://thestandardseries.com"
  circle: "", // optional, e.g. "https://circle.so/..."
  discord: "", // optional, e.g. "https://discord.gg/..."
};

const NAV = [
  { key: "home", label: "Home" },
  { key: "program", label: "Program" },
  { key: "pricing", label: "Pricing" },
  { key: "testimonials", label: "Testimonials" },
  { key: "about", label: "About" },
  { key: "faq", label: "FAQ" },
  { key: "members", label: "Members" },
  { key: "contact", label: "Apply / Contact" },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getHashRouteSafe() {
  if (typeof window === "undefined") return "/home";
  return (window.location.hash || "#/home").replace("#", "");
}

function useHashRoute() {
  const [route, setRoute] = useState(getHashRouteSafe());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHash = () => setRoute(getHashRouteSafe());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const key = route.split("/")[1] || "home";
  const param = route.split("/")[2] || "";
  return { key, param };
}

function isHttpUrl(s) {
  return typeof s === "string" && /^https?:\/\//i.test(s.trim());
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <BackgroundGlow />
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute -bottom-24 right-[-120px] h-[360px] w-[520px] rounded-full bg-white/5 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
    </div>
  );
}

function TopNav() {
  const { key } = useHashRoute();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const active = (k) => key === k;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#/home" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img
              src={ASSETS.logoSrc}
              alt={`${BRAND.name} logo`}
              className="h-7 w-7 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <Crown className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">{BRAND.name}</div>
            <div className="text-xs text-neutral-400">{BRAND.subtitle}</div>
          </div>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={`#/${item.key}`}
              className={cx(
                "rounded-2xl px-3 py-2 text-sm transition",
                active(item.key)
                  ? "bg-white/10 text-white"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#/pricing"
            className="ml-2 inline-flex items-center gap-2 rounded-2xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-yellow-500/10 hover:bg-yellow-400"
          >
            View tiers <ArrowRight className="h-4 w-4" />
          </a>
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-white/10"
          >
            <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-2">
                {NAV.map((item) => (
                  <a
                    key={item.key}
                    href={`#/${item.key}`}
                    onClick={() => setOpen(false)}
                    className={cx(
                      "rounded-2xl px-3 py-2 text-sm transition",
                      active(item.key)
                        ? "bg-white/10 text-white"
                        : "text-neutral-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <a
                href="#/pricing"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-neutral-950"
              >
                View tiers <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400">{eyebrow}</div>
      )}
      <div className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</div>
      {desc && <div className="mt-3 max-w-2xl text-neutral-300">{desc}</div>}
    </div>
  );
}

function Button({ href, onClick, variant = "primary", children }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition whitespace-nowrap";
  const styles =
    variant === "primary"
      ? "bg-yellow-500 text-neutral-950 hover:bg-yellow-400 shadow-lg shadow-yellow-500/10"
      : variant === "ghost"
      ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
      : "border border-white/10 bg-transparent text-white hover:bg-white/5";

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className={cx(base, styles)}
      >
        {children}
        {isExternal && <ExternalLink className="h-4 w-4" />}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cx(base, styles)}>
      {children}
    </button>
  );
}

function Pill({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-500/10">
        <Icon className="h-5 w-5 text-yellow-400" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white whitespace-normal break-normal">{title}</div>
        <div className="mt-1 text-sm text-neutral-400 whitespace-normal break-normal">{desc}</div>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl whitespace-normal break-normal">
        {value}
      </div>
      <div className="mt-1 text-sm text-neutral-400 whitespace-normal break-normal">{label}</div>
    </div>
  );
}

function YouTubeEmbed({ videoId, title }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
          title={title || "YouTube video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

// -----------------------
// Pages
// -----------------------

function Home() {
  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-300">
            <Shield className="h-4 w-4 text-yellow-400" /> Real execution. Discreet systems. High signal.
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Live the five star lifestyle without paying five star prices.
          </h1>

          <p className="mt-4 max-w-xl text-neutral-300">
            Upgrade into first class, suites, and top tier experiences for less.
          </p>
          <p className="mt-2 max-w-xl text-neutral-300">
            A premium, Netflix style masterclass that teaches how access works. Hotels, flights, points, private aviation pathways,
            elite rentals, luxury sourcing, and business leverage.
          </p>
          <p className="mt-2 max-w-xl text-sm text-neutral-400">
            Most members see their first tangible win within their first booking.
          </p>
          <p className="mt-2 max-w-xl text-sm text-neutral-400">
            Some wins are available immediately inside the portal. Others land within three to four days depending on your booking window.
          </p>
          <p className="mt-2 max-w-xl text-sm text-neutral-400">
            Example: suite upgrades, first class outcomes, premium rentals, without premium pricing.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="#/pricing">
              <Crown className="h-4 w-4" /> View tiers
            </Button>
            <Button href="#/program" variant="ghost">
              Read the program overview <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#/contact" variant="ghost">
              Concierge application <Mail className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <div className="flex items-start gap-3">
              <Quote className="mt-0.5 h-5 w-5 text-yellow-400" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">A clean distinction</div>
                <div className="mt-1 text-sm text-neutral-200 whitespace-normal break-normal">
                  The Full Course teaches the system. Concierge is separate and application only. We execute using our position and
                  relationships. You simply approve.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <YouTubeEmbed videoId={YT.heroVideoId} title="Upgrade Society - Sizzle" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400">How it works</div>
            <div className="mt-2 text-2xl font-semibold">Learn it, or have it done for you</div>
            <p className="mt-3 text-neutral-300">
              Two entry points. One system. Choose the level of support that matches your time, lifestyle, and goals.
              <span className="ml-2 text-neutral-200">Designed for people who execute.</span>
            </p>
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <Button href="#/pricing" variant="ghost">
              Compare tiers <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-neutral-950/40 p-6">
            <div className="text-sm font-semibold">Full Course</div>
            <div className="mt-2 text-sm text-neutral-300">
              You learn the architecture of access across hotels, flights, points, private aviation pathways, rentals, luxury sourcing,
              and business leverage.
            </div>
            <div className="mt-4 flex gap-3">
              <Button href="#/program" variant="ghost">
                See the curriculum <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-yellow-500/30 bg-yellow-500/10 p-6">
            <div className="text-sm font-semibold text-white">Concierge</div>
            <div className="mt-2 text-sm text-neutral-200">
              Done for you execution. Direct access to Kris and team. We leverage our position and relationships across luxury travel,
              sourcing, and business optimization.
            </div>
            <div className="mt-4 flex gap-3">
              <Button href="#/contact">
                Request application <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU UNLOCK */}
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400">What you unlock</div>
            <div className="mt-2 text-2xl font-semibold">Luxury outcomes, explained clearly</div>
            <p className="mt-3 text-neutral-300">
              This is a lifestyle ecosystem. Learn the system, then practice it in the real world.
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              Quarterly city meetups give members a reason to apply what they learn and meet serious operators.
            </p>
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <Button href="#/pricing" variant="ghost">
              Choose your tier <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ["Hotels and suites", "Rates, upgrades, and status strategies"],
            ["Flights and points", "Smarter redemptions and routing"],
            ["Private aviation pathways", "How access is structured"],
            ["Elite rentals and exotics", "Premium outcomes with better leverage"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
              <div className="text-sm font-semibold whitespace-normal break-normal">{t}</div>
              <div className="mt-1 text-sm text-neutral-400 whitespace-normal break-normal">{d}</div>
            </div>
          ))}

          <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-5 sm:col-span-2">
            <div className="text-sm font-semibold whitespace-normal break-normal">More inside</div>
            <div className="mt-1 text-sm text-neutral-400 whitespace-normal break-normal">
              Luxury sourcing, business leverage, and additional releases inside the members portal.
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400">Guarantee</div>
            <div className="mt-2 text-2xl font-semibold">30 Day Action Guarantee</div>
            <p className="mt-3 text-neutral-300">
              Complete the 7 Day Quick Wins Challenge and implement at least 3 strategies. If you do not see meaningful savings or value within
              30 days, we will provide 1 on 1 coaching to troubleshoot and optimize your approach.
            </p>
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <Button href="#/pricing" variant="ghost">
              View tiers <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Program() {
  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Program"
        title="The architecture of access, organized and repeatable"
        desc="This is not motivation. It is a playbook of outcomes, systems, and leverage that compound over time."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Pill icon={Shield} title="Upgrade mindset" desc="Outcome first. Status stacking. Flex windows. Track everything." />
        <Pill
          icon={Sparkles}
          title="Quick wins"
          desc="Start winning today. Loyalty ecosystems, status matches, and clean leverage."
        />
        <Pill icon={Film} title="Docu style teaching" desc="High production delivery designed to hold attention." />
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-2xl font-semibold">What is inside (high level)</div>
            <p className="mt-3 text-neutral-300">
              Hotels. Flights. Points strategy. Private aviation pathways. Elite rentals. Fashion sourcing. Business
              credit and funding strategy. Tax optimization frameworks. Additional releases inside the members portal.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                ["Hotels", "Suite upgrades, status strategies, and rate leverage"],
                ["Flights + Points", "Business-class outcomes with smarter redemptions"],
                ["Private Aviation", "Private aviation pathways"],
                ["Elite Rentals", "Pay for economy, drive premium"],
                ["Fashion", "Luxury sourcing pathways"],
                ["Business Leverage", "Credit + funding frameworks to move faster"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold whitespace-normal break-normal">{t}</div>
                  <div className="mt-1 text-sm text-neutral-400 whitespace-normal break-normal">{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
            <div className="text-sm font-semibold">Designed for</div>
            <div className="mt-3 space-y-2 text-sm text-neutral-300">
              {["Entrepreneurs who value time", "Professionals who travel", "Principals building presence", "Anyone ready to execute"].map(
                (x) => (
                  <div key={x} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-yellow-400" />
                    <span className="whitespace-normal break-normal">{x}</span>
                  </div>
                )
              )}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Button href="#/pricing">
                See pricing <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="#/faq" variant="ghost">
                Read FAQs
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Pricing() {
  const hotelHref = isHttpUrl(CHECKOUT.hotelHack) ? CHECKOUT.hotelHack.trim() : "#/contact";
  const fullHref = isHttpUrl(CHECKOUT.fullCourse) ? CHECKOUT.fullCourse.trim() : "#/contact";

  return (
    <div className="space-y-10">
      <SectionTitle eyebrow="Pricing" title="Choose your level of access" desc="Learn the system, or have it executed for you." />

      <section className="grid gap-4 lg:grid-cols-3">
        <PricingCard
          title="Hotel Hack Only"
          price="$599"
          subtitle="Hotels only. Fast ROI."
          bullets={[
            "Hotel strategy module",
            "Rate and status frameworks",
            "Quick wins checklist",
            "Digital education. Delivered immediately. Final sale.",
          ]}
          cta={{ label: isHttpUrl(CHECKOUT.hotelHack) ? "Checkout" : "Enroll", href: hotelHref }}
        />

        <PricingCard
          title="Full Course"
          price="$5,000"
          subtitle="Full program and members portal. Founder cohort: limited allocation. Details at checkout."
          highlight
          bullets={[
            "Full masterclass (all modules)",
            "Members portal and private community",
            "Education across hotels, flights, private aviation pathways, exotics, sourcing, and funding",
            "Access frameworks built from real concierge execution",
          ]}
          cta={{ label: isHttpUrl(CHECKOUT.fullCourse) ? "Checkout" : "Apply / Buy", href: fullHref }}
        />

        <PricingCard
          title="Concierge, Done For You"
          price="$25,000"
          subtitle="Application only. No refunds."
          bullets={["Done for you execution", "Direct line to Kris and team, 24/7", "Private strategy sessions", "Priority scheduling"]}
          cta={{ label: "Request application", href: "#/contact" }}
        />
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-2xl font-semibold">Why the system works</div>
            <p className="mt-3 text-neutral-300">
              The Full Course teaches a repeatable framework for luxury outcomes across hotels, flights, points, private aviation pathways,
              elite rentals, luxury sourcing, and business leverage. Concierge is a separate, application only service where we execute on your
              behalf using our position and relationships. You simply approve.
            </p>
            <div className="mt-4 text-sm text-neutral-300">Clear education in the course. Clean execution in Concierge.</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
            <div className="text-sm font-semibold">Clear distinction</div>
            <div className="mt-3 space-y-2 text-sm text-neutral-300">
              <div className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 text-yellow-400" />
                <span className="whitespace-normal break-normal">Full Course teaches you the system and how access works.</span>
              </div>
              <div className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 text-yellow-400" />
                <span className="whitespace-normal break-normal">Concierge executes using our position and relationships. You simply approve.</span>
              </div>
            </div>
            <div className="mt-5">
              <Button href="#/contact" variant="ghost">
                Ask a question <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="text-xs text-neutral-500">
        Full Course includes a 30 Day Action Guarantee. Concierge is application only and non refundable. Digital education is delivered
        immediately after purchase and is considered final.
      </section>
    </div>
  );
}

function PricingCard({ title, price, subtitle, bullets, cta, highlight }) {
  return (
    <div
      className={cx(
        "rounded-[28px] border p-6",
        highlight ? "border-yellow-500/40 bg-yellow-500/10" : "border-white/10 bg-white/5"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold whitespace-normal break-normal">{title}</div>
          <div className="mt-1 text-xs text-neutral-400 whitespace-normal break-normal">{subtitle}</div>
        </div>
        {highlight && (
          <span className="rounded-2xl bg-yellow-500 px-3 py-1 text-xs font-semibold text-neutral-950 whitespace-nowrap">
            Best value
          </span>
        )}
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-tight whitespace-nowrap">{price}</div>
      <ul className="mt-4 space-y-2 text-sm text-neutral-300">
        {bullets.map((b, idx) => (
          <li key={`${b}-${idx}`} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
            <span className="whitespace-normal break-normal">{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button href={cta.href}>
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Testimonials"
        title="Proof, not promises"
        desc="Embed 6 video testimonials here. Replace the placeholder IDs with real member videos."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {YT.testimonials.map((t) => (
          <div key={t.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold text-white whitespace-normal break-normal">{t.name}</div>
            <div className="mt-1 text-xs text-neutral-400 whitespace-normal break-normal">{t.note}</div>
            <div className="mt-4">
              <YouTubeEmbed videoId={t.id} title={`Testimonial — ${t.name}`} />
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-2xl font-semibold">Member wins (example copy)</div>
            <div className="mt-3 space-y-3 text-sm text-neutral-300">
              <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
                <div className="flex items-start gap-3">
                  <Quote className="mt-0.5 h-5 w-5 text-yellow-400" />
                  <div>
                    <div className="font-semibold">“This course paid for itself in one booking.”</div>
                    <div className="mt-1 text-neutral-300">Stayed in an $800/night suite for a fraction using the hotel strategy.</div>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
                <div className="flex items-start gap-3">
                  <Quote className="mt-0.5 h-5 w-5 text-yellow-400" />
                  <div>
                    <div className="font-semibold">“Status stacking changed my travel life.”</div>
                    <div className="mt-1 text-neutral-300">Upgraded rental status across brands and started consistently driving premium.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-6">
            <div className="text-sm font-semibold">Want your result featured?</div>
            <p className="mt-2 text-sm text-neutral-400">After your first win, record a short clip and submit it. Real proof compounds trust.</p>
            <div className="mt-5 flex gap-3">
              <Button href="#/contact" variant="ghost">
                Submit a testimonial <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function About() {
  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="About"
        title="Presented by Kris Buban"
        desc="Luxury lifestyle strategist and educator. Founder, More4LessMotors LLC and The Upgrade Society."
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/40">
              <img
                src={ASSETS.aboutPhotoSrc}
                alt="Kris Buban"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div>
              <div className="text-lg font-semibold">{BRAND.presenter}</div>
              <div className="text-sm text-neutral-400">{BRAND.role}</div>
            </div>
          </div>

          <p className="mt-5 text-sm text-neutral-300">
            Built from real world execution. Private concierge work, complex itineraries, and sourcing for clients who value time, discretion, and outcomes over discounts.
            <span className="ml-1">Built from real concierge execution for clients spending six and seven figures annually.</span>
          </p>

          <div className="mt-5 rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
            <div className="flex items-start gap-3">
              <Quote className="mt-0.5 h-5 w-5 text-yellow-400" />
              <div className="text-sm text-neutral-300">“Luxury isn’t expensive—ignorance is.”</div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">What makes this different</div>
          <div className="mt-3 space-y-3 text-sm text-neutral-300">
            <div className="flex gap-2"><span className="text-yellow-400">•</span> Built from live concierge execution—not theory</div>
            <div className="flex gap-2"><span className="text-yellow-400">•</span> Systems used for real travel, sourcing, and deal flow</div>
            <div className="flex gap-2"><span className="text-yellow-400">•</span> High-production delivery designed to hold attention</div>
            <div className="flex gap-2"><span className="text-yellow-400">•</span> A genuine access advantage: XO Reserve pathway</div>
            <div className="flex gap-2"><span className="text-yellow-400">•</span> From the creator and host of THE STANDARD, A Rolls Royce Life</div>
          </div>

          {(LINKS.theStandard && isHttpUrl(LINKS.theStandard)) && (
            <div className="mt-6 rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
              <div className="text-sm font-semibold">A quiet credential</div>
              <p className="mt-2 text-sm text-neutral-300">
                For those who prefer context: THE STANDARD is a documentary project that reflects the same taste level and restraint.
              </p>
              <div className="mt-4">
                <Button href={LINKS.theStandard} variant="ghost">
                  Visit THE STANDARD <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FAQ() {
  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="FAQ"
        title="Clear answers, no noise"
        desc="Clear answers, designed to help you decide quickly and confidently."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <FaqCard
          q="Is the private aviation advantage real?"
          a="Yes. The course explains how private aviation access works and what creates truly affordable outcomes. Concierge clients benefit from our position and relationships, which can remove traditional gatekeeping such as large deposits and annual membership fees. Availability and pricing depend on route, operator, and scheduling windows."
        />
        <FaqCard
          q="What is the difference between Full Course and Concierge?"
          a="Full Course teaches you the system and how access works across hotels, flights, private aviation pathways, exotics, sourcing, and funding. Concierge is application only and we execute for you with direct access to Kris and team."
        />
        <FaqCard
          q="What does the Hotel Hack Only tier include?"
          a="Hotels only. This tier does not include the members portal, private aviation pathways, or done for you services."
        />
        <FaqCard
          q="What does application only mean for Concierge?"
          a="Concierge is application only to protect response time and outcomes. If accepted, you receive done for you execution and direct access to Kris and the team."
        />
        <FaqCard
          q="What if I don’t see results?"
          a="Complete the 7 Day Quick Wins Challenge and implement at least 3 strategies. If you do not see meaningful savings or value within 30 days, we will provide 1 on 1 coaching to troubleshoot and optimize your approach."
        />
        <FaqCard
          q="Is this legal and ethical?"
          a="We operate within policies and laws. The course teaches frameworks and best practices, not shortcuts that risk reputations."
        />
      </section>
    </div>
  );
}

function FaqCard({ q, a }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <div className="text-sm font-semibold text-white whitespace-normal break-normal">{q}</div>
      <div className="mt-2 text-sm text-neutral-300 whitespace-normal break-normal">{a}</div>
    </div>
  );
}

function Members() {
  const destination = isHttpUrl(LINKS.circle) ? LINKS.circle : isHttpUrl(LINKS.discord) ? LINKS.discord : "";

  return (
    <div className="space-y-10">
      <SectionTitle eyebrow="Members" title="Members portal" desc="Secure access is delivered immediately after purchase." />

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-2xl font-semibold">Access</div>
            <p className="mt-3 text-sm text-neutral-300">
              Immediately after checkout, you will receive an email with your private portal access details. This page confirms your entry point.
            </p>
            <div className="mt-5 rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
              <div className="text-sm font-semibold">Next step</div>
              <p className="mt-2 text-sm text-neutral-300">
                If you already have your invite, use the button below. If you do not, contact support and we will route you.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {destination ? (
                <Button href={destination}>
                  Enter portal <LogIn className="h-4 w-4" />
                </Button>
              ) : (
                <Button href="#/contact" variant="ghost">
                  Contact support <Mail className="h-4 w-4" />
                </Button>
              )}
              <Button href="#/pricing" variant="ghost">
                View tiers <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-6">
            <div className="text-sm font-semibold">Portal destination (placeholder)</div>
            <p className="mt-2 text-sm text-neutral-400">
              When you decide between Circle or Discord, paste the link into LINKS.circle or LINKS.discord in the code.
            </p>
            <div className="mt-4 space-y-2 text-sm text-neutral-300">
              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-yellow-400" />
                <span className="whitespace-normal break-normal">Circle: clean, branded member experience</span>
              </div>
              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-yellow-400" />
                <span className="whitespace-normal break-normal">Discord: fast chat, lightweight community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-xs text-neutral-500">
        If you have not received your access email within 10 minutes, check spam/junk, then contact support.
      </section>
    </div>
  );
}

function Contact() {
  return (
    <div className="space-y-10">
      <SectionTitle eyebrow="Apply / Contact" title="Enroll, apply, or ask a question" desc="We’ll guide you to the right entry point." />

      <section className="grid gap-4 lg:grid-cols-3">
        <ContactCard
          icon={Crown}
          title="Full Course"
          desc="Apply or purchase. Ask about founder pricing rules."
          ctaLabel="Email"
          href={`mailto:${BRAND.email}?subject=Full%20Course%20-%20The%20Upgrade%20Society`}
        />
        <ContactCard
          icon={Shield}
          title="Hotel Hack Only"
          desc="$599 module. Quick ROI if you travel."
          ctaLabel="Email"
          href={`mailto:${BRAND.email}?subject=Hotel%20Hack%20Only%20-%20The%20Upgrade%20Society`}
        />
        <ContactCard
          icon={Ticket}
          title="Concierge (Application-only)"
          desc="$25,000 done-for-you. Limited roster."
          ctaLabel="Request application"
          href={`mailto:${BRAND.email}?subject=Concierge%20Application%20Request%20-%20The%20Upgrade%20Society`}
        />
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-sm font-semibold">Direct</div>
            <div className="mt-4 space-y-3 text-sm text-neutral-300">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-yellow-400" />
                <a className="hover:underline" href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
              <div className="text-sm font-semibold">Quick note</div>
              <p className="mt-2 text-sm text-neutral-300">
                If you’re asking about private aviation, include your route, dates, and flexibility window.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-6">
            <div className="text-sm font-semibold">Lead form (optional)</div>
            <p className="mt-2 text-sm text-neutral-400">This default form uses mailto. Later, connect a real form endpoint and swap the action.</p>
            <form className="mt-4 space-y-3" action={`mailto:${BRAND.email}`} method="post" encType="text/plain">
              <Field label="Name" placeholder="Full name" name="name" />
              <Field label="Email" placeholder="you@email.com" name="email" type="email" />
              <Field label="I’m interested in" name="type" as="select" options={["Full Course", "Hotel Hack Only", "Concierge", "Other"]} />
              <Field label="Message" placeholder="What outcome are you trying to unlock?" name="message" as="textarea" />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-yellow-400"
              >
                Send <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="text-xs text-neutral-500">By contacting us, you acknowledge communications may be used to coordinate enrollment and service logistics.</section>
    </div>
  );
}

function ContactCard({ icon: Icon, title, desc, ctaLabel, href }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10">
        <Icon className="h-5 w-5 text-yellow-400" />
      </div>
      <div className="mt-4 text-lg font-semibold whitespace-normal break-normal">{title}</div>
      <div className="mt-2 text-sm text-neutral-300 whitespace-normal break-normal">{desc}</div>
      <div className="mt-5">
        <Button href={href}>{ctaLabel}</Button>
      </div>
    </div>
  );
}

function Field({ label, name, placeholder, type = "text", as, options }) {
  const common =
    "mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30";

  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{label}</div>
      {as === "textarea" ? (
        <textarea name={name} placeholder={placeholder} rows={4} className={common} />
      ) : as === "select" ? (
        <select name={name} className={common} defaultValue={options?.[0]}>
          {options?.map((o) => (
            <option key={o} value={o} className="bg-neutral-900">
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input name={name} type={type} placeholder={placeholder} className={common} />
      )}
    </label>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-400 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-semibold text-neutral-200">{BRAND.name}</div>
            <div className="text-xs">{BRAND.subtitle} • {BRAND.tagline}</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="hover:text-white" href="#/program">Program</a>
            <a className="hover:text-white" href="#/pricing">Pricing</a>
            <a className="hover:text-white" href="#/testimonials">Testimonials</a>
            <a className="hover:text-white" href="#/members">Members</a>
            <a className="hover:text-white" href="#/contact">Apply</a>
            {LINKS.theStandard && isHttpUrl(LINKS.theStandard) && (
              <a className="hover:text-white" href={LINKS.theStandard} target="_blank" rel="noreferrer">
                THE STANDARD <ExternalLink className="inline h-3 w-3" />
              </a>
            )}
          </div>
        </div>
        <div className="mt-6 text-xs text-neutral-500">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved. Terms, policies, and disclosures should be reviewed by counsel before launch.
        </div>
      </div>
    </footer>
  );
}

function NotFound() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
      <div className="text-2xl font-semibold">Page not found</div>
      <div className="mt-2 text-neutral-300">Try going back to the home page.</div>
      <div className="mt-5">
        <Button href="#/home">Home</Button>
      </div>
    </div>
  );
}

// -----------------------
// Lightweight self-tests
// -----------------------
function runSelfTests() {
  // Keep this tiny; it's here to catch foot-guns when editing.
  const knownRoutes = new Set(["home", "program", "pricing", "testimonials", "about", "faq", "members", "contact"]);

  NAV.forEach((n) => {
    if (!knownRoutes.has(n.key)) throw new Error(`NAV route key not implemented: ${n.key}`);
  });

  if (YT.testimonials.length !== 6) throw new Error("Expected exactly 6 testimonials");

  [CHECKOUT.hotelHack, CHECKOUT.fullCourse].forEach((x) => {
    if (x && x.trim().length > 0 && !isHttpUrl(x)) throw new Error("CHECKOUT links must start with http(s)://");
  });

  // Catch common broken asset paths early
  [ASSETS.logoSrc, ASSETS.aboutPhotoSrc].forEach((p) => {
    if (typeof p !== "string" || !p.startsWith("/")) throw new Error("ASSETS paths should start with '/'");
  });
}

export default function UpgradeSocietyWebsite() {
  const { key } = useHashRoute();

  useEffect(() => {
    // run once on mount (client)
    if (typeof window !== "undefined") {
      try {
        runSelfTests();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }, []);

  const page = useMemo(() => {
    switch (key) {
      case "home":
        return <Home />;
      case "program":
        return <Program />;
      case "pricing":
        return <Pricing />;
      case "testimonials":
        return <Testimonials />;
      case "about":
        return <About />;
      case "faq":
        return <FAQ />;
      case "members":
        return <Members />;
      case "contact":
        return <Contact />;
      default:
        return <NotFound />;
    }
  }, [key]);

  return (
    <PageShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {page}
        </motion.div>
      </AnimatePresence>
    </PageShell>
  );
}
