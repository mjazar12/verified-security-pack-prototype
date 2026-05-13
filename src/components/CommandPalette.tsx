import { useMemo, useState } from "react";

export interface PaletteCommand {
  id: string;
  label: string;
  hint: string;
  enabled: boolean;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  commands: PaletteCommand[];
  onClose: () => void;
}

export function CommandPalette({ open, commands, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.hint}`.toLowerCase().includes(normalized)
    );
  }, [commands, query]);

  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="command-palette" onMouseDown={(event) => event.stopPropagation()}>
        <div className="palette-head">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search commands"
            aria-label="Search commands"
          />
          <button className="btn ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="palette-list">
          {filtered.map((command) => (
            <button
              type="button"
              key={command.id}
              disabled={!command.enabled}
              onClick={() => {
                command.run();
                onClose();
              }}
            >
              <span>{command.label}</span>
              <small>{command.hint}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
