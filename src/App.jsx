import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  ArrowDown, ArrowUp, ArrowUpRight, BriefcaseBusiness,
  Building2, CakeSlice, Check, ChevronDown, Code2, ExternalLink,
  Github, Linkedin, Mail, MapPin, Menu, Monitor, PanelsTopLeft, Send,
  Sparkles, X, ChartNoAxesCombined, Wallet, FolderCode, Terminal,
  Layers3, MousePointer2, Zap, CircleCheck, Copy
} from "lucide-react";
import { profile, stats, skills, projects, experience } from "./data/portfolio";

const navLinks = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Journey", id: "experience" },
  { label: "Contact", id: "contact" },
];

const iconMap = {
  briefcase: BriefcaseBusiness, building: Building2,
  chart: ChartNoAxesCombined, cake: CakeSlice,
  panels: PanelsTopLeft, wallet: Wallet,
};

const colorMap = {
  indigo: "from-indigo-500/30 via-violet-500/10 to-cyan-500/20",
  emerald: "from-emerald-500/25 via-teal-500/10 to-cyan-500/20",
  amber: "from-amber-500/25 via-orange-500/10 to-rose-500/20",
  pink: "from-pink-500/25 via-rose-500/10 to-orange-500/20",
  sky: "from-sky-500/25 via-blue-500/10 to-indigo-500/20",
  lime: "from-lime-500/20 via-emerald-500/10 to-teal-500/20",
};

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, highlight, description }) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="mb-3 text-xs font-bold uppercase tracking-[.24em] text-indigo-300">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
        {title} {highlight && <span className="gradient-text">{highlight}</span>}
      </h2>
      {description && <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">{description}</p>}
    </Reveal>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        let current = "home";
        const y = window.scrollY + 150;
        navLinks.forEach(({ id }) => {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= y) current = id;
        });
        setActive((previous) => previous === current ? previous : current);
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.06] bg-[#0b1b33]/90 backdrop-blur-xl">
      <nav aria-label="Primary navigation" className="section-shell flex h-[72px] items-center justify-between">
        <a href="#home" onClick={() => setOpen(false)} className="flex items-center gap-2.5 font-bold tracking-tight text-white">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300"><Code2 size={20} /></span>
          <span>wonderweb technologies</span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? "location" : undefined} className={`text-sm transition ${active === link.id ? "text-white" : "text-slate-400 hover:text-white"}`}>
              {link.label}
            </a>
          ))}
        </div>
        <a href="#contact" className="hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:border-indigo-400 hover:bg-indigo-500/10 md:flex">
          Let's talk <ArrowUpRight size={15} />
        </a>
        <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-controls={open ? "mobile-menu" : undefined} aria-expanded={open} onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl border border-white/10 text-white md:hidden">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/10 bg-[#0b0f19] md:hidden">
            <div className="section-shell flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? "location" : undefined} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white">{link.label}</a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="mt-2 rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white">Let's talk</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden pt-24">
      <div className="grid-background absolute inset-0 opacity-70" />
      <div className="absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-600/[.12] blur-[130px]" />
      <div className="absolute right-[-100px] top-[34%] size-72 rounded-full bg-cyan-500/[.08] blur-[100px]" />
      <div className="section-shell relative z-10 grid items-center gap-14 py-16 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[.06] px-3.5 py-2 text-xs text-emerald-300">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-emerald-400" /></span>
            {profile.availability}
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }} className="mb-4 text-sm font-medium text-slate-400">Hello, I'm {profile.name} 👋</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .65 }} className="max-w-3xl text-5xl font-bold leading-[1.06] tracking-[-.055em] text-white sm:text-6xl md:text-7xl xl:text-[82px]">
            Building the web, <span className="gradient-text">one idea</span> at a time.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 }} className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            {profile.description}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .38 }} className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="group inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400">
              Explore my work <ArrowUpRight size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[.04]">
              <Mail size={16} /> Get in touch
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }} className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-indigo-300" /> {profile.location}</span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" />
            <span className="text-slate-500">Currently focused on <span className="text-slate-300">React & UI engineering</span></span>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: .92, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .25, duration: .7 }} className="relative mx-auto w-full max-w-[420px]">
          <div className="absolute -inset-5 rounded-[36px] bg-gradient-to-br from-indigo-500/20 via-transparent to-cyan-500/15 blur-2xl" />
          <div className="glass-panel float-animation relative rounded-[30px] p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/[.08] pb-4">
              <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-rose-400" /><span className="size-2.5 rounded-full bg-amber-300" /><span className="size-2.5 rounded-full bg-emerald-400" /></div>
              <span className="font-mono text-[11px] text-slate-500">developer.js</span>
              <Code2 size={16} className="text-indigo-300" />
            </div>
            <div className="py-7 font-mono text-sm leading-8 sm:text-[15px]">
              <p className="text-slate-500">// A little about me</p>
              <p><span className="text-fuchsia-300">const</span> <span className="text-cyan-300">developer</span> = {"{"}</p>
              <p className="pl-5"><span className="text-indigo-300">name</span>: <span className="text-emerald-300">"{profile.name}"</span>,</p>
              <p className="pl-5"><span className="text-indigo-300">passion</span>: <span className="text-emerald-300">"Building for people"</span>,</p>
              <p className="pl-5"><span className="text-indigo-300">tools</span>: [</p>
              <p className="pl-10 text-amber-200">"React", "JavaScript",</p>
              <p className="pl-10 text-amber-200">"Tailwind CSS"</p>
              <p className="pl-5">],</p>
              <p className="pl-5"><span className="text-indigo-300">mindset</span>: <span className="text-emerald-300">"Always learning"</span></p>
              <p>{"}"}</p>
              <p className="mt-4 text-slate-500">// Let's build something useful.</p>
              <p><span className="text-fuchsia-300">return</span> <span className="text-cyan-300">greatIdeas</span>();<span className="ml-1 inline-block h-4 w-2 animate-pulse bg-indigo-400 align-middle" /></p>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/[.07] bg-white/[.025] p-4">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300"><Zap size={19} /></span><div><p className="text-sm font-semibold text-white">Curious by nature</p><p className="mt-1 text-xs text-slate-500">Building, breaking, learning.</p></div></div>
              <Sparkles size={18} className="text-cyan-300" />
            </div>
          </div>
          <div className="glass-panel absolute -left-5 top-[22%] hidden items-center gap-2.5 rounded-2xl px-4 py-3 shadow-xl sm:flex"><span className="grid size-9 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><Terminal size={18} /></span><div><p className="text-xs font-semibold text-white">Clean code</p><p className="text-[10px] text-slate-500">Built with care</p></div></div>
          <div className="glass-panel absolute -right-4 bottom-[20%] hidden items-center gap-2.5 rounded-2xl px-4 py-3 shadow-xl sm:flex"><span className="grid size-9 place-items-center rounded-xl bg-violet-400/10 text-violet-300"><MousePointer2 size={18} /></span><div><p className="text-xs font-semibold text-white">Thoughtful UI</p><p className="text-[10px] text-slate-500">Made for people</p></div></div>
        </motion.div>
      </div>
      <a href="#about" aria-label="Scroll to about section" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-slate-500 transition hover:text-white md:flex">Scroll to explore <ArrowDown size={14} /></a>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section-space border-y border-white/[.05] bg-white/[.012]">
      <div className="section-shell">
        <SectionHeading eyebrow="A little about me" title="Curiosity meets" highlight="craft." description="I enjoy the space where thoughtful design and practical engineering come together." />
        <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <Reveal>
            <div className="space-y-5 text-[15px] leading-8 text-slate-400">
              <p>I'm a developer who cares about more than making things work. I care about how they feel, how clearly they communicate, and how easily people can use them.</p>
              <p>My approach is simple: understand the problem, keep the solution focused, and sweat the details that make an experience feel polished. I enjoy learning new tools and turning ideas into useful products.</p>
              <p>Outside the code editor, you'll usually find me exploring design inspiration, refining side projects, or learning something new.</p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={profile.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} /></a>
            </div>
          </Reveal>
          <Reveal delay={.12} className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-white/[.08] bg-[#0d121e] p-5">
                <span className="w-24 shrink-0 text-3xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">{stat.value}</span>
                <span className="text-sm leading-6 text-slate-400">{stat.label}</span>
                <span className="ml-auto text-indigo-300"><ArrowUpRight size={18} /></span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const icons = [Code2, Layers3, Monitor];
  return (
    <section id="skills" className="section-space">
      <div className="section-shell">
        <SectionHeading eyebrow="What I work with" title="Tools of the" highlight="trade." description="A growing toolkit for building accessible, maintainable, and polished web experiences." />
        <div className="grid gap-4 md:grid-cols-3">
          {skills.map((group, i) => {
            const Icon = icons[i] || Code2;
            return <Reveal key={group.category} delay={i * .08}>
              <div className="h-full rounded-2xl border border-white/[.08] bg-[#0d121e] p-6 transition hover:border-indigo-400/30">
                <div className="mb-5 grid size-11 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300"><Icon size={21} /></div>
                <h3 className="text-lg font-semibold text-white">{group.category}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => <span key={item} className="rounded-lg border border-white/[.08] bg-white/[.025] px-3 py-2 text-xs text-slate-300 transition hover:border-indigo-400/30 hover:text-white">{item}</span>)}
                </div>
              </div>
            </Reveal>;
          })}
        </div>
        <Reveal className="mt-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-indigo-400/15 bg-indigo-500/[.05] p-5 sm:flex-row sm:items-center">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300"><Sparkles size={19} /></span>
            <p className="text-sm leading-6 text-slate-400"><span className="font-semibold text-slate-200">Always learning.</span> The best tool is the one that solves the problem clearly. My toolkit evolves as I build and explore.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const ProjectCard = forwardRef(function ProjectCard({ project, index }, ref) {
  const Icon = iconMap[project.icon] || FolderCode;
  const [copyStatus, setCopyStatus] = useState("");
  const copyTimer = useRef(null);

  const copyProjectLink = async () => {
    window.clearTimeout(copyTimer.current);
    copyTimer.current = null;
    try {
      await navigator.clipboard.writeText(project.demo);
      setCopyStatus("Website link copied.");
      copyTimer.current = window.setTimeout(() => {
        setCopyStatus("");
        copyTimer.current = null;
      }, 1800);
    } catch {
      setCopyStatus("Copying is unavailable in this browser.");
    }
  };

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  return (
    <motion.article ref={ref} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .45, delay: (index % 3) * .07 }} whileHover={{ y: -5 }} className="group overflow-hidden rounded-2xl border border-white/[.09] bg-[#0d121e] transition-colors hover:border-indigo-400/40">
      <div className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br ${colorMap[project.color] || colorMap.indigo}`}>
        <div className="grid-background absolute inset-0 opacity-60" />
        <div className="relative grid size-24 place-items-center rounded-3xl border border-white/15 bg-black/20 text-white shadow-2xl backdrop-blur-sm transition duration-500 group-hover:scale-110 group-hover:rotate-3 sm:size-28"><Icon size={42} strokeWidth={1.3} /></div>
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">{project.category}</span>
        <span className="absolute bottom-4 right-4 text-5xl font-black text-white/[.07]">{String(project.id).padStart(2, "0")}</span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-semibold text-white">{project.title}</h3><ArrowUpRight size={20} className="shrink-0 text-slate-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-indigo-300" /></div>
        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-md border border-white/[.07] bg-white/[.03] px-2.5 py-1 text-[11px] text-slate-300">{tag}</span>)}</div>
        <div className="mt-6 flex gap-3 border-t border-white/[.07] pt-4">
          <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-indigo-300">Live demo <ExternalLink size={14} /></a>
          <button type="button" onClick={copyProjectLink} aria-label={`Copy ${project.title} website link`} className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            {copyStatus === "Website link copied." ? <Check size={15} className="text-emerald-300" /> : <Copy size={15} />}
            {copyStatus === "Website link copied." ? "Copied" : "Copy link"}
          </button>
          <a href={project.github} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"><Github size={15} /> Source</a>
        </div>
        {copyStatus && <p role="status" className={`mt-2 text-xs ${copyStatus === "Website link copied." ? "text-emerald-300" : "text-amber-200"}`}>{copyStatus}</p>}
      </div>
    </motion.article>
  );
});

function Projects() {
  const [filter, setFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const filters = ["All", "Website", "Web Application", "Dashboard"];
  const visibleProjects = useMemo(() => {
    const filtered = projects.filter(p => filter === "All" || p.category === filter);
    return showAll ? filtered : filtered.filter(p => p.featured);
  }, [filter, showAll]);

  return (
    <section id="projects" className="section-space border-y border-white/[.05] bg-white/[.012]">
      <div className="section-shell">
        <SectionHeading eyebrow="Selected work" title="Things I've" highlight="built." description="A selection of concepts and projects that show how I approach design, frontend development, and problem solving." />
        <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map(item => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2.5 text-xs font-medium transition ${filter === item ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/15" : "border border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}>{item}</button>)}
          </div>
          <span aria-live="polite" className="text-xs text-slate-500">{visibleProjects.length} projects</span>
        </Reveal>
        <div id="project-grid" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
          </AnimatePresence>
        </div>
        {filter === "All" && <div className="mt-9 text-center"><button type="button" aria-expanded={showAll} aria-controls="project-grid" onClick={() => setShowAll(v => !v)} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-indigo-400/40 hover:bg-white/[.03]">{showAll ? "Show featured projects" : "View all projects"} <ChevronDown size={16} className={`transition ${showAll ? "rotate-180" : ""}`} /></button></div>}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="section-space">
      <div className="section-shell">
        <SectionHeading eyebrow="The journey" title="Learning by" highlight="doing." description="Every project is an opportunity to get a little better, solve a new problem, and build with more intention." />
        <div className="relative ml-2 space-y-8 border-l border-indigo-400/25 pl-7 sm:ml-4 sm:pl-10">
          {experience.map((item, i) => (
            <Reveal key={item.period} delay={i * .08} className="relative">
              <span className="absolute -left-[35px] top-1.5 grid size-4 place-items-center rounded-full border border-indigo-300/50 bg-[#080b12] sm:-left-[49px]"><span className={`size-1.5 rounded-full ${i === 0 ? "bg-indigo-300" : "bg-slate-600"}`} /></span>
              <div className="rounded-2xl border border-white/[.08] bg-[#0d121e] p-5 sm:p-7">
                <div className="mb-3 flex flex-wrap items-center gap-3"><span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">{item.period}</span>{i === 0 && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300"><CircleCheck size={13} /> Current</span>}</div>
                <h3 className="text-xl font-semibold text-white">{item.role}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.company}</p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubmissionPopup({ popup, onClose }) {
  const closeButton = useRef(null);

  useEffect(() => {
    if (!popup) return undefined;
    closeButton.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [popup, onClose]);

  if (!popup) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-popup-title"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl"
      >
        <div className={`mb-4 grid size-12 place-items-center rounded-full ${popup.success ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}>
          {popup.success ? <Check size={24} /> : <X size={24} />}
        </div>
        <h2 id="submission-popup-title" className="text-xl font-semibold text-white">
          {popup.success ? "Message sent" : "Message not sent"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{popup.message}</p>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
        >
          {popup.success ? "Done" : "Close"}
        </button>
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [popup, setPopup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyNotice, setCopyNotice] = useState("");
  const [draftNotice, setDraftNotice] = useState("Your draft stays in this browser and is sent only when you submit.");
  const copyTimer = useRef(null);
  const submissionFrame = useRef(null);
  const submissionTimer = useRef(null);
  const submissionFallbackTimer = useRef(null);
  const submissionPending = useRef(false);
  const googleScriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
  const closePopup = useCallback(() => setPopup(null), []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio-contact-draft");
      if (!saved) return;
      const draft = JSON.parse(saved);
      if (!draft || typeof draft !== "object" || Array.isArray(draft)) {
        setDraftNotice("A saved draft could not be read and was ignored.");
        return;
      }
      setForm((current) => ({
        ...current,
        name: typeof draft.name === "string" ? draft.name : current.name,
        email: typeof draft.email === "string" ? draft.email : current.email,
        phone: typeof draft.phone === "string" ? draft.phone : current.phone,
        subject: typeof draft.subject === "string" ? draft.subject : current.subject,
        message: typeof draft.message === "string" ? draft.message : current.message,
      }));
    } catch {
      setDraftNotice("Draft recovery is unavailable in this browser.");
    }
  }, []);

  const update = (event) => {
    const next = { ...form, [event.target.name]: event.target.value };
    setForm(next);
    try {
      localStorage.setItem("portfolio-contact-draft", JSON.stringify(next));
      setDraftNotice("Your draft stays in this browser and is sent to the spreadsheet only when you submit.");
    } catch {
      setDraftNotice("This browser could not save your draft; submit to send your message.");
    }
  };

  const submit = (event) => {
    if (isSubmitting) {
      event.preventDefault();
      return;
    }

    if (!googleScriptUrl) {
      event.preventDefault();
      setPopup({
        success: false,
        message: "The contact form is not connected yet. Please try again later or email us directly.",
      });
      return;
    }

    setPopup(null);
    submissionPending.current = true;
    setIsSubmitting(true);
    window.clearTimeout(submissionTimer.current);
    window.clearTimeout(submissionFallbackTimer.current);
    submissionTimer.current = window.setTimeout(() => {
      submissionPending.current = false;
      setIsSubmitting(false);
      setPopup({
        success: false,
        message: "We could not confirm delivery. Please try again or email us directly.",
      });
      submissionTimer.current = null;
    }, 30000);
  };

  const finishSubmission = useCallback((success) => {
    if (!submissionPending.current) return;

    submissionPending.current = false;
    window.clearTimeout(submissionTimer.current);
    window.clearTimeout(submissionFallbackTimer.current);
    submissionTimer.current = null;
    submissionFallbackTimer.current = null;
    setIsSubmitting(false);

    if (success) {
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      try {
        localStorage.removeItem("portfolio-contact-draft");
        setDraftNotice("Your message was sent. A new draft stays in this browser until submitted.");
      } catch {
        setDraftNotice("Your message was sent.");
      }
      setPopup({
        success: true,
        message: "Thanks for reaching out. Your details have been added to our contact sheet.",
      });
    } else {
      setPopup({
        success: false,
        message: "We couldn't save your message. Please try again or email us directly.",
      });
    }
  }, []);

  const handleSubmissionMessage = useCallback((event) => {
    if (event.source !== submissionFrame.current?.contentWindow) return;
    if (event.data?.type !== "portfolio-contact-result" || typeof event.data.success !== "boolean") return;
    finishSubmission(event.data.success);
  }, [finishSubmission]);

  const handleSubmissionFrameLoad = () => {
    if (!submissionPending.current) return;

    window.clearTimeout(submissionFallbackTimer.current);
    submissionFallbackTimer.current = window.setTimeout(() => {
      finishSubmission(true);
    }, 1000);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyNotice("");
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => {
        setCopied(false);
        copyTimer.current = null;
      }, 1800);
    } catch {
      setCopyNotice("Copying is unavailable. You can select and copy the email address above.");
    }
  };

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);
  useEffect(() => {
    window.addEventListener("message", handleSubmissionMessage);
    return () => {
      window.removeEventListener("message", handleSubmissionMessage);
      submissionPending.current = false;
      window.clearTimeout(submissionTimer.current);
      window.clearTimeout(submissionFallbackTimer.current);
    };
  }, [handleSubmissionMessage]);

  return (
    <section id="contact" className="section-space border-t border-white/[.05] bg-white/[.012]">
      <div className="section-shell">
        <SectionHeading eyebrow="Have a project in mind?" title="Let's make" highlight="it happen." description="Have an idea, an opportunity, or just want to say hello? I'd love to hear from you." />
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal className="space-y-4">
            <div className="rounded-2xl border border-white/[.08] bg-[#0d121e] p-6 sm:p-7">
              <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-300"><Mail size={22} /></div>
              <h3 className="text-xl font-semibold text-white">Start a conversation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">The best collaborations start with a simple message. Tell me what you're thinking about.</p>
              <button type="button" onClick={copyEmail} className="mt-6 flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.025] p-4 text-left transition hover:border-indigo-400/30">
                <span className="min-w-0"><span className="mb-1 block text-[11px] text-slate-500">EMAIL ME AT</span><span className="break-all text-sm font-medium text-slate-200">{profile.email}</span></span>
                {copied ? <Check size={17} className="shrink-0 text-emerald-300" /> : <Copy size={16} className="shrink-0 text-slate-500" />}
              </button>
              {(copied || copyNotice) && <p role="status" className={`mt-2 text-xs ${copied ? "text-emerald-300" : "text-amber-200"}`}>{copied ? "Email copied to clipboard." : copyNotice}</p>}
            </div>
            <div className="rounded-2xl border border-white/[.08] bg-[#0d121e] p-6">
              <p className="text-xs uppercase tracking-[.18em] text-slate-500">Find me online</p>
              <div className="mt-4 flex gap-3">
                <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-11 place-items-center rounded-xl border border-white/10 text-slate-300 transition hover:border-indigo-400/30 hover:text-white"><Github size={19} /></a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-11 place-items-center rounded-xl border border-white/10 text-slate-300 transition hover:border-indigo-400/30 hover:text-white"><Linkedin size={19} /></a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={.1}>
            <form
              action={googleScriptUrl || undefined}
              method="POST"
              target="google-sheets-contact-response"
              onSubmit={submit}
              className="rounded-2xl border border-white/[.08] bg-[#0d121e] p-5 sm:p-7"
            >
              <div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300"><Send size={18} /></span><div><h3 className="font-semibold text-white">Contact us</h3><p className="mt-1 text-xs text-slate-500">Your message is sent to our contact sheet</p></div></div>
              <input
                type="text"
                name="website"
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[10000px] h-px w-px"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-medium text-slate-300">Your name<input required maxLength={120} autoComplete="name" name="name" value={form.name} onChange={update} placeholder="Jane Smith" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60" /></label>
                <label className="block text-xs font-medium text-slate-300">Email address<input required maxLength={254} autoComplete="email" type="email" name="email" value={form.email} onChange={update} placeholder="jane@example.com" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60" /></label>
              </div>
              <label className="mt-4 block text-xs font-medium text-slate-300">Phone number<input required maxLength={30} autoComplete="tel" type="tel" name="phone" value={form.phone} onChange={update} placeholder="+1 555 123 4567" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60" /></label>
              <label className="mt-4 block text-xs font-medium text-slate-300">Subject<input maxLength={160} name="subject" value={form.subject} onChange={update} placeholder="What would you like to discuss?" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60" /></label>
              <label className="mt-4 block text-xs font-medium text-slate-300">Message<textarea required minLength={10} maxLength={5000} rows={5} name="message" value={form.message} onChange={update} placeholder="Tell me a little about your idea..." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#080b12] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60" /></label>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {draftNotice} Submitting stores your contact details in the Google Sheet for follow-up.
              </p>
              {isSubmitting && <p role="status" className="mt-3 rounded-lg bg-indigo-400/10 p-3 text-xs leading-5 text-indigo-200">Sending your message…</p>}
              <button type="submit" disabled={isSubmitting} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/15 transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60">
                {isSubmitting ? "Sending…" : "Submit"}
                {!isSubmitting && <ArrowUpRight size={16} />}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
      <iframe
        ref={submissionFrame}
        onLoad={handleSubmissionFrameLoad}
        name="google-sheets-contact-response"
        title="Contact form submission response"
        className="hidden"
      />
      <SubmissionPopup popup={popup} onClose={closePopup} />
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[.08]">
      <div className="section-shell flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
        <a href="#home" className="text-sm font-semibold text-white">{profile.name} <span className="text-indigo-400">©</span> {new Date().getFullYear()}</a>
        <p className="text-xs text-slate-500">Designed & built with React and Tailwind CSS.</p>
        <div className="flex items-center gap-4">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-white"><Github size={17} /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-white"><Linkedin size={17} /></a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="text-slate-400 hover:text-white"><Mail size={17} /></a>
          <a href="#home" aria-label="Back to top" className="grid size-9 place-items-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5"><ArrowUp size={16} /></a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-slate-950">
        Skip to content
      </a>
      <div className="min-h-screen overflow-hidden bg-[#080b12] text-slate-200">
        <Navbar />
        <main id="main-content">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
