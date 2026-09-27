"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SyllabusUnit } from "@/types";

export default function Accordion({ units }: { units: SyllabusUnit[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line rounded-lg border border-line bg-panel">
      {units.map((unit, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={unit.title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-ink">{unit.title}</span>
              <ChevronDown
                size={18}
                className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div className="accordion-content" data-open={isOpen}>
              <ul className="space-y-1.5 px-5 pb-5 text-sm text-ink/80">
                {unit.topics.map((topic) => (
                  <li key={topic} className="flex gap-2">
                    <span className="text-amber-dark">–</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
