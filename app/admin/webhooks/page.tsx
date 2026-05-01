/**
 * Admin webhooks-tab. Toont alle webhook_deliveries (max 200), met
 * filter op status. Per row: link naar de sessie, WebhookStatus en een
 * RetryButton (alleen voor pending/failed).
 */
import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { WebhookStatus } from '@/components/admin/WebhookStatus';
import { WebhookFilters } from '@/components/admin/WebhookFilters';
import { RetryButton } from '@/components/admin/RetryButton';
import type { Database } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

type DeliveryStatus = Database['public']['Enums']['delivery_status'];

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function pickString(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
}

function asStatus(s: string): DeliveryStatus | '' {
  const all: DeliveryStatus[] = ['sent', 'pending', 'failed', 'skipped'];
  return all.includes(s as DeliveryStatus) ? (s as DeliveryStatus) : '';
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default async function AdminWebhooksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const status = asStatus(pickString(sp.status));

  const writer = createServiceRoleClient();
  let q = writer
    .from('webhook_deliveries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (status) q = q.eq('status', status);
  const { data: rows } = await q;

  return (
    <>
      <AdminTabs active="webhooks" />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-2xl font-semibold text-purple-dark mb-4">
            Webhooks
          </h1>
          <WebhookFilters />
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-purple-light-bg/40">
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Aangemaakt
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Sessie
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Status
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Verzonden
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-purple-dark">
                    Actie
                  </th>
                </tr>
              </thead>
              <tbody>
                {(rows ?? []).length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-sm text-text-body/70"
                    >
                      Geen deliveries gevonden.
                    </td>
                  </tr>
                ) : (
                  (rows ?? []).map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-purple-light-bg/60 align-top"
                    >
                      <td className="px-3 py-3 text-sm text-text-body whitespace-nowrap">
                        {formatDate(row.created_at)}
                      </td>
                      <td className="px-3 py-3 text-sm">
                        <Link
                          href={`/admin/sessions/${row.exam_session_id}`}
                          className="text-purple-dark underline font-mono text-xs break-all"
                        >
                          {row.exam_session_id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-3 py-3">
                        <WebhookStatus
                          status={row.status}
                          attempts={row.attempts}
                          lastError={row.last_error}
                          skippedReason={row.skipped_reason}
                        />
                      </td>
                      <td className="px-3 py-3 text-xs text-text-body/80">
                        {row.sent_at ? formatDate(row.sent_at) : '-'}
                      </td>
                      <td className="px-3 py-3">
                        {row.status === 'pending' || row.status === 'failed' ? (
                          <RetryButton deliveryId={row.id} />
                        ) : (
                          <span className="text-[11px] text-text-body/40">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
