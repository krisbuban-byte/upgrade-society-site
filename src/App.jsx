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
  Lock,
  ExternalLink,
  Quote,
  Check,
  Ticket,
  LogIn,
  Users,
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

// ✅ Option 1: Stripe Payment Links
// Paste your Stripe Payment Link URLs here. Example:
//   "https://buy.stripe.com/xxxx"
// If a link is blank, the button will route to #/contact.
const CHECKOUT = {
  hotelHack: "https://buy.stripe.com/PLACEHOLDER_HOTEL_599", // $599
  fullCourse: "https://buy.stripe.com/PLACEHOLDER_FULL_5000", // $5,000
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

function isCheckoutReady(url) {
  if (!isHttpUrl(url)) return false;
  // Treat placeholders as "not set" so preview doesn't send users to 404.
  return !/PLACEHOLDER/i.test(url);
}

function goHash(path) {
  if (typeof window === "undefined") return;
  const next = path.startsWith("#") ? path : `#${path}`;
  if (window.location.hash === next) {
    // force a hashchange-like update in some preview sandboxes
    window.location.hash = "#/home";
    window.location.hash = next;
  } else {
    window.location.hash = next;
  }
}

function getCheckoutHref(kind) {
  const raw = kind === "hotel" ? CHECKOUT.hotelHack : CHECKOUT.fullCourse;
  return isCheckoutReady(raw) ? raw.trim() : "#/contact";
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
        <button onClick={() => goHash("#/home")} className="group flex items-center gap-3 text-left">
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
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => goHash(`#/${item.key}`)}
              className={cx(
                "rounded-2xl px-3 py-2 text-sm transition",
                active(item.key)
                  ? "bg-white/10 text-white"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => goHash("#/pricing")}
            className="ml-2 inline-flex items-center gap-2 rounded-2xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-yellow-500/10 hover:bg-yellow-400"
          >
            View tiers <ArrowRight className="h-4 w-4" />
          </button>
        </nav>

        <button
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
                  <button
                    key={item.key}
                    onClick={() => {
                      goHash(`#/${item.key}`);
                      setOpen(false);
                    }}
                    className={cx(
                      "rounded-2xl px-3 py-2 text-sm transition text-left",
                      active(item.key)
                        ? "bg-white/10 text-white"
                        : "text-neutral-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  goHash("#/pricing");
                  setOpen(false);
                }}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-neutral-950"
              >
                View tiers <ArrowRight className="h-4 w-4" />
              </button>
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
      <div className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl break-normal">{title}</div>
      {desc && <div className="mt-3 max-w-2xl text-neutral-300 break-normal">{desc}</div>}
    </div>
  );
}

