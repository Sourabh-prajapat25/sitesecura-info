"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/config/careers";

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
  allowMultiple?: boolean;
}

export function FaqAccordion({
  items,
  className = "",
  allowMultiple = false,
}: FaqAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`space-y-3.5 divide-y divide-border/60 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        const buttonId = `faq-trigger-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div
            key={index}
            className={`rounded-xl border border-border/80 bg-background-card/50 transition-colors duration-200 ${
              isOpen ? "border-primary/40 bg-background-card" : "hover:border-border"
            }`}
          >
            <h3>
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                type="button"
                onClick={() => toggleIndex(index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left text-base font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-foreground-muted transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={`overflow-hidden px-5 pb-5 pt-1 text-sm sm:text-base text-foreground-muted leading-relaxed ${
                isOpen ? "block animate-fadeIn" : "hidden"
              }`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
