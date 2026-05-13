import { useMemo, useState } from "react";
import {
  autocompleteSuggestions,
  taskTemplates,
  type Suggestion
} from "../data/scenario";

interface TaskComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

function filterSuggestions(value: string): Suggestion[] {
  const query = value.trim().split(/\s+/).pop()?.toLowerCase() ?? "";
  if (!query) return autocompleteSuggestions.slice(0, 7);

  return autocompleteSuggestions
    .filter((suggestion) => {
      const haystack = `${suggestion.label} ${suggestion.value} ${suggestion.kind}`.toLowerCase();
      return haystack.includes(query);
    })
    .slice(0, 7);
}

function applySuggestion(value: string, suggestion: Suggestion): string {
  if (suggestion.kind === "template") return suggestion.value;
  const trimmedRight = value.replace(/\s+$/, "");
  const parts = trimmedRight.split(/\s+/);
  parts[parts.length - 1] = suggestion.value;
  return `${parts.join(" ")} `;
}

export function TaskComposer({ value, onChange, onSubmit }: TaskComposerProps) {
  const [highlighted, setHighlighted] = useState(0);
  const suggestions = useMemo(() => filterSuggestions(value), [value]);

  const commitSuggestion = (suggestion: Suggestion) => {
    onChange(applySuggestion(value, suggestion));
    setHighlighted(0);
  };

  return (
    <div className="composer-panel">
      <div className="template-row" aria-label="Task templates">
        {taskTemplates.map((template) => (
          <button
            className="chip"
            type="button"
            key={template.id}
            onClick={() => onChange(template.task)}
            title={template.risk}
          >
            {template.label}
          </button>
        ))}
      </div>
      <div className="composer-grid">
        <textarea
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setHighlighted(0);
          }}
          onKeyDown={(event) => {
            if (!suggestions.length) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setHighlighted((current) => (current + 1) % suggestions.length);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setHighlighted((current) => (current - 1 + suggestions.length) % suggestions.length);
            }
            if (event.key === "Tab" || (event.key === "Enter" && !event.shiftKey)) {
              event.preventDefault();
              commitSuggestion(suggestions[highlighted]);
            }
          }}
          aria-label="Task prompt"
        />
        <button className="btn primary" type="button" onClick={onSubmit} disabled={!value.trim()}>
          Send Task
        </button>
      </div>
      <div className="suggestions" aria-label="Autocomplete suggestions">
        {suggestions.map((suggestion, index) => (
          <button
            className={index === highlighted ? "active" : ""}
            type="button"
            key={`${suggestion.kind}-${suggestion.label}`}
            onMouseEnter={() => setHighlighted(index)}
            onClick={() => commitSuggestion(suggestion)}
          >
            <span>{suggestion.label}</span>
            <small>{suggestion.kind}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
