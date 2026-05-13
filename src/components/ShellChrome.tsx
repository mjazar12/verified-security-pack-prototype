import type { ReactNode } from "react";

interface ShellChromeProps {
  title: string;
  status?: string;
  children: ReactNode;
}

export function ShellChrome({ title, status, children }: ShellChromeProps) {
  return (
    <section className="shell" aria-label={title}>
      <div className="chrome">
        <div className="traffic" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="chrome-title">{title}</div>
        {status ? <div className="chrome-status">{status}</div> : null}
      </div>
      {children}
    </section>
  );
}
