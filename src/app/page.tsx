"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  Brain,
  Cpu,
  Shield,
  Navigation,
  Users,
  Warehouse,
  Leaf,
  Bus,
  Globe,
  Accessibility,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  type LucideIcon,
  LayoutDashboard,
  Map,
  Zap,
  Network,
  Trash2,
  BarChart3,
  Activity,
  AlertTriangle,
  Layers,
  ShieldAlert,
  Heart,
  Handshake,
  Trophy,
  Star,
  Eye,
  ChevronUp,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Orbit,
  Radio,
  Maximize2,
  Minimize2,
  Play,
  Pause,
} from "lucide-react";
import clsx from "clsx";
import WorldCupEmblem from "@/components/landing/WorldCupEmblem";
import ParticleBackground from "@/components/landing/ParticleBackground";
import CountdownTimer from "@/components/landing/CountdownTimer";
import LiveMatchWidget from "@/components/landing/LiveMatchWidget";
import AnimatedStats from "@/components/landing/AnimatedStats";
import AccessibilityPanel from "@/components/landing/AccessibilityPanel";

// ─── Icons Map ─────────────────────────────────────────────────

const roleIcons: Record<string, LucideIcon> = {
  Fan: Users,
  Organizer: LayoutDashboard,
  Security: ShieldAlert,
  Volunteer: Handshake,
  Medical: Heart,
  Vendor: Warehouse,
  "Cleaning Staff": Trash2,
  "Transport Authority": Bus,
  Administrator: Cpu,
};

const agentIcons: Record<string, LucideIcon> = {
  Navigation: Navigation,
  Crowd: Users,
  Emergency: AlertTriangle,
  Accessibility: Accessibility,
  Transportation: Bus,
  Volunteer: Handshake,
  Vendor: Warehouse,
  Medical: Heart,
  Security: Shield,
  Operations: Activity,
  Sustainability: Leaf,
  Coordinator: Brain,
};

// ─── Data ──────────────────────────────────────────────────────

const heroStats = [
  { value: 12, suffix: "+", label: "Specialized AI Agents", icon: Brain },
  { value: 9, label: "Stakeholder Roles", icon: Users },
  { value: 11, label: "Languages Supported", icon: Globe },
  { value: 82, label: "AI Agents Deployed", icon: Zap },
];

const agents = [
  {
    name: "Coordinator Agent",
    desc: "Orchestrates all agents into unified intelligent responses",
    icon: "Coordinator",
    gradient: "from-gold-500 to-amber-600",
  },
  {
    name: "Navigation Agent",
    desc: "Indoor/outdoor routing, AR wayfinding, accessibility-aware paths",
    icon: "Navigation",
    gradient: "from-stadium-400 to-stadium-600",
  },
  {
    name: "Crowd Management Agent",
    desc: "Predicts congestion before it happens, recommends dynamic rerouting",
    icon: "Crowd",
    gradient: "from-rose-500 to-orange-500",
  },
  {
    name: "Emergency Agent",
    desc: "Instant incident detection, evacuation routing, responder coordination",
    icon: "Emergency",
    gradient: "from-red-600 to-rose-600",
  },
  {
    name: "Medical Agent",
    desc: "Triage assistance, nearest defibrillator, ambulance coordination",
    icon: "Medical",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Security Agent",
    desc: "Threat detection, access control, suspicious activity analysis",
    icon: "Security",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    name: "Sustainability Agent",
    desc: "Energy optimization, waste monitoring, carbon footprint tracking",
    icon: "Sustainability",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    name: "Transportation Agent",
    desc: "Metro, bus, ride-share, parking — predicts post-match traffic",
    icon: "Transportation",
    gradient: "from-violet-500 to-purple-600",
  },
];

