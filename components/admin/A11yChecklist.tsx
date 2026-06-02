'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

const storageKey = 'fulatelier-admin-a11y-checklist';

const checklistGroups = [
  {
    category: 'Navigation',
    items: [
      'Skip navigation link is present before the header.',
      'Navigation links expose current-page state where needed.',
      'Landmarks use semantic header, nav, main, and footer elements.',
    ],
  },
  {
    category: 'Forms',
    items: [
      'Every input has a visible label with htmlFor and matching id.',
      'Errors use role="alert" and success states use role="status".',
      'Required fields are marked with native required attributes.',
    ],
  },
  {
    category: 'Media',
    items: [
      'Meaningful images include descriptive alt text.',
      'Video embeds include descriptive titles.',
      'External media links clearly describe their destination.',
    ],
  },
  {
    category: 'Color',
    items: [
      'Normal text contrast meets WCAG 2.1 AA.',
      'Large text and icon contrast meets minimum contrast thresholds.',
      'Information is never conveyed by color alone.',
    ],
  },
  {
    category: 'Keyboard',
    items: [
      'Every interactive element has a visible 2px focus outline with offset.',
      'Interactive controls are reachable and usable by keyboard.',
      'Focus order follows the visual layout.',
    ],
  },
];

const checklistItems = checklistGroups.flatMap((group) =>
  group.items.map((label) => ({
    id: `${group.category.toLowerCase()}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    label,
    category: group.category,
  })),
);

function isChecklistState(value: unknown): value is Record<string, boolean> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function A11yChecklist() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return;
    }

    try {
      const parsedValue: unknown = JSON.parse(storedValue);

      if (isChecklistState(parsedValue)) {
        setCheckedItems(parsedValue);
      }
    } catch {
      setCheckedItems({});
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(checkedItems));
  }, [checkedItems]);

  const completedCount = useMemo(
    () => checklistItems.filter((item) => checkedItems[item.id]).length,
    [checkedItems],
  );
  const totalCount = checklistItems.length;

  function toggleItem(itemId: string) {
    setCheckedItems((currentItems) => ({
      ...currentItems,
      [itemId]: !currentItems[itemId],
    }));
  }

  return (
    <section aria-labelledby="admin-a11y-title" className="rounded-[2rem] bg-warm p-6 text-navy shadow-card md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
            Section 508 / WCAG 2.1 AA
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold" id="admin-a11y-title">
            Launch accessibility checklist
          </h2>
        </div>
        <Button onClick={() => window.print()} type="button" variant="secondary">
          Export / print
        </Button>
      </div>
      <p className="mt-5 text-sm font-semibold text-ink/75" role="status">
        {completedCount} of {totalCount} items complete
      </p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white" aria-hidden="true">
        <div
          className="h-full rounded-full bg-gold"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {checklistGroups.map((group) => (
          <fieldset
            className="rounded-3xl border border-navy/10 bg-white p-5 shadow-card"
            key={group.category}
          >
            <legend className="font-display text-2xl font-bold text-navy">
              {group.category}
            </legend>
            <ul className="mt-4 space-y-3">
              {group.items.map((label) => {
                const item = checklistItems.find(
                  (checklistItem) =>
                    checklistItem.category === group.category && checklistItem.label === label,
                );

                if (!item) {
                  return null;
                }

                return (
                  <li key={item.id}>
                    <label className="flex items-start gap-3 rounded-2xl p-2 text-sm font-semibold leading-6 text-navy transition hover:bg-warm">
                      <input
                        checked={Boolean(checkedItems[item.id])}
                        className="mt-1 h-4 w-4 rounded border-navy/20 text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                        onChange={() => toggleItem(item.id)}
                        type="checkbox"
                      />
                      <span>{item.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
