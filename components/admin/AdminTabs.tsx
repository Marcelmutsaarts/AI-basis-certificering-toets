/**
 * Tabs voor het admin dashboard. Server component, zonder client state:
 * we vergelijken de current path tegen de drie targets en stylen de
 * actieve link. Gebruik in elke admin-pagina aan de top.
 */
import Link from 'next/link';

export type AdminTabKey = 'examens' | 'testruns' | 'webhooks';

const TABS: Array<{ key: AdminTabKey; href: string; label: string }> = [
  { key: 'examens', href: '/admin', label: 'Examens' },
  { key: 'testruns', href: '/admin/testruns', label: 'Testruns' },
  { key: 'webhooks', href: '/admin/webhooks', label: 'Webhooks' },
];

export function AdminTabs({ active }: { active: AdminTabKey }) {
  return (
    <nav
      aria-label="Admin secties"
      className="border-b border-purple-light-bg bg-white"
    >
      <ul className="max-w-6xl mx-auto px-6 flex gap-1">
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          const linkClass = isActive
            ? 'inline-block px-4 py-3 text-sm font-semibold text-purple-dark border-b-2 border-purple-primary'
            : 'inline-block px-4 py-3 text-sm font-medium text-text-body/80 hover:text-purple-dark border-b-2 border-transparent';
          return (
            <li key={tab.key}>
              <Link href={tab.href} className={linkClass}>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
