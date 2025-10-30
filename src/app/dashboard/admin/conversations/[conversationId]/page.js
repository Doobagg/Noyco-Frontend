"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

function Toggle({ label, checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" className="accent-indigo-600" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}

function Message({ role, content, timestamp }) {
  const me = role === "user";
  const side = me ? "justify-start" : "justify-end";
  const bubble = me ? "bg-gray-100" : "bg-indigo-50";
  return (
    <div className={`flex ${side} my-1`}>
      <div className={`max-w-3xl px-4 py-2 rounded-xl ${bubble}`}>
        <div className="text-xs text-gray-500 mb-1">{role}{timestamp ? ` • ${new Date(timestamp).toLocaleString()}`: ""}</div>
        <div className="whitespace-pre-wrap text-gray-900">{content}</div>
      </div>
    </div>
  );
}

export default function ConversationDetailPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [redact, setRedact] = useState(true);

  const conversationId = params.conversationId;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ redact: String(redact) }).toString();
      const res = await apiRequest(`/admin/conversations/${conversationId}?${qs}`);
      setData(res);
    } catch (e) {
      setError(e?.message || "Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [conversationId, redact]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Conversation</h1>
            <p className="text-sm text-gray-500">Full transcript with sentiment and flags.</p>
          </div>
          <div className="flex items-center gap-4">
            <Toggle label="Redact PII" checked={redact} onChange={setRedact} />
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-600">{error}</div>
          ) : !data ? (
            <div className="py-10 text-center text-gray-500">No data</div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-xs text-gray-500">User</div>
                  <div className="text-sm text-gray-900">{data.user?.name || "—"} ({data.user?.email || "—"})</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Agent</div>
                  <div className="text-sm text-gray-900">{data.agent_type || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Sentiment</div>
                  <div className="text-sm text-gray-900 capitalize">{data.sentiment || "neutral"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Flags</div>
                  <div className="text-sm text-gray-900">{(data.flags || []).join(", ") || "—"}</div>
                </div>
              </div>

              {data.summary && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Summary</div>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap">{data.summary}</div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-gray-900 mb-3">Transcript</div>
                <div className="space-y-2">
                  {(data.transcript || []).map((m, idx) => (
                    <Message key={idx} role={m.role} content={m.content} timestamp={m.timestamp} />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-900 mb-3">User Feedback</div>
                {Array.isArray(data.user_feedback) && data.user_feedback.length > 0 ? (
                  <ul className="list-disc pl-6 text-sm text-gray-700">
                    {data.user_feedback.map((f, idx) => (
                      <li key={idx}>{typeof f === "string" ? f : JSON.stringify(f)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">No feedback</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
