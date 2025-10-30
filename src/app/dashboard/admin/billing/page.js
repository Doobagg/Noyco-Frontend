"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiRequest } from "@/lib/api";

function StatCard({ title, value, hint }) {
    return (
        <div className="rounded-lg border bg-white p-3 sm:p-4 shadow-sm">
            <div className="text-xs sm:text-sm text-gray-600">{title}</div>
            <div className="mt-1 text-xl sm:text-2xl font-semibold truncate">{value ?? "—"}</div>
            {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
        </div>
    );
}

function Table({ columns, rows, empty = "No data" }) {
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((c) => (
                                <th key={c.key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {c.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rows.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={columns.length}>
                                    {empty}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    {columns.map((c) => (
                                        <td key={c.key} className="px-4 py-2 text-sm text-gray-800">
                                            {c.render ? c.render(row[c.key], row) : row[c.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden rounded-lg border bg-white divide-y">
                {rows.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                        {empty}
                    </div>
                ) : (
                    rows.map((row, idx) => (
                        <div key={idx} className="p-4 space-y-2">
                            {columns.map((c) => (
                                <div key={c.key} className="flex justify-between items-start gap-2">
                                    <span className="text-xs font-medium text-gray-500 uppercase">{c.title}:</span>
                                    <span className="text-sm text-gray-800 text-right flex-1">
                                        {c.render ? c.render(row[c.key], row) : row[c.key]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default function AdminBillingPage() {
    const [, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [subs, setSubs] = useState({ data: [], page: 1, per_page: 10, total: 0 });
    const [failed, setFailed] = useState({ data: [], page: 1, per_page: 10, total: 0 });
    const [cancelled, setCancelled] = useState({ data: [], page: 1, per_page: 10, total: 0 });
    const [statusFilter, setStatusFilter] = useState("active");

    const currency = summary?.currency || "usd";

    const loadAll = async (page = 1) => {
        try {
            setLoading(true);
            const [s, list, f, c] = await Promise.all([
                apiRequest("/admin/billing/summary"),
                apiRequest(`/admin/billing/subscriptions?page=${page}&per_page=10&status=${statusFilter || ""}`),
                apiRequest(`/admin/billing/failed-payments?page=1&per_page=10`),
                apiRequest(`/admin/billing/cancelled?page=1&per_page=10`),
            ]);
            setSummary(s);
            setSubs(list);
            setFailed(f);
            setCancelled(c);
        } catch (e) {
            console.error("Failed to load billing data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll(1);
    }, [statusFilter]);

    const mrrByPlanRows = useMemo(() => {
        const mp = summary?.mrr_by_plan || {};
        return Object.keys(mp).map((k) => ({ plan: k, ...mp[k] }));
    }, [summary]);

    const formatMoney = (amount) => {
        if (amount == null) return "—";
        try {
            return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(amount);
        } catch {
            return `$${amount.toFixed?.(2) ?? amount}`;
        }
    };

        return (
            <ProtectedRoute allowedRoles={["admin"]}>
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h1 className="text-xl sm:text-2xl font-semibold">Billing Overview</h1>
                    <div className="flex items-center gap-2">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded border px-2 py-1 text-xs sm:text-sm">
                            <option value="">All</option>
                            <option value="active">Active</option>
                            <option value="trialing">Trialing</option>
                            <option value="past_due">Past Due</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button onClick={() => loadAll(subs.page)} className="rounded bg-gray-900 px-3 py-1 text-xs sm:text-sm text-white hover:bg-gray-800">Refresh</button>
                    </div>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard title="Active Subscriptions" value={summary?.active_subscriptions ?? "—"} />
                    <StatCard title="Total MRR" value={formatMoney(summary?.total_mrr)} hint={currency.toUpperCase()} />
                    <StatCard title="ARPU" value={formatMoney(summary?.arpu)} />
                    <StatCard title="Failed Payments" value={failed?.total ?? 0} />
                </div>

                {/* MRR by Plan */}
                <div className="space-y-3">
                    <h2 className="text-base sm:text-lg font-medium">MRR by Plan</h2>
                    <Table
                        columns={[
                            { key: "plan", title: "Plan" },
                            { key: "count", title: "Active" },
                            { key: "price", title: "Price", render: (v) => formatMoney(v) },
                            { key: "mrr", title: "MRR", render: (v) => formatMoney(v) },
                        ]}
                        rows={mrrByPlanRows}
                        empty="No plan data"
                    />
                </div>

                {/* Subscriptions */}
                <div className="space-y-3">
                    <h2 className="text-base sm:text-lg font-medium">Subscriptions</h2>
                    <Table
                        columns={[
                            { key: "user", title: "User", render: (v) => v?.name || v?.email || "—" },
                            { key: "plan_type", title: "Plan" },
                            { key: "status", title: "Status" },
                            { key: "start_date", title: "Start", render: (v) => (v ? new Date(v).toLocaleDateString() : "—") },
                            { key: "next_billing_date", title: "Next Billing", render: (v) => (v ? new Date(v).toLocaleDateString() : "—") },
                                { key: "subscription_id", title: "Sub ID", render: (v) => (v ? String(v).slice(0, 10) + "…" : "—") },
                        ]}
                        rows={subs?.data || []}
                        empty="No subscriptions"
                    />
                </div>

                {/* Failures and Cancelled */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3">
                        <h2 className="text-base sm:text-lg font-medium">Recent Failed Payments</h2>
                        <Table
                            columns={[
                                { key: "date", title: "Date", render: (v) => (v ? new Date(v).toLocaleDateString() : "—") },
                                { key: "user", title: "User", render: (v) => v?.name || v?.email || "—" },
                                { key: "amount", title: "Amount", render: (v) => formatMoney(v) },
                                { key: "reason", title: "Reason" },
                            ]}
                            rows={failed?.data || []}
                            empty="No failures"
                        />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-base sm:text-lg font-medium">Recently Cancelled</h2>
                        <Table
                            columns={[
                                { key: "cancelled_at", title: "Date", render: (v) => (v ? new Date(v).toLocaleDateString() : "—") },
                                { key: "user", title: "User", render: (v) => v?.name || v?.email || "—" },
                                { key: "plan_type", title: "Plan" },
                                { key: "reason", title: "Reason" },
                            ]}
                            rows={cancelled?.data || []}
                            empty="No cancellations"
                        />
                    </div>
                </div>
            </div>
            </ProtectedRoute>
    );
}
