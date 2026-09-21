import { animatedView } from "@/data/animatedView";
import { MethodTimeline } from "./MethodTimeline";
import { SplitLines } from "./SplitLines";

const { method } = animatedView;

export function Method() {
  return (
    <section id="method" className="av-section av-method">
      <div className="av-shell av-method__inner">
        <div className="av-method__intro">
          <p className="av-masthead__label">
            <span className="av-masthead__index">{method.index}</span>
            {method.eyebrow}
          </p>
          <SplitLines
            as="h2"
            lines={method.title}
            accentWord={method.accentWord}
            className="av-method__title"
          />
        </div>

        <MethodTimeline>
          {method.steps.map((step) => (
            <li className="av-method__step" key={step.step} data-step>
              <span className="av-method__node" aria-hidden />
              <span className="av-method__step-index">{step.step}</span>
              <div className="av-method__step-body">
                <h3 className="av-method__step-title">{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </MethodTimeline>
      </div>
    </section>
  );
}
