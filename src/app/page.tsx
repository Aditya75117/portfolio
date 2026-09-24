import { IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { AnimatedFooter } from "@/components/animated/AnimatedFooter";
import { AnimatedHero } from "@/components/animated/AnimatedHero";
import { AnimatedNav } from "@/components/animated/AnimatedNav";
import { Contact } from "@/components/animated/Contact";
import { Method } from "@/components/animated/Method";
import { Premise } from "@/components/animated/Premise";
import { Record } from "@/components/animated/Record";
import { SmoothScrollProvider } from "@/components/animated/SmoothScroll";
import { Toolkit } from "@/components/animated/Toolkit";
import "@/styles/animated/main.scss";

const display = Instrument_Serif({
  variable: "--font-av-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-av-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default function Home() {
  return (
    <div className={`av ${display.variable} ${mono.variable}`}>
      <span className="av__grain" aria-hidden />
      <span className="av__vignette" aria-hidden />

      <SmoothScrollProvider>
        <a href="#av-main" className="av-skip">
          Skip to content
        </a>

        <AnimatedNav />

        <main id="av-main" className="av__main">
          <AnimatedHero />
          <Premise />
          <Record />
          <Toolkit />
          <Method />
          <Contact />
        </main>

        <AnimatedFooter />
      </SmoothScrollProvider>
    </div>
  );
}
