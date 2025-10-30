"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-xl border p-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </section>
  );
}

export default function AdminUserDetailsPage() {
  const params = useParams();
  const userId = params.userId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [invoices, setInvoices] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await apiRequest(`/admin/users/${userId}`);
        setData(d);
        // lazy load invoices if customer id is present
        if (d?.plan?.stripe_customer_id) {
          apiRequest(`/admin/users/${userId}/invoices`).then(setInvoices).catch(() => {});
        }
      } catch (e) {
        setError(e?.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User Details</h1>
          <p className="text-sm text-gray-500">User account overview and activity.</p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Personal Info">
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-gray-500">Name</dt><dd>{data?.user?.name || "—"}</dd>
                <dt className="text-gray-500">Email</dt><dd>{data?.user?.email}</dd>
                <dt className="text-gray-500">Created</dt><dd>{data?.user?.created_at ? new Date(data.user.created_at).toLocaleString() : "—"}</dd>
                <dt className="text-gray-500">Last Login</dt><dd>{data?.user?.last_login ? new Date(data.user.last_login).toLocaleString() : "—"}</dd>
                <dt className="text-gray-500">Status</dt><dd>{data?.user?.is_active ? "Active" : "Suspended"}</dd>
                <dt className="text-gray-500">Individual ID</dt><dd className="font-mono text-xs">{data?.user?.role_entity_id}</dd>
              </dl>
            </Section>

            <Section title="Subscription">
              {data?.plan ? (
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-gray-500">Plan Type</dt><dd>{data.plan.plan_type || "—"}</dd>
                  <dt className="text-gray-500">Status</dt><dd>{data.plan.status || "—"}</dd>
                  <dt className="text-gray-500">Current Period End</dt><dd>{data.plan.current_period_end ? new Date(data.plan.current_period_end * 1000).toLocaleString() : "—"}</dd>
                  <dt className="text-gray-500">Cancel at Period End</dt><dd>{String(data.plan.cancel_at_period_end ?? false)}</dd>
                  <dt className="text-gray-500">Customer ID</dt><dd className="font-mono text-xs">{data.plan.stripe_customer_id || "—"}</dd>
                  <dt className="text-gray-500">Subscription ID</dt><dd className="font-mono text-xs">{data.plan.stripe_subscription_id || "—"}</dd>
                </dl>
              ) : (
                <div className="text-gray-500 text-sm">No subscription on file.</div>
              )}
            </Section>

            <Section title="Profiles">
              {data?.profiles?.length ? (
                <ul className="divide-y">
                  {data.profiles.map((p) => (
                    <li key={p.user_profile_id} className="py-2 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{p.profile_name || "Untitled"}</div>
                        <div className="text-xs text-gray-500">{p.user_profile_id}</div>
                      </div>
                      <div className="text-sm text-gray-600">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm">No profiles created.</div>
              )}
            </Section>

            <Section title="Conversation Analytics">
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-gray-500">Total Conversations</dt><dd>{data?.conversation_analytics?.total_conversations ?? 0}</dd>
                <dt className="text-gray-500">Active Conversations</dt><dd>{data?.conversation_analytics?.active_conversations ?? 0}</dd>
                <dt className="text-gray-500">Average Messages</dt><dd>{data?.conversation_analytics?.average_messages_per_conversation ?? 0}</dd>
                <dt className="text-gray-500">Total Messages</dt><dd>{data?.conversation_analytics?.total_messages ?? 0}</dd>
                <dt className="text-gray-500">Recent (7d)</dt><dd>{data?.conversation_analytics?.recent_activity_7d ?? 0}</dd>
              </dl>
            </Section>

            <Section title="Payment History (latest)">
              {invoices?.data?.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-4">Invoice</th>
                        <th className="py-2 pr-4">Amount</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.data.map((inv) => (
                        <tr key={inv.id} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs">{inv.id}</td>
                          <td className="py-2 pr-4">{(inv.amount_paid || inv.amount_due || 0) / 100} {inv.currency?.toUpperCase()}</td>
                          <td className="py-2 pr-4">{inv.status}</td>
                          <td className="py-2 pr-4">{inv.created ? new Date(inv.created * 1000).toLocaleString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No invoices found.</div>
              )}
            </Section>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
