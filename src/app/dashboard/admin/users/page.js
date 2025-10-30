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

function Filters({ value, onChange }) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  const update = (key, v) => setLocal((s) => ({ ...s, [key]: v }));

  return (
    <div className="bg-white rounded-xl border p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs text-gray-500 mb-1">Search</label>
          <input
            className="border rounded-lg px-3 py-2 w-full text-sm"
            placeholder="email or name"
            value={local.q || ""}
            onChange={(e) => update("q", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Status</label>
          <select
            className="border rounded-lg px-3 py-2 w-full text-sm"
            value={local.status_filter || ""}
            onChange={(e) => update("status_filter", e.target.value || undefined)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Plan</label>
          <select
            className="border rounded-lg px-3 py-2 w-full text-sm"
            value={local.plan || ""}
            onChange={(e) => update("plan", e.target.value || undefined)}
          >
            <option value="">All</option>
            <option value="one_month">1 Month</option>
            <option value="three_months">3 Months</option>
            <option value="six_months">6 Months</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Subscription</label>
          <select
            className="border rounded-lg px-3 py-2 w-full text-sm"
            value={local.subscription_status || ""}
            onChange={(e) => update("subscription_status", e.target.value || undefined)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
            <option value="past_due">Past due</option>
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-1 flex gap-2">
          <button
            onClick={() => onChange(local)}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Apply
          </button>
          <button
            onClick={() => onChange({})}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, per_page: 20, total: 0 });

  const filters = useMemo(() => {
    const obj = Object.fromEntries(searchParams.entries());
    // Only send status_filter if valid
    let status_filter = obj.status_filter;
    if (status_filter !== "active" && status_filter !== "inactive") {
      status_filter = undefined;
    }
    return {
      page: Number(obj.page || 1),
      per_page: Number(obj.per_page || 20),
      q: obj.q,
      plan: obj.plan,
      status_filter,
      subscription_status: obj.subscription_status,
      sort: obj.sort || "-created_at",
    };
  }, [searchParams]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
      ).toString();
      const res = await apiRequest(`/admin/users?${qs}`);
      setRows(res.data || []);
      setMeta({ page: res.page, per_page: res.per_page, total: res.total });
    } catch (e) {
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [searchParams]);

  const onFiltersChange = (obj) => {
    // Only send status_filter if valid
    let status_filter = obj.status_filter;
    if (status_filter !== "active" && status_filter !== "inactive") {
      status_filter = undefined;
    }
    const nextParams = {
      ...obj,
      status_filter,
      page: 1,
      per_page: filters.per_page,
    };
    // Remove undefined/empty-string values so we never end up with q=undefined in URL
    const qs = new URLSearchParams(
      Object.entries(nextParams).filter(([, v]) => v !== undefined && v !== "")
    ).toString();
    router.push(`/dashboard/admin/users?${qs}`);
  };

  const toggleStatus = async (userId, isActive) => {
    try {
      await apiRequest(`/admin/users/${userId}/status`, {
        method: "PATCH",
        body: { is_active: !isActive },
      });
      await load();
    } catch (e) {
      alert(e?.message || "Failed to update status");
    }
  };

  const impersonate = async (userId) => {
    try {
      await apiRequest(`/admin/users/${userId}/impersonate`, { method: "POST" });
      // Redirect to individual dashboard as impersonated user
      router.push("/dashboard/individual");
    } catch (e) {
      alert(e?.message || "Failed to impersonate");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Users</h1>
            <p className="text-xs sm:text-sm text-gray-500">Manage individual accounts, subscriptions, and activity.</p>
          </div>
        </div>

        <Filters value={filters} onChange={onFiltersChange} />

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
                      <th className="py-2 pr-4">Registered</th>
                      <th className="py-2 pr-4">Last Login</th>
                      <th className="py-2 pr-4">Subscription</th>
                      <th className="py-2 pr-4">Plan</th>
                      <th className="py-2 pr-4">Profiles</th>
                      <th className="py-2 pr-4">Conversations</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.user_id} className="border-b last:border-0">
                        <td className="py-3 pr-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{r.name || "—"}</span>
                            <span className="text-gray-500">{r.email}</span>
                            <div className="mt-1">
                              {r.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Suspended</Badge>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</td>
                        <td className="py-3 pr-4">{r.last_login ? new Date(r.last_login).toLocaleString() : "—"}</td>
                        <td className="py-3 pr-4">
                          <Badge color={r.subscription_status === "active" ? "green" : r.subscription_status === "pending" ? "yellow" : "gray"}>
                            {r.subscription_status || "—"}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">{r.current_plan || "—"}</td>
                        <td className="py-3 pr-4">{r.profiles_count ?? 0}</td>
                        <td className="py-3 pr-4">{r.conversations_count ?? 0}</td>
                        <td className="py-3 pr-4">
                          <div className="flex gap-2">
                            <Link href={`/dashboard/admin/users/${r.user_id}`} className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs">Details</Link>
                            <button onClick={() => toggleStatus(r.user_id, r.is_active)} className="px-3 py-1.5 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-xs">
                              {r.is_active ? "Suspend" : "Activate"}
                            </button>
                            <button onClick={() => impersonate(r.user_id)} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs">Impersonate</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y">
                {rows.map((r) => (
                  <div key={r.user_id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{r.name || "—"}</div>
                        <div className="text-xs text-gray-500 truncate">{r.email}</div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        {r.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Suspended</Badge>}
                        <Badge color={r.subscription_status === "active" ? "green" : r.subscription_status === "pending" ? "yellow" : "gray"}>
                          {r.subscription_status || "—"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Plan:</span>
                        <span className="ml-1 text-gray-900">{r.current_plan || "—"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Profiles:</span>
                        <span className="ml-1 text-gray-900">{r.profiles_count ?? 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Conversations:</span>
                        <span className="ml-1 text-gray-900">{r.conversations_count ?? 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Registered:</span>
                        <span className="ml-1 text-gray-900">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</span>
                      </div>
                    </div>

                    {r.last_login && (
                      <div className="text-xs text-gray-600">
                        Last login: {new Date(r.last_login).toLocaleString()}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link 
                        href={`/dashboard/admin/users/${r.user_id}`} 
                        className="flex-1 text-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                      >
                        Details
                      </Link>
                      <button 
                        onClick={() => toggleStatus(r.user_id, r.is_active)} 
                        className="flex-1 px-3 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-sm font-medium"
                      >
                        {r.is_active ? "Suspend" : "Activate"}
                      </button>
                    </div>
                    <button 
                      onClick={() => impersonate(r.user_id)} 
                      className="w-full px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-sm font-medium"
                    >
                      Impersonate User
                    </button>
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
                      router.push(`/dashboard/admin/users?${qs}`);
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
                      router.push(`/dashboard/admin/users?${qs}`);
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
