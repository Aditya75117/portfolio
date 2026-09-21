"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";

export function EmailCta({
  email,
  label,
  copyLabel,
  copiedLabel,
}: {
  email: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard access can be denied; the mailto link above is still the
      // primary path, so failing quietly is the right behaviour here.
      setCopied(false);
    }
  }

  return (
    <div className="av-email">
      <a href={`mailto:${email}`} className="av-email__link">
        <span className="av-email__label">{label}</span>
        <span className="av-email__address">
          <span className="av-email__text">{email}</span>
          <span className="av-email__text av-email__text--ghost" aria-hidden>
            {email}
          </span>
        </span>
        <span className="av-email__arrow" aria-hidden>
          <Icon name="arrow-right" strokeWidth={1.6} />
        </span>
      </a>

      <button type="button" className="av-email__copy" onClick={copy}>
        <Icon name="copy" strokeWidth={1.8} />
        {copied ? copiedLabel : copyLabel}
      </button>

      <span className="av-email__status" role="status" aria-live="polite">
        {copied ? `${email} copied to clipboard` : ""}
      </span>
    </div>
  );
}
