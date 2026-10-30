"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  AlertOctagon,
  RefreshCw,
  Check,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from "lucide-react";
import type { FounderApproval } from "@/types";
import type { AIOfficerProfile } from "@/config/officers";

interface DecisionCenterTabProps {
  approvals: FounderApproval[];
  officers: AIOfficerProfile[];
  onRefresh: () => Promise<void>;
}

export function DecisionCenterTab({
  approvals,
  officers,
  onRefresh,
}: DecisionCenterTabProps) {
  const [subTab, setSubTab] = React.useState<"pending" | "history">("pending");
  const [historyFilter, setHistoryFilter] = React.useState<"all" | "approved" | "rejected">("all");
  const [decisionNotes, setDecisionNotes] = React.useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [expandedPayloads, setExpandedPayloads] = React.useState<Record<string, boolean>>({});

  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const historicalApprovals = approvals.filter((a) => a.status !== "pending");

  const filteredHistory = historicalApprovals.filter((a) => {
    if (historyFilter === "all") return true;
    return a.status === historyFilter;
  });

  const togglePayload = (id: string) => {
    setExpandedPayloads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDecision = async (approvalId: string, decision: "approved" | "rejected") => {
    setActionLoading(approvalId);
    try {
      const notes = decisionNotes[approvalId] || "";
      const res = await fetch("/api/hq/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalId,
          decision,
          decisionNotes: notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Decision processing failed");

      // Clear decision notes for this item
      setDecisionNotes((prev) => {
        const next = { ...prev };
        delete next[approvalId];
        return next;
      });

      await onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error submitting founder decision");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sandigan-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold font-manrope text-sandigan-navy-900">
            Founder Decision Center — Authorization Gateway
          </h2>
          <p className="text-xs text-sandigan-navy-600">
            Human-in-the-loop executive control. High-risk autonomous officer tasks remain safely blocked until explicitly authorized.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={subTab === "pending" ? "primary" : "outline"}
            size="sm"
            onClick={() => setSubTab("pending")}
            className={`text-xs gap-1.5 h-8 ${
              subTab === "pending"
                ? "bg-sandigan-navy-900 text-white"
                : "border-sandigan-navy-200 text-sandigan-navy-700"
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Pending Decisions ({pendingApprovals.length})
          </Button>

          <Button
            variant={subTab === "history" ? "primary" : "outline"}
            size="sm"
            onClick={() => setSubTab("history")}
            className={`text-xs gap-1.5 h-8 ${
              subTab === "history"
                ? "bg-sandigan-navy-900 text-white"
                : "border-sandigan-navy-200 text-sandigan-navy-700"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Decision History ({historicalApprovals.length})
          </Button>

          <Button variant="ghost" size="sm" onClick={onRefresh} className="text-xs gap-1 h-8 px-2">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 2. Sub-Tab 1: Pending Approvals Queue */}
      {subTab === "pending" && (
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="p-12 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold font-manrope text-sandigan-navy-900">
                  All Autonomous Operations Authorized
                </h3>
                <p className="text-xs text-sandigan-navy-500 max-w-md mx-auto">
                  No high-risk actions currently require human founder review. All AI Officers are operating within their pre-approved non-consequential parameters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((approval) => {
                const officer = officers.find((o) => o.name === approval.officer_requesting);
                const isExpanded = !!expandedPayloads[approval.id];
                const isLoading = actionLoading === approval.id;

                return (
                  <Card
                    key={approval.id}
                    className="border-amber-300 bg-amber-50/10 shadow-sm overflow-hidden"
                  >
                    <div className="bg-amber-100/50 px-6 py-3 border-b border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] text-white shadow-xs"
                          style={{ backgroundColor: officer?.avatarColor || "#101B35" }}
                        >
                          {approval.officer_requesting.substring(0, 2)}
                        </span>
                        <span className="font-bold text-xs text-sandigan-navy-900 font-manrope">
                          Requesting Officer: {approval.officer_requesting}
                        </span>
                        <span className="text-sandigan-navy-400">•</span>
                        <Badge
                          variant="neutral"
                          className={`text-[10px] uppercase font-mono font-bold ${
                            approval.risk_level === "critical"
                              ? "bg-rose-600 text-white"
                              : approval.risk_level === "high"
                              ? "bg-amber-600 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {approval.risk_level} Risk
                        </Badge>
                      </div>

                      <div className="text-[11px] text-sandigan-navy-500 font-mono">
                        Requested: {new Date(approval.created_at).toLocaleString()}
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      {/* Action Summary */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-sandigan-navy-500 uppercase tracking-wider">
                          Proposed Autonomous Action
                        </h4>
                        <p className="text-sm font-semibold text-sandigan-navy-900 font-inter">
                          {approval.action_summary}
                        </p>
                      </div>

                      {/* Supporting Context / Payload */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-sandigan-navy-700">
                            Supporting Context Parameters:
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePayload(approval.id)}
                            className="text-[11px] text-sandigan-navy-500 h-6 px-2 gap-1"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3 h-3" /> Hide Payload
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" /> Inspect Payload
                              </>
                            )}
                          </Button>
                        </div>

                        {isExpanded && approval.action_payload && (
                          <div className="p-3 rounded-lg bg-sandigan-navy-900 text-sandigan-teal-300 font-mono text-[11px] overflow-x-auto">
                            <pre>{JSON.stringify(approval.action_payload, null, 2)}</pre>
                          </div>
                        )}
                      </div>

                      {/* Decision Notes Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-sandigan-navy-700">
                          Founder Decision Rationale / Audit Notes (Optional):
                        </label>
                        <Textarea
                          placeholder="Document your review notes, risk mitigation assessment, or conditions..."
                          value={decisionNotes[approval.id] || ""}
                          onChange={(e) =>
                            setDecisionNotes((prev) => ({
                              ...prev,
                              [approval.id]: e.target.value,
                            }))
                          }
                          rows={2}
                          className="text-xs"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-sandigan-navy-100 flex items-center justify-end gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isLoading}
                          onClick={() => handleDecision(approval.id, "rejected")}
                          className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold gap-1.5 h-9 px-4"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <X className="w-3.5 h-3.5" />
                          )}
                          Reject & Cancel
                        </Button>

                        <Button
                          size="sm"
                          disabled={isLoading}
                          onClick={() => handleDecision(approval.id, "approved")}
                          className="bg-sandigan-emerald-600 hover:bg-sandigan-emerald-500 text-white text-xs font-semibold gap-1.5 h-9 px-4 shadow-sm"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          Authorize & Dispatch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Sub-Tab 2: Historical Approvals Log */}
      {subTab === "history" && (
        <div className="space-y-4">
          {/* History Filter Toolbar */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-sandigan-navy-200 bg-white text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sandigan-navy-700">Filter History:</span>
              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value as "all" | "approved" | "rejected")}
                className="h-8 rounded-lg border border-sandigan-navy-200 bg-white px-2.5 text-xs text-sandigan-navy-900"
              >
                <option value="all">All Resolved Decisions</option>
                <option value="approved">Approved Only</option>
                <option value="rejected">Rejected Only</option>
              </select>
            </div>
            <span className="text-sandigan-navy-500 font-mono">
              {filteredHistory.length} recorded audit decisions
            </span>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="p-12 text-center border rounded-xl bg-white text-xs text-sandigan-navy-400">
              No historical decisions found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <Card key={item.id} className="border-sandigan-navy-200 bg-white shadow-xs">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sandigan-navy-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="neutral"
                          className={`text-[10px] font-bold uppercase ${
                            item.status === "approved"
                              ? "bg-emerald-600 text-white"
                              : "bg-rose-600 text-white"
                          }`}
                        >
                          {item.status}
                        </Badge>
                        <span className="font-bold text-xs text-sandigan-navy-900 font-manrope">
                          {item.officer_requesting}
                        </span>
                        <span className="text-sandigan-navy-400">•</span>
                        <span className="text-xs text-sandigan-navy-600 font-mono">
                          Risk: {item.risk_level}
                        </span>
                      </div>
                      <div className="text-[11px] text-sandigan-navy-400 font-mono">
                        Decided: {item.decided_at ? new Date(item.decided_at).toLocaleString() : "Recorded"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-sandigan-navy-900">
                        {item.action_summary}
                      </p>
                      {item.decision_notes && (
                        <p className="text-xs text-sandigan-navy-600 italic bg-sandigan-navy-50 p-2 rounded-lg border border-sandigan-navy-100">
                          &ldquo;{item.decision_notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
