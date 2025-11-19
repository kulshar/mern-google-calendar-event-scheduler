import { useEffect, useState } from "react";
import type { FiltersState, EventStatus } from "../types";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
  value: FiltersState;
  onChange: (f: Partial<FiltersState>) => void;
  availableColors: string[];
}

export function FilterSidebar({ value, onChange, availableColors }: Props) {
  const [text, setText] = useState(value.text ?? "");
  const debounced = useDebounce(text, 300);

  // propagate debounced text
  useEffect(() => {
    if (debounced !== value.text) {
      onChange({ text: debounced });
    }
  }, [debounced, value.text]);

  const toggleColor = (c: string) => {
    const set = new Set(value.colors);
    if (set.has(c)) set.delete(c);
    else set.add(c);
    onChange({ colors: Array.from(set) });
  };

  const statusOptions: EventStatus[] = ["confirmed", "tentative", "cancelled"];

  return (
    <aside className="w-full md:w-64 shrink-0 border-r bg-white">
      <div className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium">Search</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Title or description"
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Status</div>
          <div className="flex gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() =>
                  onChange({ status: value.status === s ? undefined : s })
                }
                className={`px-3 py-1 rounded border ${
                  value.status === s ? "bg-gray-900 text-white" : "bg-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Color Tags</div>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((c) => {
              const selected = value.colors.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleColor(c)}
                  className={`h-8 px-3 rounded border flex items-center gap-2 ${
                    selected ? "ring-2 ring-offset-1" : ""
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                  <span className="text-xs">{c}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Date Range</div>
          <div className="grid grid-cols-1 gap-2">
            <input
              type="date"
              value={value.dateStart ?? ""}
              onChange={(e) =>
                onChange({ dateStart: e.target.value || undefined })
              }
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              value={value.dateEnd ?? ""}
              onChange={(e) =>
                onChange({ dateEnd: e.target.value || undefined })
              }
              className="border rounded px-3 py-2"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Overrides the visible calendar range when set.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() =>
              onChange({
                status: undefined,
                colors: [],
                text: "",
                dateStart: undefined,
                dateEnd: undefined,
              })
            }
            className="px-3 py-2 border rounded w-full"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
