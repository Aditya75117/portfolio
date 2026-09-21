import { MARK_HEIGHT, MARK_WIDTH, MonogramGlyph } from "@/components/icons/Monogram";
import { animatedView } from "@/data/animatedView";
import { EmailCta } from "./EmailCta";
import { Reveal } from "./Reveal";
import { SplitLines } from "./SplitLines";

const MARK_W = 186;
const MARK_H = MARK_W * (MARK_HEIGHT / MARK_WIDTH);

const { contact, email, location, timeZone, linkedin } = animatedView;

export function Contact() {
  return (
    <section id="contact" className="av-section av-contact">
      {/* Callback to the hero plate, reduced to its two outermost rings. */}
      <div className="av-contact__echo" aria-hidden>
        <svg viewBox="0 0 420 420" focusable="false">
          <circle cx="210" cy="210" r="204" />
          <circle cx="210" cy="210" r="150" />
          <MonogramGlyph
            x={210 - MARK_W / 2}
            y={210 - MARK_H / 2}
            width={MARK_W}
            height={MARK_H}
          />
        </svg>
      </div>

      <div className="av-shell av-contact__inner">
        <p className="av-masthead__label">
          <span className="av-masthead__index">{contact.index}</span>
          {contact.eyebrow}
        </p>

        <SplitLines
          as="h2"
          lines={contact.title}
          accentLine={contact.accentLine}
          className="av-contact__title"
        />

        <Reveal className="av-contact__body" delay={0.12}>
          <p>{contact.body}</p>
        </Reveal>

        <Reveal delay={0.18}>
          <EmailCta
            email={email}
            label={contact.cta}
            copyLabel={contact.copyLabel}
            copiedLabel={contact.copiedLabel}
          />
        </Reveal>

        <Reveal className="av-contact__details" delay={0.24}>
          <dl className="av-contact__facts">
            <div>
              <dt>Located</dt>
              <dd>{location}</dd>
            </div>
            <div>
              <dt>Timezone</dt>
              <dd>{timeZone}</dd>
            </div>
            <div>
              <dt>Elsewhere</dt>
              <dd>
                <a href={linkedin} target="_blank" rel="noreferrer noopener">
                  LinkedIn
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