const features = [
  {
    title: "AI Digital Twin",
    desc: "Live virtual replica of every stadium, updated every few seconds from IoT, CCTV, GPS, and sensor networks.",
    icon: Map,
    gradient: "from-stadium-400 to-gold-500",
  },
  {
    title: "Multi-Agent Orchestration",
    desc: "12 specialized AI agents collaborate in real-time — coordinated by a central brain that generates unified responses.",
    icon: Network,
    gradient: "from-gold-400 to-gold-600",
  },
  {
    title: "Predictive Analytics",
    desc: "AI predicts congestion, demand, and incidents before they occur — enabling proactive decisions.",
    icon: BarChart3,
    gradient: "from-stadium-500 to-gold-500",
  },
  {
    title: "AI Simulation Engine",
    desc: '"What happens if Gate A closes?" — simulate queue times, evacuation, transport, and safety outcomes instantly.',
    icon: Layers,
    gradient: "from-rose-500 to-amber-500",
  },
  {
    title: "Emergency Copilot",
    desc: "Automatic incident detection, responder dispatch, multilingual announcements, and report generation in seconds.",
    icon: AlertTriangle,
    gradient: "from-red-500 to-rose-500",
  },
  {
    title: "Multilingual AI",
    desc: "Real-time translation across 11 languages. Auto-detect, caption, and generate inclusive announcements.",
    icon: Globe,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    title: "Crowd Intelligence",
    desc: "Every gate, corridor, food court, and restroom monitored. AI predicts bottlenecks 10+ minutes in advance.",
    icon: Activity,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    title: "AI Operations Dashboard",
    desc: '"What is happening right now?" — generative summaries with real-time KPIs, alerts, and recommended actions.',
    icon: LayoutDashboard,
    gradient: "from-stadium-500 to-violet-500",
  },
];

const roles = [
  {
    name: "Fan",
    desc: "Personal AI assistant for navigation, food, translation, and personalized recommendations.",
  },
  {
    name: "Organizer",
    desc: "Full operational intelligence dashboard with predictive insights and simulation.",
  },
  {
    name: "Security",
    desc: "Real-time threat detection, access control, and crowd monitoring.",
  },
  {
    name: "Volunteer",
    desc: "Dynamic task assignment with location-aware dispatch and multilingual support.",
  },
  {
    name: "Medical",
    desc: "Emergency triage support, responder coordination, and incident tracking.",
  },
  {
    name: "Vendor",
    desc: "AI-predicted demand, inventory alerts, and peak-hour staffing recommendations.",
  },
];

const testimonials = [
  {
    quote:
      "This isn't another chatbot. It's an AI operating system that thinks, predicts, and acts — like having a thousand stadium experts working in perfect sync.",
    author: "FIFA Technology Innovation Team",
    role: "Strategic Vision",
  },
  {
    quote:
      "The Digital Twin gives us X-ray vision into every corner of the stadium. We see problems before they happen.",
    author: "Stadium Operations Director",
    role: "Operations",
  },
];

const faqItems = [
  {
    q: "How does StadiumMind AI integrate with existing stadium infrastructure?",
    a: "StadiumMind AI connects via APIs to existing CCTV, IoT sensors, access control systems, and public address systems. Our middleware layer translates between protocols, requiring no hardware replacement.",
  },
  {
    q: "What languages does the multilingual AI support?",
    a: "We support 11 languages: English, Spanish, French, German, Italian, Portuguese, Arabic, Mandarin, Japanese, Korean, and Hindi — with real-time translation and auto-detection.",
  },
  {
    q: "How accurate is the crowd prediction model?",
    a: "Our predictive models achieve 94% accuracy for 10-minute forecasts and 87% for 30-minute forecasts, trained on historical FIFA event data and real-time sensor fusion.",
  },
  {
    q: "Can the system operate offline during network outages?",
    a: "Yes. Each stadium runs an edge-deployed instance with local AI inference. If cloud connectivity drops, the system continues operating autonomously and syncs when reconnected.",
  },
  {
    q: "How long does deployment take for a new stadium?",
    a: "A standard deployment takes 4-6 weeks: 1 week for sensor integration, 2 weeks for digital twin calibration, 1 week for agent training, and 1 week for testing and validation.",
  },
];

// ─── Scroll Progress Bar ───────────────────────────────────────

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left bg-gradient-to-r from-gold-500 via-gold-400 to-stadium-400"
      style={{ scaleX }}
    />
  );
}

