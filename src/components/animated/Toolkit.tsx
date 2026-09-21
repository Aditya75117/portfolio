import { animatedView } from "@/data/animatedView";
import { TechIcon } from "@/components/icons/TechIcon";
import { Reveal } from "./Reveal";
import { SkillsRibbon } from "./SkillsRibbon";

const { toolkit } = animatedView;
const ribbonItems = toolkit.items.map((item) => item.label);

export function Toolkit() {
  return (
    <section id="toolkit" className="av-section av-toolkit">
      <div className="av-shell">
        <div className="av-masthead">
          <div>
            <p className="av-masthead__label">
              <span className="av-masthead__index">{toolkit.index}</span>
              {toolkit.eyebrow}
            </p>
            <Reveal as="h2" className="av-masthead__title">
              {toolkit.title}
            </Reveal>
          </div>
          <Reveal className="av-masthead__aside" delay={0.1}>
            <p>{toolkit.note}</p>
          </Reveal>
        </div>
      </div>

      <SkillsRibbon items={ribbonItems} />

      <div className="av-shell">
        <ul className="av-toolkit__grid">
          {toolkit.items.map((item, index) => (
            <Reveal
              as="li"
              key={item.label}
              className="av-toolkit__tile"
              delay={(index % 4) * 0.06}
            >
              <TechIcon name={item.icon} className="av-toolkit__icon" />
              <span className="av-toolkit__label">{item.label}</span>
              <span className="av-toolkit__note">{item.note}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
