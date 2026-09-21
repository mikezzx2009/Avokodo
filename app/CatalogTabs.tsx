"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export function CatalogTabs({ product, factory }: { product: ReactNode; factory: ReactNode }) {
  const [selected, setSelected] = useState(0);
  const prefix = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = [{ title: "Product", content: product }, { title: "Factory", content: factory }];

  return (
    <div className="catalog-tabs" id="product">
      <div className="catalog-tab-list" role="tablist" aria-label="Collection content">
        {tabs.map((tab, index) => (
          <button key={tab.title} ref={(element) => { buttons.current[index] = element; }}
            type="button" role="tab" id={`${prefix}-tab-${index}`}
            aria-controls={`${prefix}-panel-${index}`} aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
              else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = tabs.length - 1;
              else return;
              event.preventDefault();
              setSelected(next);
              buttons.current[next]?.focus();
            }}>
            {tab.title}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div key={tab.title} className="catalog-tab-panel" role="tabpanel"
          id={`${prefix}-panel-${index}`} aria-labelledby={`${prefix}-tab-${index}`}
          hidden={selected !== index} tabIndex={0}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
