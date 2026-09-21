import { Monogram } from "@/components/icons/Monogram";
import { animatedView } from "@/data/animatedView";

const { footer, name, linkedin, journeyHref } = animatedView;
const year = new Date().getFullYear();

export function AnimatedFooter() {
  return (
    <footer className="av-footer">
      <div className="av-shell av-footer__inner">
        <span className="av-footer__logo">
          <Monogram title={name} />
        </span>

        <p className="av-footer__note">{footer.note}</p>

        <nav className="av-footer__links" aria-label="Footer">
          <a href={linkedin} target="_blank" rel="noreferrer noopener">
            LinkedIn
          </a>
          <a href={journeyHref} target="_blank" rel="noreferrer noopener">
            Journey
          </a>
          <a href="#top">Back to top</a>
        </nav>

        <p className="av-footer__meta">
          <span>
            © {year} {name}
          </span>
          <span className="av-footer__colophon">{footer.colophon}</span>
        </p>
      </div>
    </footer>
  );
}
