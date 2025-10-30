"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

function Badge({ children, color = "gray" }) {
  const colors = {
    gray: "bg-gray-100 text-gray-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    indigo: "bg-indigo-100 text-indigo-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${colors[color]}`}>{children}</span>
  );
}

function Filters({ value, onChange, agentTypes }) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  const update = (key, v) => setLocal((s) => ({ ...s, [key]: v }));

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Paused", value: "paused" },
  ];

  return (
    <div className="bg-white rounded-xl border p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Agent Type</label>
          <select
            className="border rounded-lg px-3 py-2 w-full text-sm"
            value={local.agent_type || ""}
            onChange={(e) => update("agent_type", e.target.value || undefined)}
          >
            <option value="">All</option>
            {(agentTypes || []).map((a) => {
              const labelMap = {
                mental_therapist: 'therapy',
              };
              const label = labelMap[a.agent_type] || a.agent_type;
              return (
                <option key={a.agent_type} value={a.agent_type}>{label}</option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Status</label>
          <select
            className="border rounded-lg px-3 py-2 w-full text-sm"
            value={local.status || ""}
            onChange={(e) => update("status", e.target.value || undefined)}
          >
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs text-gray-500 mb-1">User</label>
          <input
            className="border rounded-lg px-3 py-2 w-full text-sm"
            placeholder="email, name, or user_id"
            value={local.user || ""}
            onChange={(e) => update("user", e.target.value || undefined)}
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-1 flex gap-2">
          <button onClick={() => onChange(local)} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Apply</button>
          <button onClick={() => onChange({})} className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Reset</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminConversationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, per_page: 20, total: 0 });
  const [agentTypes, setAgentTypes] = useState([]);

  const filters = useMemo(() => {
    const obj = Object.fromEntries(searchParams.entries());
    return {
      page: Number(obj.page || 1),
      per_page: Number(obj.per_page || 20),
      agent_type: obj.agent_type,
      status: obj.status,
      user: obj.user,
    };
  }, [searchParams]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
      ).toString();
      const res = await apiRequest(`/admin/conversations?${qs}`);
      setRows(res.data || []);
      setMeta({ page: res.page, per_page: res.per_page, total: res.total });
    } catch (e) {
      setError(e?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [searchParams]);

  useEffect(() => {
    // Load agent types once for filter dropdown
    (async () => {
      try {
        const res = await apiRequest(`/admin/conversations/agent-types`);
        // Only keep the 5 agents we currently support in backend
        const allowed = new Set([
          "accountability",
          "anxiety",
          "emotional",
          "loneliness",
          // Some environments store therapy as "mental_therapist"
          "therapy",
          "mental_therapist",
        ]);

        let list = Array.isArray(res) ? res.filter(a => allowed.has(a.agent_type)) : [];

        // If API returns empty or different values in dev, provide a strict fallback of the 5
        if (!list.length) {
          list = [
            { agent_type: "loneliness" },
            { agent_type: "accountability" },
            { agent_type: "anxiety" },
            { agent_type: "emotional" },
            { agent_type: "therapy" },
          ];
        }

        // De-duplicate therapy vs mental_therapist by preferring the API-provided key
        const seen = new Set();
        const deduped = [];
        for (const item of list) {
          const key = item.agent_type === 'mental_therapist' ? 'therapy' : item.agent_type;
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push(item);
          }
        }

        setAgentTypes(deduped);
      } catch {
        setAgentTypes([
          { agent_type: "loneliness" },
          { agent_type: "accountability" },
          { agent_type: "anxiety" },
          { agent_type: "emotional" },
          { agent_type: "therapy" },
        ]);
      }
    })();
  }, []);

  const onFiltersChange = (obj) => {
    const nextParams = { ...obj, page: 1, per_page: filters.per_page };
    const qs = new URLSearchParams(
      Object.entries(nextParams).filter(([, v]) => v !== undefined && v !== "")
    ).toString();
    router.push(`/dashboard/admin/conversations?${qs}`);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Conversations</h1>
            <p className="text-xs sm:text-sm text-gray-500">Monitor and manage all conversations across users.</p>
          </div>
        </div>

        <Filters value={filters} onChange={onFiltersChange} agentTypes={agentTypes} />

        {/* Summary strip */}
        {!loading && !error && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border rounded-xl p-3 sm:p-4">
              <div className="text-xs text-gray-500">Conversations</div>
              <div className="text-lg sm:text-xl font-semibold">{meta.total}</div>
            </div>
            <div className="bg-white border rounded-xl p-3 sm:p-4">
              <div className="text-xs text-gray-500">Messages (page)</div>
              <div className="text-lg sm:text-xl font-semibold">{rows.reduce((s, r) => s + (r.message_count || 0), 0)}</div>
            </div>
            <div className="bg-white border rounded-xl p-3 sm:p-4">
              <div className="text-xs text-gray-500">Active (page)</div>
              <div className="text-lg sm:text-xl font-semibold">{rows.filter(r => r.status === 'active').length}</div>
            </div>
            <div className="bg-white border rounded-xl p-3 sm:p-4">
              <div className="text-xs text-gray-500">Paused (page)</div>
              <div className="text-lg sm:text-xl font-semibold">{rows.filter(r => r.status === 'paused').length}</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border">
          {loading ? (
            <div className="py-10 text-center text-gray-500 text-sm">Loading...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-600 text-sm">{error}</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto p-4">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-4">User</th>
                      <th className="py-2 pr-4">Agent Type</th>
                      <th className="py-2 pr-4">Started</th>
                      <th className="py-2 pr-4">Last Activity</th>
                      <th className="py-2 pr-4">Duration</th>
                      <th className="py-2 pr-4">Messages</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Last Message</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.conversation_id} className="border-b last:border-0">
                        <td className="py-3 pr-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{r.user?.name || "—"}</span>
                            <span className="text-gray-500">{r.user?.email || "—"}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">{r.agent_type || "—"}</td>
                        <td className="py-3 pr-4">{r.started_at ? new Date(r.started_at).toLocaleString() : "—"}</td>
                        <td className="py-3 pr-4">{r.updated_at ? new Date(r.updated_at).toLocaleString() : "—"}</td>
                        <td className="py-3 pr-4">{typeof r.duration_seconds === "number" ? `${Math.floor(r.duration_seconds/60)}m ${r.duration_seconds%60}s` : "—"}</td>
                        <td className="py-3 pr-4">{r.message_count ?? 0}</td>
                        <td className="py-3 pr-4">
                          {r.status === "active" ? <Badge color="green">Active</Badge> : <Badge color="gray">Paused</Badge>}
                        </td>
                        <td className="py-3 pr-4 max-w-xs truncate" title={r.last_message_preview}>{r.last_message_preview || "—"}</td>
                        <td className="py-3 pr-4">
                          <Link href={`/dashboard/admin/conversations/${r.conversation_id}`} className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 inline-block">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y">
                {rows.map((r) => (
                  <div key={r.conversation_id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{r.user?.name || "—"}</div>
                        <div className="text-xs text-gray-500 truncate">{r.user?.email || "—"}</div>
                      </div>
                      <div>
                        {r.status === "active" ? <Badge color="green">Active</Badge> : <Badge color="gray">Paused</Badge>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Agent:</span>
                        <span className="ml-1 text-gray-900">{r.agent_type || "—"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Messages:</span>
                        <span className="ml-1 text-gray-900">{r.message_count ?? 0}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Last Activity:</span>
                        <span className="ml-1 text-gray-900">{r.updated_at ? new Date(r.updated_at).toLocaleString() : "—"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-1 text-gray-900">{typeof r.duration_seconds === "number" ? `${Math.floor(r.duration_seconds/60)}m ${r.duration_seconds%60}s` : "—"}</span>
                      </div>
                    </div>

                    {r.last_message_preview && (
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {r.last_message_preview}
                      </div>
                    )}

                    <Link 
                      href={`/dashboard/admin/conversations/${r.conversation_id}`} 
                      className="block w-full text-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t">
                <div className="text-xs sm:text-sm text-gray-500">
                  Page {meta.page} • Total {meta.total}
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg bg-gray-100 disabled:opacity-50 text-sm font-medium"
                    disabled={meta.page <= 1}
                    onClick={() => {
                      const prevParams = { ...filters, page: (filters.page || 1) - 1 };
                      const qs = new URLSearchParams(
                        Object.entries(prevParams).filter(([, v]) => v !== undefined && v !== "")
                      ).toString();
                      router.push(`/dashboard/admin/conversations?${qs}`);
                    }}
                  >Prev</button>
                  <button
                    className="px-3 py-1.5 rounded-lg bg-gray-100 disabled:opacity-50 text-sm font-medium"
                    disabled={rows.length < (filters.per_page || 20)}
                    onClick={() => {
                      const nextParams = { ...filters, page: (filters.page || 1) + 1 };
                      const qs = new URLSearchParams(
                        Object.entries(nextParams).filter(([, v]) => v !== undefined && v !== "")
                      ).toString();
                      router.push(`/dashboard/admin/conversations?${qs}`);
                    }}
                  >Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
