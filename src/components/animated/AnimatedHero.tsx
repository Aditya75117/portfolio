import { animatedView } from "@/data/animatedView";
import { Icon } from "@/components/icons/Icon";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroImage } from "./HeroImage";
import { Reveal } from "./Reveal";
import { SplitLines } from "./SplitLines";

const { hero, role, name } = animatedView;

export function AnimatedHero() {
  return (
    <section id="top" className="av-hero">
      <HeroBackdrop />

      <div className="av-shell av-hero__inner">
        <div className="av-hero__masthead">
          <span className="av-mono">{hero.kicker}</span>
          <span className="av-mono av-hero__byline">
            {name} — {role}
          </span>
        </div>
        <hr className="av-rule" />

        <div className="av-hero__stage">
          <SplitLines
            as="h1"
            lines={hero.headline}
            accentLine={hero.accentLine}
            className="av-hero__headline"
            play="mount"
            delay={0.2}
          />
          <HeroImage
            src={hero.image.src}
            alt={hero.image.alt}
            caption={hero.image.caption}
          />
        </div>

        <div className="av-hero__foot">
          <Reveal className="av-hero__lede" delay={0.5}>
            <p className="av-hero__standfirst">{hero.standfirst}</p>
            <p className="av-hero__available">
              <span className="av-hero__pulse" aria-hidden />
              {hero.availability}
            </p>
          </Reveal>

          <Reveal className="av-hero__side" delay={0.62}>
            <dl className="av-hero__meta">
              {hero.meta.map((item) => (
                <div key={item.label} className="av-hero__meta-row">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="av-hero__actions">
              <a href={hero.primaryCta.href} className="av-btn av-btn--solid">
                {hero.primaryCta.label}
                <Icon name="arrow-right" strokeWidth={2} />
              </a>
              <a
                href={animatedView.cvHref}
                download="Aditya_Dutta_Resume.pdf"
                className="av-btn av-btn--outline"
              >
                {hero.secondaryCta.label}
                <Icon name="download" strokeWidth={2} />
              </a>
            </div>
          </Reveal>
        </div>

        <div className="av-hero__cue" aria-hidden>
          <span className="av-mono">{hero.scrollCue}</span>
          <span className="av-hero__cue-track">
            <span className="av-hero__cue-dot" />
          </span>
        </div>
      </div>
    </section>
  );
}
