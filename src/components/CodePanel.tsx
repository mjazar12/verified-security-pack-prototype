interface CodePanelProps {
  title: string;
  status?: string;
  lines: string[];
  warningLines?: number[];
}

export function CodePanel({ title, status, lines, warningLines = [] }: CodePanelProps) {
  return (
    <div className="code-panel">
      <div className="code-head">
        <span>{title}</span>
        {status ? <span>{status}</span> : null}
      </div>
      <div className="code-body">
        {lines.map((line, index) => {
          const marker = line[0] === "+" || line[0] === "-" ? line[0] : "";
          const content = marker ? line.slice(2) : line;
          const tone =
            marker === "+"
              ? "add"
              : marker === "-"
                ? "del"
                : warningLines.includes(index + 1)
                  ? "warnline"
                  : "";
          return (
            <div className={`code-line ${tone}`} key={`${line}-${index}`}>
              <span className="line-number">{index + 1}</span>
              <span className="line-marker">{marker}</span>
              <code>{content}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
