import { animatedView } from "@/data/animatedView";
import { Counter } from "./Counter";
import { PremiseDiagram } from "./PremiseDiagram";
import { Reveal } from "./Reveal";
import { SplitLines } from "./SplitLines";

const { manifesto } = animatedView;

export function Premise() {
  return (
    <section id="premise" className="av-section av-premise">
      <div className="av-shell">
        <p className="av-masthead__label">
          <span className="av-masthead__index">{manifesto.index}</span>
          {manifesto.eyebrow}
        </p>

        <div className="av-premise__grid">
          <div className="av-premise__lede">
            <SplitLines
              as="h2"
              lines={manifesto.title}
              accentWord={manifesto.accentWord}
              className="av-premise__title"
            />
            <PremiseDiagram />
          </div>

          <Reveal className="av-premise__body" delay={0.15}>
            {manifesto.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}

            <dl className="av-premise__footnotes">
              {manifesto.footnotes.map((note) => (
                <div key={note.label}>
                  <dt>{note.label}</dt>
                  <dd>{note.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <ul className="av-metrics">
          {manifesto.metrics.map((metric, index) => (
            <Reveal
              as="li"
              key={metric.label}
              className="av-metric"
              delay={index * 0.08}
            >
              <span className="av-metric__value">
                <Counter value={metric.value} suffix={metric.suffix} />
              </span>
              <span className="av-metric__label">{metric.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
