const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteUrl = (
  configuredSiteUrl ??
  (process.env.NODE_ENV === "production"
    ? "https://aditya-dutta-portfolio-website.vercel.app"
    : "http://localhost:3800")
).replace(/\/$/, "");

export const site = {
  title: "Aditya Dutta — Senior UI Developer",
  description:
    "An editorial, scroll-driven view of Aditya Dutta's portfolio: seven years of frontend and UI development across ShyftLabs, illuminz and Virtual KPO Consultants.",
  name: "Aditya Dutta",
  role: "Senior UI Developer",
  location: "Noida, Uttar Pradesh, India",
  email: "designer.ad07@gmail.com",
  linkedin: "https://www.linkedin.com/in/aditya-dutta-620762205",
} as const;
