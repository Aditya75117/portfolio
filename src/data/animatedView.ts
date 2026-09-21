/**
 * Editorial copy for the portfolio landing page.
 */

export const animatedView = {
  logo: "AD.",
  name: "Aditya Dutta",
  role: "Senior UI Developer",
  location: "Noida, Uttar Pradesh, India",
  /** IANA zone for the "local time" readout in the closing scene. */
  timeZone: "Asia/Kolkata",
  email: "designer.ad07@gmail.com",
  linkedin: "https://www.linkedin.com/in/aditya-dutta-620762205",
  cvHref: "/cv.pdf",
  journeyHref:
    process.env.NEXT_PUBLIC_JOURNEY_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://aditya-career-journey.vercel.app"
      : "http://localhost:3801"),

  hero: {
    kicker: "Portfolio — Vol. 01",
    /** Rendered as separate lines so each can be masked and revealed on its own. */
    headline: ["Interfaces", "built to", "last."],
    /** Index of the line rendered in the display serif accent face. */
    accentLine: 2,
    standfirst:
      "Senior UI Developer in Noida. Seven years turning dense product requirements into React and Next.js interfaces that stay fast, accessible and maintainable long after launch.",
    availability: "Open to senior frontend work",
    /* Unsplash License: free for commercial use, no attribution required. */
    image: {
      src: "/animated/hero-workspace.jpg",
      alt: "A laptop on a wooden desk showing a code editor at night, beside a phone and notebook.",
      caption: "Fig. 01 — The desk, most evenings",
    },
    meta: [
      { label: "Based in", value: "Noida, IN" },
      { label: "Focus", value: "React · Next.js · TypeScript" },
      { label: "Since", value: "2019" },
    ],
    primaryCta: { label: "Read the record", href: "#record" },
    secondaryCta: { label: "Download CV" },
    scrollCue: "Scroll",
  },

  manifesto: {
    index: "01",
    eyebrow: "The premise",
    title: ["I sit where design", "meets engineering —", "and I hold both."],
    accentWord: "both",
    body: [
      "I started as a web designer, which means I read a Figma file the way it was drawn: the spacing is intentional, the type scale is a decision, the empty space is doing work. Then I build it as a component system that survives the next six feature requests.",
      "Day to day that is React.js, Next.js, TypeScript and Sass — reusable UI, honest accessibility, and performance treated as a feature rather than a cleanup task. The rest is collaboration: designers, backend engineers and stakeholders, all the way through release.",
    ],
    metrics: [
      { value: 7, suffix: "+", label: "Years in frontend & UI" },
      { value: 3, suffix: "", label: "Companies shipped with" },
      { value: 8, suffix: "", label: "Core tools in daily use" },
    ],
    /** Non-numeric facts shown alongside the counters. */
    footnotes: [
      { label: "Education", value: "MCA, Chandigarh University" },
      { label: "Current role", value: "Senior UI Developer, ShyftLabs" },
    ],
  },

  record: {
    index: "02",
    eyebrow: "The record",
    title: "Where the work happened.",
    aside: "Three roles, one throughline: interfaces other developers can keep building on.",
    cta: { label: "Full history on LinkedIn", href: "https://www.linkedin.com/in/aditya-dutta-620762205" },
    entries: [
      {
        id: "shyftlabs",
        company: "ShyftLabs",
        title: "Senior UI Developer",
        period: "Feb 2024 — Present",
        year: "2024",
        summary:
          "Leading UI development on data-heavy product surfaces — building the component system, holding the quality bar on responsiveness and accessibility, and reviewing frontend work as the team ships.",
        stack: ["React.js", "Next.js", "TypeScript", "Sass"],
        art: {
          kind: "logo" as const,
          src: "/projects/shyftlabs-logo-white.png",
          width: 620,
          height: 114,
          motif: "grid" as const,
        },
      },
      {
        id: "illuminz",
        company: "illuminz",
        title: "Frontend Developer",
        period: "Nov 2021 — Feb 2024",
        year: "2021",
        summary:
          "Built responsive client web applications from Figma to production across a fast agency cadence, turning recurring layout patterns into reusable components instead of rebuilding them per project.",
        stack: ["React.js", "JavaScript", "Sass", "Figma"],
        art: {
          kind: "logo" as const,
          src: "/projects/illuminz-logo.png",
          width: 620,
          height: 164,
          motif: "orbit" as const,
        },
      },
      {
        id: "virtual-kpo",
        company: "Virtual KPO Consultants",
        title: "Web Designer",
        period: "Jun 2019 — Oct 2021",
        year: "2019",
        summary:
          "Where the design half comes from — designing and building marketing sites end to end, and learning that a layout is only finished once it holds up on every screen it lands on.",
        stack: ["HTML5", "CSS3", "JavaScript", "Figma"],
        art: {
          kind: "wordmark" as const,
          label: "Virtual KPO",
          motif: "rule" as const,
        },
      },
    ],
  },

  toolkit: {
    index: "03",
    eyebrow: "The toolkit",
    title: "Eight things, used properly.",
    note: "Engineering precision, backed by design experience.",
    items: [
      { icon: "react", label: "React.js", note: "Component architecture" },
      { icon: "nextjs", label: "Next.js", note: "App Router & rendering" },
      { icon: "typescript", label: "TypeScript", note: "Types as documentation" },
      { icon: "javascript", label: "JavaScript", note: "The fundamentals" },
      { icon: "sass", label: "Sass", note: "Scalable stylesheets" },
      { icon: "css3", label: "CSS3", note: "Layout & motion" },
      { icon: "html5", label: "HTML5", note: "Semantics first" },
      { icon: "figma", label: "Figma", note: "Design handoff" },
    ],
  },

  method: {
    index: "04",
    eyebrow: "The method",
    title: ["From requirements", "to a polished release."],
    accentWord: "polished",
    steps: [
      {
        step: "01",
        title: "Understand",
        body: "Align with stakeholders on user needs, business goals, technical constraints and what success actually looks like — before a single component exists.",
      },
      {
        step: "02",
        title: "Translate",
        body: "Turn Figma concepts and written requirements into a clear responsive plan: the layout rules, the breakpoints, and the reusable pieces worth extracting.",
      },
      {
        step: "03",
        title: "Build",
        body: "Develop maintainable React.js and Next.js interfaces with clean code, real accessibility and performance considered while writing, not after.",
      },
      {
        step: "04",
        title: "Refine",
        body: "Test across devices and browsers, tune performance, and collaborate through release until the thing that ships is the thing that was designed.",
      },
    ],
  },

  contact: {
    index: "05",
    eyebrow: "The invitation",
    title: ["Building something", "on the web?"],
    accentLine: 1,
    body: "If you need a frontend developer who can read the design and own the implementation, the fastest route is a direct email.",
    cta: "Say hello",
    copyLabel: "Copy address",
    copiedLabel: "Copied",
  },

  footer: {
    note: "Designed and built in Noida.",
    colophon: "Next.js · TypeScript · Sass · GSAP",
  },

  nav: [
    { label: "Top", href: "#top", id: "top" },
    { label: "Premise", href: "#premise", id: "premise" },
    { label: "Record", href: "#record", id: "record" },
    { label: "Toolkit", href: "#toolkit", id: "toolkit" },
    { label: "Method", href: "#method", id: "method" },
    { label: "Contact", href: "#contact", id: "contact" },
  ],
} as const;

export type AnimatedViewData = typeof animatedView;
export type RecordEntry = (typeof animatedView.record.entries)[number];
