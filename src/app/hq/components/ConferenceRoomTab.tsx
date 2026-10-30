"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  ShieldAlert,
  ArrowRight,
  Check,
  CheckCircle,
  RefreshCw,
  Cpu,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { AIMessage, AITask } from "@/types";
import type { AIOfficerProfile } from "@/config/officers";

interface ConferenceRoomTabProps {
  messages: AIMessage[];
  tasks: AITask[];
  officers: AIOfficerProfile[];
  onRefresh: () => Promise<void>;
}

export function ConferenceRoomTab({
  messages,
  tasks,
  officers,
  onRefresh,
}: ConferenceRoomTabProps) {
  // Search & Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterFrom, setFilterFrom] = React.useState("all");
  const [filterTo, setFilterTo] = React.useState("all");
  const [filterType, setFilterType] = React.useState("all");
  const [expandedPayloads, setExpandedPayloads] = React.useState<Record<string, boolean>>({});

  // Dispatch Form State
  const [isDispatching, setIsDispatching] = React.useState(false);
  const [dispatchFrom, setDispatchFrom] = React.useState("AMARA");
  const [dispatchTo, setDispatchTo] = React.useState("TALA");
  const [dispatchType, setDispatchType] = React.useState<
    "task_handoff" | "crisis_alert" | "moderation_flag" | "coordination"
  >("coordination");
  const [dispatchSubject, setDispatchSubject] = React.useState("");
  const [dispatchBody, setDispatchBody] = React.useState("");
  const [dispatchFeedback, setDispatchFeedback] = React.useState<{ success?: string; error?: string } | null>(null);

  // Acknowledging messages
  const [ackLoading, setAckLoading] = React.useState<string | null>(null);

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    if (filterFrom !== "all" && msg.from_officer !== filterFrom) return false;
    if (filterTo !== "all" && msg.to_officer !== filterTo) return false;
    if (filterType !== "all" && msg.message_type !== filterType) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchSubject = msg.subject.toLowerCase().includes(q);
      const matchBody = msg.body.toLowerCase().includes(q);
      if (!matchSubject && !matchBody) return false;
    }
    return true;
  });

  // Calculate officer participation
  const participation: Record<string, { sent: number; received: number; lastActive?: string }> = {
    AMARA: { sent: 0, received: 0 },
    TALA: { sent: 0, received: 0 },
    GABAY: { sent: 0, received: 0 },
    SIKLAB: { sent: 0, received: 0 },
    DUNONG: { sent: 0, received: 0 },
    KAWING: { sent: 0, received: 0 },
    SINAG: { sent: 0, received: 0 },
  };

  messages.forEach((m) => {
    if (participation[m.from_officer]) {
      participation[m.from_officer].sent += 1;
      if (!participation[m.from_officer].lastActive) participation[m.from_officer].lastActive = m.created_at;
    }
    if (participation[m.to_officer]) {
      participation[m.to_officer].received += 1;
      if (!participation[m.to_officer].lastActive) participation[m.to_officer].lastActive = m.created_at;
    }
  });

  const togglePayload = (id: string) => {
    setExpandedPayloads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAcknowledge = async (messageId: string) => {
    setAckLoading(messageId);
    try {
      const res = await fetch("/api/hq/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", messageId }),
      });
      if (!res.ok) throw new Error("Failed to acknowledge message");
      await onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error acknowledging message");
    } finally {
      setAckLoading(null);
    }
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchSubject.trim() || !dispatchBody.trim()) {
      setDispatchFeedback({ error: "Subject and message body are required." });
      return;
    }

    setIsDispatching(true);
    setDispatchFeedback(null);
    try {
      const res = await fetch("/api/hq/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromOfficer: dispatchFrom,
          toOfficer: dispatchTo,
          messageType: dispatchType,
          subject: dispatchSubject,
          messageBody: dispatchBody,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Message dispatch failed");

      setDispatchFeedback({ success: "Inter-officer message routed and stored successfully." });
      setDispatchSubject("");
      setDispatchBody("");
      await onRefresh();
    } catch (err) {
      setDispatchFeedback({ error: err instanceof Error ? err.message : "Routing failed" });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview & Loop Prevention Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sandigan-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold font-manrope text-sandigan-navy-900">
            Conference Room — Inter-Officer Coordination Bus
          </h2>
          <p className="text-xs text-sandigan-navy-600">
            Audit-logged communication channel between the 7 AI Officers. Governed by AMARA with max-hop anti-loop safeguards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-300 text-emerald-800 text-xs bg-emerald-50">
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Loop Guard Active (Max Depth 5)
          </Badge>
          <Button variant="outline" size="sm" onClick={onRefresh} className="text-xs gap-1.5 h-8">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* 2. Officer Participation Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {officers.map((officer) => {
          const stats = participation[officer.name] || { sent: 0, received: 0 };
          return (
            <div
              key={officer.id}
              className="p-3 rounded-xl border border-sandigan-navy-200 bg-white shadow-xs space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] text-white"
                  style={{ backgroundColor: officer.avatarColor }}
                >
                  {officer.name.substring(0, 2)}
                </div>
                <div className="font-bold text-xs text-sandigan-navy-900 font-manrope truncate">
                  {officer.name}
                </div>
              </div>
              <div className="text-[11px] text-sandigan-navy-500 font-mono">
                <span>↑ {stats.sent} sent</span> • <span>↓ {stats.received} rec</span>
              </div>
              <div className="text-[10px] text-sandigan-navy-400 truncate">
                {stats.lastActive ? new Date(stats.lastActive).toLocaleTimeString() : "Standby"}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Two-Column Layout: Feed on Left (2 cols), Dispatch Console on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Search, Filters & Message Stream */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="p-3.5 rounded-xl border border-sandigan-navy-200 bg-sandigan-navy-50/60 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-sandigan-navy-400 absolute left-3 top-2.5" />
              <Input
                placeholder="Search conference messages by subject or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-white"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-sandigan-navy-500 font-medium text-[11px]">From:</span>
                <select
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  className="h-8 rounded-lg border border-sandigan-navy-200 bg-white px-2 text-xs text-sandigan-navy-800"
                >
                  <option value="all">All Officers</option>
                  {officers.map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-sandigan-navy-500 font-medium text-[11px]">To:</span>
                <select
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                  className="h-8 rounded-lg border border-sandigan-navy-200 bg-white px-2 text-xs text-sandigan-navy-800"
                >
                  <option value="all">All Officers</option>
                  {officers.map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-sandigan-navy-500 font-medium text-[11px]">Type:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-8 rounded-lg border border-sandigan-navy-200 bg-white px-2 text-xs text-sandigan-navy-800"
                >
                  <option value="all">All Types</option>
                  <option value="task_handoff">Task Handoff</option>
                  <option value="crisis_alert">Crisis Alert</option>
                  <option value="moderation_flag">Moderation Flag</option>
                  <option value="coordination">Coordination</option>
                </select>
              </div>

              {(searchQuery || filterFrom !== "all" || filterTo !== "all" || filterType !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterFrom("all");
                    setFilterTo("all");
                    setFilterType("all");
                  }}
                  className="text-xs text-sandigan-teal-600 h-8 ml-auto"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Message Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-sandigan-navy-500 px-1">
              <span>Showing {filteredMessages.length} coordination messages</span>
              <span className="italic">Stored in public.ai_messages</span>
            </div>

            {filteredMessages.length === 0 ? (
              <div className="p-12 text-center border rounded-xl bg-white text-xs text-sandigan-navy-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-sandigan-navy-300 mx-auto" />
                <p>No messages match your search or filter criteria.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const hopCount = (msg.payload as Record<string, unknown>)?.hopCount || 1;
                const isExpanded = !!expandedPayloads[msg.id];
                const fromProf = officers.find((o) => o.name === msg.from_officer);
                const toProf = officers.find((o) => o.name === msg.to_officer);

                return (
                  <Card
                    key={msg.id}
                    className={`border transition-all ${
                      msg.message_type === "crisis_alert"
                        ? "border-rose-300 bg-rose-50/20"
                        : msg.is_read
                        ? "border-sandigan-navy-200 bg-white"
                        : "border-sandigan-teal-300 bg-sandigan-teal-50/20"
                    }`}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Header row: From -> To, Type, Hop Count */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sandigan-navy-100 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          {/* From Officer */}
                          <div className="flex items-center gap-1.5 font-bold text-sandigan-navy-900 font-manrope">
                            <span
                              className="w-4 h-4 rounded text-[9px] font-bold text-white flex items-center justify-center"
                              style={{ backgroundColor: fromProf?.avatarColor || "#101B35" }}
                            >
                              {msg.from_officer.substring(0, 2)}
                            </span>
                            <span>{msg.from_officer}</span>
                          </div>

                          <ArrowRight className="w-3 h-3 text-sandigan-navy-400" />

                          {/* To Officer */}
                          <div className="flex items-center gap-1.5 font-bold text-sandigan-navy-900 font-manrope">
                            <span
                              className="w-4 h-4 rounded text-[9px] font-bold text-white flex items-center justify-center"
                              style={{ backgroundColor: toProf?.avatarColor || "#101B35" }}
                            >
                              {msg.to_officer.substring(0, 2)}
                            </span>
                            <span>{msg.to_officer}</span>
                          </div>

                          {/* Message Type Badge */}
                          <Badge
                            variant="neutral"
                            className={`text-[10px] uppercase font-mono font-bold ${
                              msg.message_type === "crisis_alert"
                                ? "bg-rose-600 text-white"
                                : msg.message_type === "task_handoff"
                                ? "bg-blue-600 text-white"
                                : msg.message_type === "moderation_flag"
                                ? "bg-amber-600 text-white"
                                : "bg-sandigan-teal-600 text-white"
                            }`}
                          >
                            {msg.message_type.replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-sandigan-navy-400 font-mono">
                          <span className="bg-sandigan-navy-100 px-1.5 py-0.5 rounded text-[10px] text-sandigan-navy-700">
                            Hop {String(hopCount)}/5
                          </span>
                          <span>{new Date(msg.created_at).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Subject & Body */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-sandigan-navy-900 font-manrope">
                          {msg.subject}
                        </h4>
                        <p className="text-xs text-sandigan-navy-700 leading-relaxed whitespace-pre-wrap">
                          {msg.body}
                        </p>
                      </div>

                      {/* Footer actions: Payload toggle & Acknowledge */}
                      <div className="pt-2 border-t border-sandigan-navy-100 flex items-center justify-between text-xs">
                        {msg.payload && Object.keys(msg.payload).length > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePayload(msg.id)}
                            className="text-[11px] text-sandigan-navy-500 hover:text-sandigan-navy-800 gap-1 h-7 px-2"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3 h-3" /> Hide Context Payload
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" /> View Context Payload
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="text-[11px] text-sandigan-navy-400 italic">No extra payload</span>
                        )}

                        <div className="flex items-center gap-2">
                          {msg.is_read ? (
                            <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                              <Check className="w-3 h-3" /> Acknowledged
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAcknowledge(msg.id)}
                              disabled={ackLoading === msg.id}
                              className="text-[11px] h-7 border-sandigan-navy-200 text-sandigan-navy-700 hover:bg-sandigan-navy-100 gap-1"
                            >
                              <Check className="w-3 h-3" /> Mark Acknowledged
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Expanded Payload Viewer */}
                      {isExpanded && msg.payload && (
                        <div className="mt-2 p-3 rounded-lg bg-sandigan-navy-900 text-sandigan-teal-300 font-mono text-[11px] overflow-x-auto">
                          <pre>{JSON.stringify(msg.payload, null, 2)}</pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Interactive Dispatch Console */}
        <div className="space-y-4">
          <Card className="border-sandigan-navy-200 shadow-sm sticky top-6">
            <CardHeader className="bg-sandigan-navy-900 text-white p-5 rounded-t-xl">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sandigan-teal-400" />
                <CardTitle className="text-sm font-bold font-manrope text-white">
                  AMARA Coordination Console
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-sandigan-navy-300">
                Dispatch an inter-officer directive or task handoff directly through the AMARA orchestration layer.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleDispatch} className="space-y-4 text-xs">
                {dispatchFeedback?.error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {dispatchFeedback.error}
                  </div>
                )}
                {dispatchFeedback?.success && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                    {dispatchFeedback.success}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold text-sandigan-navy-800">Dispatching Officer (From):</label>
                  <select
                    value={dispatchFrom}
                    onChange={(e) => setDispatchFrom(e.target.value)}
                    className="w-full h-9 rounded-lg border border-sandigan-navy-200 bg-white px-2.5 text-xs text-sandigan-navy-900"
                  >
                    {officers.map((o) => (
                      <option key={o.id} value={o.name}>
                        {o.name} ({o.callsign})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-sandigan-navy-800">Target Recipient (To):</label>
                  <select
                    value={dispatchTo}
                    onChange={(e) => setDispatchTo(e.target.value)}
                    className="w-full h-9 rounded-lg border border-sandigan-navy-200 bg-white px-2.5 text-xs text-sandigan-navy-900"
                  >
                    {officers.map((o) => (
                      <option key={o.id} value={o.name}>
                        {o.name} ({o.callsign})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-sandigan-navy-800">Message Protocol Type:</label>
                  <select
                    value={dispatchType}
                    onChange={(e) =>
                      setDispatchType(
                        e.target.value as "task_handoff" | "crisis_alert" | "moderation_flag" | "coordination"
                      )
                    }
                    className="w-full h-9 rounded-lg border border-sandigan-navy-200 bg-white px-2.5 text-xs text-sandigan-navy-900 font-mono"
                  >
                    <option value="coordination">coordination (General Inter-Officer)</option>
                    <option value="task_handoff">task_handoff (Sequential Pipeline)</option>
                    <option value="moderation_flag">moderation_flag (Safety Triage)</option>
                    <option value="crisis_alert">crisis_alert (Fast-Path to GABAY)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-sandigan-navy-800">Subject:</label>
                  <Input
                    placeholder="e.g. Wellness check anomaly cross-check"
                    value={dispatchSubject}
                    onChange={(e) => setDispatchSubject(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-sandigan-navy-800">Direct Message Body:</label>
                  <Textarea
                    placeholder="Specify the operational directive, parameters, and rationale..."
                    value={dispatchBody}
                    onChange={(e) => setDispatchBody(e.target.value)}
                    rows={4}
                    className="text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isDispatching}
                  className="w-full bg-sandigan-teal-600 hover:bg-sandigan-teal-500 text-white font-semibold text-xs h-9 gap-1.5"
                >
                  {isDispatching ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Routing Directive...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Dispatch Inter-Officer Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
