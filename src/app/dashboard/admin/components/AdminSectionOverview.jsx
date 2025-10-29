'use client';

import Link from 'next/link';

const sections = [
  {
    key: 'conversations',
    title: 'Conversations',
    description:
      'Review and analyze recent conversations, track engagement, and drill into individual threads for insights.',
    href: '/dashboard/admin/conversations',
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h6.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    highlights: ['Recent activity', 'Conversation details', 'Search & filter'],
  },
  {
    key: 'users',
    title: 'Users',
    description:
      'Manage users and roles, view profile health, and monitor active vs. inactive accounts at a glance.',
    href: '/dashboard/admin/users',
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0" />
      </svg>
    ),
    highlights: ['Role management', 'Active/inactive status', 'Profile overview'],
  },
  {
    key: 'billing',
    title: 'Billing',
    description:
      'Track revenue and subscriptions, check invoice status, and monitor MRR and churn indicators.',
    href: '/dashboard/admin/billing',
    icon: (
      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-3.866 0-7 1.79-7 4v4a2 2 0 002 2h10a2 2 0 002-2v-4c0-2.21-3.134-4-7-4zm0 0V6m0 0a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    ),
    highlights: ['Subscriptions & invoices', 'MRR & ARPU', 'Failed payments'],
  },
];

export default function AdminSectionOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((s) => (
        <div
          key={s.key}
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0">{s.icon}</div>
            <h2 className="text-lg font-semibold text-gray-900">{s.title}</h2>
          </div>
          <p className="text-sm text-gray-600 mt-3 flex-1">{s.description}</p>

          {s.highlights?.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-gray-700 list-disc list-inside">
              {s.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <Link
              href={s.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Go to {s.title}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l6 6m0 0l-6 6m6-6H4.5" />
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