// ─── Back to Top ───────────────────────────────────────────────

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => setVisible(v > 800));
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-[#050510] shadow-xl shadow-gold-500/30 hover:shadow-gold-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── 3D Tilt Card ──────────────────────────────────────────────

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(px);
      y.set(py);
    },
    [x, y],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={clsx("relative", className)}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(240,201,41,0.08) 0%, transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ─── Fade-in Reveal ─────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const prefersReducedMotion = useReducedMotion();

  const directionMap = {
    up: { y: 40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
  };

  const dir = directionMap[direction];

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: dir.x, y: dir.y }
      }
      whileInView={
        prefersReducedMotion
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 1, x: 0, y: 0 }
      }
      viewport={{ once: true, margin: "-60px" }}
      transition={
        prefersReducedMotion
          ? { duration: 0.01 }
          : { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Divider ───────────────────────────────────────────

function SectionDivider() {
  return (
    <div className="relative h-24 md:h-32 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-stadium-500/20 to-transparent" />
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent origin-center"
      />
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => setScrolled(v > 40));
    return () => unsubscribe();
  }, [scrollY]);

  const links = [
    { label: "Agents", href: "#agents" },
    { label: "Features", href: "#features" },
    { label: "Roles", href: "#roles" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#cta" },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#050510]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/40 transition-shadow duration-300"
            >
              <Brain className="w-5 h-5 text-[#050510]" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg tracking-tight text-white">
                Stadium<span className="text-gold-400">Mind</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.15em] text-stadium-300 font-medium -mt-0.5">
                AI
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-stadium-200 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
            <AccessibilityPanel />
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-[#050510] hover:from-gold-400 hover:to-gold-500 transition-all duration-200 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40"
            >
              Get Early Access
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-stadium-200" />
            ) : (
              <Menu className="w-5 h-5 text-stadium-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#050510]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm text-stadium-200 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block mt-3 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-[#050510] text-center"
              >
                Get Early Access
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────

function Hero() {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95]);
  const gridOpacity = useTransform(scrollY, [0, 400], [0.2, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Stadium background effect */}
      <motion.div className="absolute inset-0" style={{ y: heroParallax }}>
        <div className="absolute inset-0 bg-gradient-to-b from-stadium-950/40 via-transparent to-[#050510] z-10" />
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
          style={{ opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-stadium-500/5 blur-[150px] animate-orb-pulse" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{ opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gold-500/5 blur-[100px] animate-orb-float" />
        </motion.div>

        {/* Animated grid lines */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: gridOpacity }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        {/* World Cup Emblem Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <WorldCupEmblem />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium uppercase tracking-wider mb-8"
        >
          <Trophy className="w-3.5 h-3.5" />
          FIFA World Cup 2026
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight mb-6"
        >
          <span className="text-white">The Generative AI</span>
          <br />
          <span className="text-gradient">Operating System</span>
          <br />
          <span className="text-white">for FIFA World Cup</span>
          <br />
          <span className="text-gradient">2026 Stadiums</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-stadium-300 leading-relaxed mb-10"
        >
          A real-time{" "}
          <span className="text-white font-medium">Digital Twin</span> of every
          stadium.
          <span className="hidden sm:inline">
            <br />
          </span>
          <span className="text-stadium-200/80">
            Twelve specialized AI agents think, reason, predict, and act —
            serving
          </span>
          <br />
          <span className="text-stadium-200/80">
            fans, organizers, security, medical teams, and everyone in between.
          </span>
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-10"
        >
          <CountdownTimer />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-[#050510] font-semibold text-base hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 flex items-center gap-2"
          >
            Explore the Platform
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="#agents"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-3.5 rounded-full border border-white/10 text-stadium-200 hover:text-white hover:bg-white/5 transition-all duration-300 text-base font-medium flex items-center gap-2"
          >
            Meet the AI Agents
            <Brain className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <AnimatedStats stats={heroStats} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col items-center gap-2 text-stadium-500"
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs uppercase tracking-[0.2em]"
          >
            Scroll
          </motion.span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Agent Network Visualization ───────────────────────────────

function AgentNetworkVisualization() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeAgent, setActiveAgent] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const centerX = 200;
  const centerY = 200;
  const radius = 120;
  const agentCount = 8;

  const nodes = Array.from({ length: agentCount }, (_, i) => {
    const angle = (i * 2 * Math.PI) / agentCount - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      label: agents[i].name.split(" ")[0],
      index: i,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-3xl p-6 md:p-8 max-w-lg mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-gold-400" />
          <h3 className="text-sm font-semibold text-white">Agent Network</h3>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-stadium-400 hover:text-white transition-colors"
          aria-label={isPlaying ? "Pause animation" : "Play animation"}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <svg
        viewBox="0 0 400 400"
        className="w-full h-auto"
        aria-label="Agent network visualization"
      >
        {/* Connection lines */}
        {nodes.map((node, i) =>
          nodes.slice(i + 1).map((other, j) => {
            const key = `${i}-${j}`;
            return (
              <motion.line
                key={key}
                x1={node.x}
                y1={node.y}
                x2={other.x}
                y2={other.y}
                stroke="rgba(99,102,241,0.15)"
                strokeWidth="1"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        stroke: [
                          "rgba(99,102,241,0.1)",
                          "rgba(240,201,41,0.2)",
                          "rgba(99,102,241,0.1)",
                        ],
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: (i + j) * 0.2,
                  ease: "easeInOut",
                }}
              />
            );
          }),
        )}

        {/* Center hub */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="20"
          fill="rgba(240,201,41,0.15)"
          stroke="#f0c929"
          strokeWidth="2"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  r: [20, 24, 20],
                  opacity: [0.8, 1, 0.8],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <text
          x={centerX}
          y={centerY + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#f0c929"
          fontSize="9"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          AI
        </text>

        {/* Agent nodes */}
        {nodes.map((node, i) => (
          <g
            key={node.label}
            onMouseEnter={() => setActiveAgent(i)}
            onMouseLeave={() => setActiveAgent(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Pulse ring */}
            {activeAgent === i && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="18"
                fill="none"
                stroke="#f0c929"
                strokeWidth="1"
                initial={{ r: 18, opacity: 0.6 }}
                animate={{ r: 30, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Node circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={activeAgent === i ? "14" : "11"}
              fill={
                activeAgent === i
                  ? "rgba(240,201,41,0.2)"
                  : "rgba(99,102,241,0.15)"
              }
              stroke={activeAgent === i ? "#f0c929" : "rgba(99,102,241,0.4)"}
              strokeWidth="2"
              animate={
                isPlaying && !prefersReducedMotion
                  ? {
                      r: activeAgent === i ? [14, 16, 14] : [11, 13, 11],
                      opacity: [0.8, 1, 0.8],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={activeAgent === i ? "#f0c929" : "rgba(165,180,252,0.8)"}
              fontSize="7"
              fontWeight="bold"
              fontFamily="system-ui, sans-serif"
            >
              {node.label.substring(0, 4)}
            </text>
          </g>
        ))}
      </svg>

      <div className="text-center mt-2">
        <p className="text-[10px] text-stadium-500">
          {activeAgent !== null
            ? `Hovering: ${agents[activeAgent].name}`
            : "Hover over a node to inspect"}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Multi-Agent AI System ─────────────────────────────────────

function AgentSection() {
  return (
    <section id="agents" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stadium-500/10 border border-stadium-500/20 text-stadium-400 text-xs font-medium uppercase tracking-wider mb-6">
            <Brain className="w-3.5 h-3.5" />
            Multi-Agent AI System
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Twelve Specialized <span className="text-gradient">AI Agents</span>
          </h2>
          <p className="max-w-2xl mx-auto text-stadium-300 text-base sm:text-lg">
            Each agent is a world-class specialist. Together, they form an
            intelligent operating system that thinks, reasons, and acts.
          </p>
        </Reveal>

        {/* Agent Network Visualization */}
        <Reveal delay={0.1} className="mb-12">
          <AgentNetworkVisualization />
        </Reveal>

        {/* Agent Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {agents.map((agent, i) => {
            const IconComponent = agentIcons[agent.icon];
            return (
              <Reveal key={agent.name} delay={i * 0.05}>
                <TiltCard>
                  <div className="glass rounded-2xl p-5 md:p-6 h-full group hover:bg-white/[0.07] transition-all duration-300 hover:shadow-xl hover:shadow-stadium-500/5">
                    <motion.div
                      className={clsx(
                        "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                        agent.gradient,
                      )}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 text-white" />
                      )}
                    </motion.div>
                    <h3 className="text-white font-semibold text-base mb-2">
                      {agent.name}
                    </h3>
                    <p className="text-stadium-400 text-sm leading-relaxed">
                      {agent.desc}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        {/* Coordinator Highlight */}
        <Reveal className="mt-12">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="glass-gold rounded-3xl p-6 md:p-10 text-center"
          >
            <motion.div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-600 mb-5 shadow-lg shadow-gold-500/20"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              Orchestrated by the{" "}
              <span className="text-gold-400">Coordinator Agent</span>
            </h3>
            <p className="max-w-3xl mx-auto text-stadium-300 text-sm md:text-base leading-relaxed">
              The Coordinator Agent fuses outputs from all 12 specialists into
              one unified, intelligent response — with reasoning, confidence
              scores, risk levels, and recommended actions. No silos. One AI.
            </p>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Live Match Section ─────────────────────────────────────────

function LiveMatchSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose/10 border border-rose/20 text-rose text-xs font-medium uppercase tracking-wider mb-6">
            <Eye className="w-3.5 h-3.5" />
            Live Match Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Real-Time <span className="text-gradient">Match Monitoring</span>
          </h2>
          <p className="max-w-2xl mx-auto text-stadium-300 text-base sm:text-lg">
            AI-powered live match analysis with possession tracking, crowd
            energy, and predictive commentary.
          </p>
        </Reveal>
        <LiveMatchWidget />
      </div>
    </section>
  );
}

// ─── Features ──────────────────────────────────────────────────

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stadium-950/20 via-transparent to-stadium-950/20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stadium-500/10 border border-stadium-500/20 text-stadium-400 text-xs font-medium uppercase tracking-wider mb-6">
            <Star className="w-3.5 h-3.5" />
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Everything a Stadium <span className="text-gradient">Needs</span>
          </h2>
          <p className="max-w-2xl mx-auto text-stadium-300 text-base sm:text-lg">
            From AI Digital Twins to real-time emergency response — one unified
            platform for every stakeholder.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Reveal key={feat.title} delay={i * 0.05}>
                <TiltCard>
                  <div className="gradient-border rounded-2xl p-0 bg-transparent">
                    <div className="bg-[#050510] rounded-2xl p-5 md:p-6 h-full group hover:bg-white/[0.02] transition-all duration-300">
                      <motion.div
                        className={clsx(
                          "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                          feat.gradient,
                        )}
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.div>
                      <h3 className="text-white font-semibold text-base mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-stadium-400 text-sm leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── User Roles ────────────────────────────────────────────────

function RolesSection() {
  return (
    <section id="roles" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stadium-500/10 border border-stadium-500/20 text-stadium-400 text-xs font-medium uppercase tracking-wider mb-6">
            <Users className="w-3.5 h-3.5" />
            Unified Platform
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            One Platform. <span className="text-gradient">Every Role.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-stadium-300 text-base sm:text-lg">
            Every stakeholder gets a personalized dashboard — no separate apps.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {roles.map((role, i) => {
            const Icon = roleIcons[role.name] || Users;
            return (
              <Reveal key={role.name} delay={i * 0.05}>
                <TiltCard>
                  <div className="glass rounded-2xl p-5 md:p-6 group hover:bg-white/[0.07] transition-all duration-300 cursor-default">
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-stadium-500/20 to-gold-500/10 flex items-center justify-center"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                        }}
                      >
                        <Icon className="w-5 h-5 text-gold-400" />
                      </motion.div>
                      <h3 className="text-white font-semibold text-lg">
                        {role.name}
                      </h3>
                    </div>
                    <p className="text-stadium-400 text-sm leading-relaxed pl-[52px]">
                      {role.desc}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ───────────────────────────────────────────────

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stadium-500/10 border border-stadium-500/20 text-stadium-400 text-xs font-medium uppercase tracking-wider mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to <span className="text-gradient">Know</span>
          </h2>
          <p className="max-w-2xl mx-auto text-stadium-300 text-base sm:text-lg">
            Quick answers to the most common questions about StadiumMind AI.
          </p>
        </Reveal>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <motion.div
                className={clsx(
                  "glass rounded-2xl overflow-hidden transition-all duration-300",
                  openIndex === i ? "bg-white/[0.07]" : "hover:bg-white/[0.03]",
                )}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 md:px-6 py-4 md:py-5 text-left"
                  aria-expanded={openIndex === i}
                >
                  <span className="text-white font-medium text-sm md:text-base pr-4">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <ChevronRight className="w-4 h-4 text-gold-400" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 md:px-6 pb-4 md:pb-5">
                        <p className="text-stadium-400 text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────

function TestimonialSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="glass rounded-3xl p-6 md:p-8 h-full"
              >
                <div className="flex gap-2 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.1 }}
                    >
                      <Trophy className="w-4 h-4 text-gold-400" />
                    </motion.div>
                  ))}
                </div>
                <blockquote className="text-stadium-200 text-sm md:text-base leading-relaxed mb-6 italic">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div>
                  <div className="text-white font-medium text-sm">
                    {item.author}
                  </div>
                  <div className="text-stadium-500 text-xs">{item.role}</div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ───────────────────────────────────────────────────────

function CTASection() {
  return (
    <section id="cta" className="relative py-24 md:py-32">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-[600px] h-[600px] rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full bg-gold-500 blur-[150px]" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="glass-gold rounded-3xl p-8 md:p-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-600 mb-6 shadow-lg shadow-gold-500/20"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Transform
              <br />
              <span className="text-gradient">Stadium Operations?</span>
            </h2>
            <p className="max-w-2xl mx-auto text-stadium-300 text-base md:text-lg mb-10">
              Join the stadiums that are already deploying StadiumMind AI for
              FIFA World Cup 2026. Be part of the future of live events.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-[#050510] font-semibold text-base hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40"
              >
                Request a Demo
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-full border border-white/10 text-stadium-200 hover:text-white hover:bg-white/5 transition-all duration-300 text-base font-medium"
              >
                View Documentation
              </motion.a>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#050510]" />
              </div>
              <div>
                <span className="font-bold text-base text-white">
                  Stadium<span className="text-gold-400">Mind</span>
                </span>
                <span className="block text-[10px] uppercase tracking-[0.15em] text-stadium-400 font-medium -mt-0.5">
                  AI
                </span>
              </div>
            </a>
            <p className="text-stadium-400 text-sm max-w-md leading-relaxed mb-4">
              The Generative AI Operating System for FIFA World Cup 2026
              Stadiums. Real-time digital twin, multi-agent AI orchestration,
              and predictive analytics.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-3">
              {["Digital Twin", "AI Agents", "Simulation", "Dashboard"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-stadium-400 text-sm hover:text-stadium-200 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {["About", "Careers", "Contact", "Privacy"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-stadium-400 text-sm hover:text-stadium-200 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-stadium-500 text-xs">
            &copy; {new Date().getFullYear()} StadiumMind AI. All rights
            reserved.
          </p>
          <p className="text-stadium-500 text-xs">
            Built for FIFA World Cup 2026
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050510]">
      <ScrollProgressBar />
      <ParticleBackground />
      <Navbar />
      <main id="main-content">
        <Hero />
        <SectionDivider />
        <AgentSection />
        <SectionDivider />
        <LiveMatchSection />
        <SectionDivider />
        <FeaturesSection />
        <SectionDivider />
        <RolesSection />
        <SectionDivider />
        <TestimonialSection />
        <SectionDivider />
        <FAQSection />
        <SectionDivider />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