function Button({ href, onClick, variant = "primary", children }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition";
  const styles =
    variant === "primary"
      ? "bg-yellow-500 text-neutral-950 hover:bg-yellow-400 shadow-lg shadow-yellow-500/10"
      : variant === "ghost"
      ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
      : "border border-white/10 bg-transparent text-white hover:bg-white/5";

  if (href) {
    const isExternal = isHttpUrl(href);
    const isInternalHash = typeof href === "string" && href.startsWith("#/");

    return (
      <a
        href={href}
        onClick={(e) => {
          if (isInternalHash) {
            e.preventDefault();
            goHash(href);
          }
        }}
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
        <div className="text-sm font-semibold text-white break-normal">{title}</div>
        <div className="mt-1 text-sm text-neutral-400 break-normal leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-lg font-semibold leading-tight tracking-tight text-white sm:text-2xl whitespace-normal break-normal">
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
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-300">
            <Shield className="h-4 w-4 text-yellow-400" /> Documented systems. Real leverage. Ethical playbooks.
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            The masterclass for people who want the five-star life without the five-star burn.
          </h1>

          <p className="mt-4 max-w-xl text-neutral-300">
            The Upgrade Society is a premium, Netflix-style masterclass built around one idea: access beats price. You will learn the
            architecture of access - hotels, points, private aviation pathways, elite rentals, fashion sourcing, and business leverage.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="#/pricing">
              <Crown className="h-4 w-4" /> Choose your tier
            </Button>
            <Button href="#/program" variant="ghost">
              <Sparkles className="h-4 w-4" /> What you get
            </Button>
            <Button href="#/testimonials" variant="ghost">
              <Play className="h-4 w-4" /> Results
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-400">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <Lock className="h-4 w-4 text-yellow-400" /> Private members portal
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <Shield className="h-4 w-4 text-yellow-400" /> Secure Stripe checkout
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <Sparkles className="h-4 w-4 text-yellow-400" /> Instant access after purchase
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat value="4K" label="Premium, docu-style delivery" />
            <Stat value="30-Day" label="Action guarantee" />
            <Stat value="Architecture" label="of access framework" />
          </div>

          <div className="mt-6 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <div className="flex items-start gap-3">
              <Quote className="mt-0.5 h-5 w-5 text-yellow-400" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">The headline advantage</div>
                <div className="mt-1 text-sm text-neutral-200 break-normal">
                  Full Course members gain access to our XO Reserve position - an aviation membership that typically requires a $250,000 deposit
                  plus $995/year. You pay none of that. You simply pay for your seat when you fly.
                </div>
                <div className="mt-3 text-xs text-neutral-300">
                  Safety first: bookings are coordinated with properly certificated operators.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <YouTubeEmbed videoId={YT.heroVideoId} title="Upgrade Society - Sizzle" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Pill icon={Film} title="Hero sizzle reel" desc="A premium trailer that sets the tone - cinematic, controlled, high signal." />
            <Pill icon={Users} title="Private member access" desc="A members-only portal for community updates and next steps." />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Pill icon={Shield} title="Upgrade mindset" desc="Outcome first. Status stacking. Flex windows. Track everything." />
        <Pill icon={Sparkles} title="Quick wins" desc="Start winning today - loyalty ecosystems, status matches, and clean leverage." />
        <Pill icon={Film} title="Docu-style teaching" desc="High production, high signal, built to hold your attention." />
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400">Guarantee</div>
            <div className="mt-2 text-2xl font-semibold">30-Day Action Guarantee</div>
            <p className="mt-3 text-neutral-300">
              Complete the 7-Day Quick Wins Challenge and implement at least 3 strategies. If you do not see meaningful savings or value within
              30 days, we will provide 1-on-1 coaching to troubleshoot - or issue a full refund.
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
        title="The architecture of access - organized and repeatable"
        desc="This is not motivation. It is a playbook: outcomes, systems, and leverage that compound over time."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Pill icon={Shield} title="Upgrade mindset" desc="Outcome first. Status stacking. Flex windows. Track everything." />
        <Pill icon={Sparkles} title="Quick wins" desc="Start winning today - loyalty ecosystems, status matches, and clean leverage." />
        <Pill icon={Film} title="Docu-style teaching" desc="High production, high signal, built to hold your attention." />
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-2xl font-semibold">What is inside (high level)</div>
            <p className="mt-3 text-neutral-300">
              Hotels. Flights. Points strategy. Private aviation pathways. Elite rentals. Fashion sourcing. Business credit and funding strategy.
              Tax optimization frameworks.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                ["Hotels", "Suite upgrades, status strategies, and rate leverage"],
                ["Flights + Points", "Business-class outcomes with smarter redemptions"],
                ["Private Aviation", "XO Reserve position access (serious advantage)"],
                ["Elite Rentals", "Pay for economy, drive premium"],
                ["Fashion", "Designer sourcing with request workflow"],
                ["Business Leverage", "Credit + funding frameworks to move faster"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">{t}</div>
                  <div className="mt-1 text-sm text-neutral-400">{d}</div>
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
                    <span>{x}</span>
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
  const hotelHref = getCheckoutHref("hotel");
  const fullHref = getCheckoutHref("full");

  return (
    <div className="space-y-10">
      <SectionTitle eyebrow="Pricing" title="Three ways to enter" desc="Choose the level of access you want - then execute." />

      <section className="grid gap-4 lg:grid-cols-3">
        <PricingCard
          title="Hotel Hack Only"
          price="$599"
          subtitle="Standalone module - no additional access"
          bullets={[
            "Hotel strategy module",
            "Rate + status frameworks",
            "Quick wins checklist",
            "No member areas / concierge / aviation access",
          ]}
          cta={{ label: isCheckoutReady(CHECKOUT.hotelHack) ? "Checkout" : "Enroll", href: hotelHref }}
        />

        <PricingCard
          title="Full Course"
          price="$5,000"
          subtitle="All hacks + member access (Founder pricing: first 50 enrollments)"
          highlight
          bullets={[
            "Full masterclass (all modules)",
            "Founder pricing applies automatically at checkout for the first 50 enrollments",
            "Member access + ticketed request lanes",
            "Fashion request lane ($99 request fee; credited toward purchase)",
            "Private jet request lane ($300 request fee)",
            "XO Reserve position access (no $250K deposit required)",
          ]}
          cta={{ label: isCheckoutReady(CHECKOUT.fullCourse) ? "Checkout" : "Apply / Buy", href: fullHref }}
        />

        <PricingCard
          title="Concierge - Done-For-You"
          price="$25,000"
          subtitle="Invitation-only"
          bullets={["White-glove execution", "Priority scheduling", "Private strategy sessions", "Invitation-only review"]}
          cta={{ label: "Request invitation", href: "#/contact" }}
        />
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-2xl font-semibold">The ROI headline (why the Full Course exists)</div>
            <p className="mt-3 text-neutral-300">
              XO Reserve typically requires a $250,000 deposit plus a $995 annual membership fee. Full Course members gain access through our
              position - meaning you pay none of that. You simply pay for your seat when you fly.
            </p>
            <div className="mt-4 text-sm text-neutral-300">This is what “architecture of access” looks like in practice.</div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400">Scenario</div>
                <div className="mt-2 text-sm text-neutral-200">One jet seat booked through our position</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400">You avoid</div>
                <div className="mt-2 text-sm text-neutral-200">$250,000 deposit + $995/year gatekeeping</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400">Outcome</div>
                <div className="mt-2 text-sm text-neutral-200">Access that most people never touch</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-neutral-500">Illustrative: seat pricing and availability vary by route and operator.</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
            <div className="text-sm font-semibold">Request policy</div>
            <div className="mt-3 space-y-2 text-sm text-neutral-300">
              <div className="flex gap-2">
                <Ticket className="mt-0.5 h-4 w-4 text-yellow-400" />
                <span>Fashion: $99 request fee per ticket (credited toward purchase when sourced; otherwise released).</span>
              </div>
              <div className="flex gap-2">
                <Ticket className="mt-0.5 h-4 w-4 text-yellow-400" />
                <span>Private jet: $300 request fee per ticket (helps prioritize confirmed travel intent).</span>
              </div>
            </div>
            <div className="mt-5">
              <Button href="#/contact" variant="ghost">
                Ask questions <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="text-xs text-neutral-500">
        Note: XO Reserve access is provided via our position and vendor relationships; actual flight pricing and availability vary by route,
        operator, and scheduling windows.
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
          <div className="text-sm font-semibold break-normal">{title}</div>
          <div className="mt-1 text-xs text-neutral-400 break-normal">{subtitle}</div>
        </div>
        {highlight && (
          <span className="shrink-0 rounded-2xl bg-yellow-500 px-3 py-1 text-xs font-semibold text-neutral-950">Best value</span>
        )}
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-tight">{price}</div>
      <ul className="mt-4 space-y-2 text-sm text-neutral-300">
        {bullets.map((b, idx) => (
          <li key={`${title}-${idx}`} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />
            <span className="break-normal">{b}</span>
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
            <div className="text-sm font-semibold text-white break-normal">{t.name}</div>
            <div className="mt-1 text-xs text-neutral-400 break-normal">{t.note}</div>
            <div className="mt-4">
              <YouTubeEmbed videoId={t.id} title={`Testimonial - ${t.name}`} />
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
                  <div className="min-w-0">
                    <div className="font-semibold break-normal">“This course paid for itself in one booking.”</div>
                    <div className="mt-1 text-neutral-300 break-normal">
                      Stayed in an $800/night suite for a fraction using the hotel strategy.
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
                <div className="flex items-start gap-3">
                  <Quote className="mt-0.5 h-5 w-5 text-yellow-400" />
                  <div className="min-w-0">
                    <div className="font-semibold break-normal">“Status stacking changed my travel life.”</div>
                    <div className="mt-1 text-neutral-300 break-normal">
                      Upgraded rental status across brands and started consistently driving premium.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-6">
            <div className="text-sm font-semibold">Want your result featured?</div>
            <p className="mt-2 text-sm text-neutral-400 break-normal">
              After your first win, record a short clip and submit it. Real proof compounds community trust.
            </p>
            <div className="mt-5">
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
            <div className="min-w-0">
              <div className="text-lg font-semibold break-normal">{BRAND.presenter}</div>
              <div className="text-sm text-neutral-400 break-normal">{BRAND.role}</div>
            </div>
          </div>

          <p className="mt-5 text-sm text-neutral-300 break-normal">
            This program is built from lived execution: concierge work for high-performing clients, travel systems, and deal pathways that turn
            "luxury" into a repeatable process.
          </p>

          <p className="mt-3 text-sm text-neutral-400 break-normal">
            From the creator of{" "}
            {LINKS.theStandard ? (
              <a href={LINKS.theStandard} target="_blank" rel="noreferrer" className="underline hover:text-white">
                THE STANDARD
              </a>
            ) : (
              <span className="underline decoration-neutral-700">THE STANDARD</span>
            )}{" "}
            (docu-series).
          </p>

          <div className="mt-5 rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
            <div className="flex items-start gap-3">
              <Quote className="mt-0.5 h-5 w-5 text-yellow-400" />
              <div className="text-sm text-neutral-300 break-normal">“Luxury isn’t expensive - ignorance is.”</div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">What makes this different</div>
          <div className="mt-3 space-y-3 text-sm text-neutral-300">
            <div className="flex gap-2">
              <span className="text-yellow-400">•</span>
              <span className="break-normal">Built around systems, not inspiration</span>
            </div>
            <div className="flex gap-2">
              <span className="text-yellow-400">•</span>
              <span className="break-normal">High-production delivery that holds attention</span>
            </div>
            <div className="flex gap-2">
              <span className="text-yellow-400">•</span>
              <span className="break-normal">A real access headline: XO Reserve position pathway</span>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
            <div className="text-sm font-semibold">Members portal</div>
            <p className="mt-2 text-sm text-neutral-300 break-normal">
              After purchase, members will be routed to the community destination (Circle or Discord).
            </p>
            <div className="mt-4">
              <Button href="#/members" variant="ghost">
                View members portal <LogIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
        desc="This is where objections get handled - quietly and confidently."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <FaqCard
          q="Is the XO Reserve access real?"
          a="Full Course members gain access through our position. You don’t pay the $250,000 deposit or the $995 annual membership fee. You pay for your seat when you fly. Availability and pricing depend on route and operator."
        />
        <FaqCard
          q="Why are there request fees for fashion and private jets?"
          a="To protect time, quality, and speed. Fashion tickets include a $99 request fee that credits toward purchases if we source successfully; otherwise it’s released. Private jet requests carry a $300 fee to reduce non-serious inquiries."
        />
        <FaqCard
          q="What does the Hotel Hack Only tier include?"
          a="The hotel module only. No member access lanes, no concierge, and no aviation pathways."
        />
        <FaqCard
          q="What does Invitation-only mean for Concierge?"
          a="It’s a fit check. We keep the roster small to maintain response time and outcomes."
        />
        <FaqCard
          q="What if I don’t see results?"
          a="Follow the 7-Day Quick Wins Challenge and implement at least three strategies. If you don’t see meaningful value within 30 days, we’ll coach you 1-on-1 or refund."
        />
        <FaqCard
          q="Is this legal / ethical?"
          a="We operate within policies and laws. The course teaches frameworks and best practices, not shortcuts that risk reputations."
        />
      </section>
    </div>
  );
}

function FaqCard({ q, a }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <div className="text-sm font-semibold text-white break-normal">{q}</div>
      <div className="mt-2 text-sm text-neutral-300 break-normal">{a}</div>
    </div>
  );
}

function Contact() {
  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Apply / Contact"
        title="Enroll, apply, or ask a question"
        desc="If you have Stripe links set, use Pricing. This page is for questions and concierge invitations."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <ContactCard
          icon={Crown}
          title="Full Course"
          desc="Questions, eligibility, or payment link support."
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
          icon={Lock}
          title="Concierge (Invitation-only)"
          desc="$25,000 done-for-you. Limited roster."
          ctaLabel="Request invitation"
          href={`mailto:${BRAND.email}?subject=Concierge%20Invitation%20Request%20-%20The%20Upgrade%20Society`}
        />
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-7">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-sm font-semibold">Direct</div>
            <div className="mt-4 space-y-3 text-sm text-neutral-300">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-yellow-400" />
                <a className="hover:underline" href={`mailto:${BRAND.email}`}>
                  {BRAND.email}
                </a>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-white/10 bg-neutral-950/40 p-5">
              <div className="text-sm font-semibold">Quick note</div>
              <p className="mt-2 text-sm text-neutral-300 break-normal">
                If you’re asking about private aviation, include your route, dates, and flexibility window.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-6">
            <div className="text-sm font-semibold">Lead form (optional)</div>
            <p className="mt-2 text-sm text-neutral-400 break-normal">
              This default form uses mailto. Later, connect a real form endpoint and swap the action.
            </p>
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

      <section className="text-xs text-neutral-500">
        By contacting us, you acknowledge communications may be used to coordinate enrollment and service logistics.
      </section>
    </div>
  );
}

function ContactCard({ icon: Icon, title, desc, ctaLabel, href }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10">
        <Icon className="h-5 w-5 text-yellow-400" />
      </div>
      <div className="mt-4 text-lg font-semibold break-normal">{title}</div>
      <div className="mt-2 text-sm text-neutral-300 break-normal">{desc}</div>
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

function Members() {
  const destination = LINKS.circle || LINKS.discord;
  const destinationName = LINKS.circle ? "Circle" : LINKS.discord ? "Discord" : "your community";

  return (
    <div className="space-y-10">
      <SectionTitle eyebrow="Members" title="Members portal" desc="Secure access is delivered immediately after purchase." />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-yellow-400" />
            <div className="text-lg font-semibold">Welcome</div>
          </div>
          <p className="mt-3 text-sm text-neutral-300 break-normal">
            Immediately after checkout, you will receive an email with your private portal access details. This page confirms your entry point.
          </p>
          <div className="mt-5 rounded-3xl border border-white/10 bg-neutral-950/40 p-5 text-sm text-neutral-300 break-normal">
            Tip: keep your community link private - share it in post-purchase emails.
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold break-normal">Continue to {destinationName}</div>
          <p className="mt-2 text-sm text-neutral-400 break-normal">If the link is not set yet, this button will not redirect.</p>
          <div className="mt-5">
            {destination ? (
              <Button href={destination}>
                Go to {destinationName} <LogIn className="h-4 w-4" />
              </Button>
            ) : (
              <Button href="#/contact" variant="ghost">
                Ask us to connect it <Mail className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-400 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-semibold text-neutral-200">{BRAND.name}</div>
            <div className="text-xs">
              {BRAND.subtitle} • {BRAND.tagline}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="hover:text-white" onClick={() => goHash("#/program")}>
              Program
            </button>
            <button className="hover:text-white" onClick={() => goHash("#/pricing")}>
              Pricing
            </button>
            <button className="hover:text-white" onClick={() => goHash("#/testimonials")}>
              Testimonials
            </button>
            <button className="hover:text-white" onClick={() => goHash("#/members")}>
              Members
            </button>
            <button className="hover:text-white" onClick={() => goHash("#/contact")}>
              Apply
            </button>
            {LINKS.theStandard && (
              <a className="hover:text-white" href={LINKS.theStandard} target="_blank" rel="noreferrer">
                THE STANDARD
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 text-xs text-neutral-500">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
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
  try {
    const knownRoutes = new Set(["home", "program", "pricing", "testimonials", "about", "faq", "members", "contact"]);

    NAV.forEach((n) => {
      if (!knownRoutes.has(n.key)) throw new Error(`NAV route key not implemented: ${n.key}`);
    });

    if (!YT.heroVideoId) throw new Error("YT.heroVideoId missing");
    if (!Array.isArray(YT.testimonials)) throw new Error("YT.testimonials missing");
    if (YT.testimonials.length !== 6) throw new Error("Expected exactly 6 testimonials");

    // Checkout links should be either empty or real Stripe links (placeholders treated as not set)
    [CHECKOUT.hotelHack, CHECKOUT.fullCourse].forEach((x) => {
      if (x && x.trim().length > 0 && !isHttpUrl(x)) throw new Error("CHECKOUT links must start with http(s)://");
    });

    // Stripe link sanity (optional)
    [CHECKOUT.hotelHack, CHECKOUT.fullCourse].forEach((x) => {
      if (x && x.trim().length > 0 && !isHttpUrl(x)) throw new Error("CHECKOUT links must start with http(s)://");
    });

    if (!ASSETS.logoSrc) throw new Error("ASSETS.logoSrc missing");
    if (!ASSETS.aboutPhotoSrc) throw new Error("ASSETS.aboutPhotoSrc missing");

    // Extra test: ensure goHash exists
    if (typeof goHash !== "function") throw new Error("goHash missing");

    // Warn (not fail) if placeholder YouTube IDs are still present.
    const placeholders = new Set([
      "dQw4w9WgXcQ",
      "M7lc1UVf-VE",
      "ysz5S6PUM-U",
      "ScMzIvxBSi4",
      "aqz-KE-bpKQ",
      "w7ejDZ8SWv8",
    ]);

    if (placeholders.has(YT.heroVideoId)) {
      // eslint-disable-next-line no-console
      console.warn("Heads up: heroVideoId is still a placeholder. Replace YT.heroVideoId with your sizzle reel ID.");
    }

    YT.testimonials.forEach((t) => {
      if (placeholders.has(t.id)) {
        // eslint-disable-next-line no-console
        console.warn(
          "Heads up: a testimonial videoId is still a placeholder. Replace YT.testimonials IDs with real videos."
        );
      }
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Upgrade Society self-test failed:", e);
  }
}

export default function UpgradeSocietyWebsite() {
  const { key } = useHashRoute();

  useEffect(() => {
    runSelfTests();
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
