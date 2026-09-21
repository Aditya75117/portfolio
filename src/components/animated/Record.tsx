import { animatedView } from "@/data/animatedView";
import { Icon } from "@/components/icons/Icon";
import { RecordPanel } from "./RecordPanel";
import { Reveal } from "./Reveal";

const { record } = animatedView;

export function Record() {
  return (
    <section id="record" className="av-section av-record">
      <div className="av-shell">
        <div className="av-masthead">
          <div>
            <p className="av-masthead__label">
              <span className="av-masthead__index">{record.index}</span>
              {record.eyebrow}
            </p>
            <Reveal as="h2" className="av-masthead__title">
              {record.title}
            </Reveal>
          </div>
          <Reveal className="av-masthead__aside" delay={0.1}>
            <p>{record.aside}</p>
          </Reveal>
        </div>

        <div className="av-record__list">
          {record.entries.map((entry, index) => (
            <RecordPanel key={entry.id} entry={entry} index={index} />
          ))}
        </div>

        <Reveal className="av-record__outro">
          <a
            href={record.cta.href}
            className="av-btn av-btn--outline"
            target="_blank"
            rel="noreferrer noopener"
          >
            {record.cta.label}
            <Icon name="arrow-right" strokeWidth={2} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
