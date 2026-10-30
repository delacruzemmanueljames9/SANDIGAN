"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import {
  Activity,
  Filter,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { SystemEvent } from "@/types";

interface EventAuditTabProps {
  events: SystemEvent[];
  onRefresh: () => Promise<void>;
}

export function EventAuditTab({ events, onRefresh }: EventAuditTabProps) {
  const [levelFilter, setLevelFilter] = React.useState<string>("all");
  const [expandedEvents, setExpandedEvents] = React.useState<Record<string, boolean>>({});

  const filteredEvents = events.filter((e) => {
    if (levelFilter === "all") return true;
    return e.event_level === levelFilter;
  });

  const toggleEvent = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sandigan-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold font-manrope text-sandigan-navy-900">
            Operational Event Stream & Audit Log
          </h2>
          <p className="text-xs text-sandigan-navy-600">
            Immutable operational and security events recorded in public.system_events.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onRefresh} className="text-xs gap-1.5 h-8">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Log
        </Button>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-sandigan-navy-200 bg-white text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sandigan-navy-700">Filter Severity:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="h-8 rounded-lg border border-sandigan-navy-200 bg-white px-2.5 text-xs text-sandigan-navy-900 font-mono"
          >
            <option value="all">All Levels ({events.length})</option>
            <option value="critical">Critical Only</option>
            <option value="error">Error Only</option>
            <option value="warn">Warn Only</option>
            <option value="info">Info Only</option>
          </select>
        </div>

        <span className="text-sandigan-navy-500 font-mono text-[11px]">
          Showing {filteredEvents.length} events
        </span>
      </div>

      {/* 3. Event List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center border rounded-xl bg-white text-xs text-sandigan-navy-400">
            No system events logged matching current level.
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isExpanded = !!expandedEvents[event.id];

            return (
              <Card key={event.id} className="border-sandigan-navy-200 bg-white shadow-xs">
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sandigan-navy-100 pb-2">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <Badge
                        variant="neutral"
                        className={`text-[10px] uppercase font-mono font-bold ${
                          event.event_level === "critical"
                            ? "bg-rose-600 text-white"
                            : event.event_level === "error"
                            ? "bg-red-500 text-white"
                            : event.event_level === "warn"
                            ? "bg-amber-500 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {event.event_level}
                      </Badge>

                      <span className="font-mono font-bold text-sandigan-navy-900 text-xs">
                        {event.event_type}
                      </span>

                      <span className="text-sandigan-navy-400">•</span>

                      <span className="font-mono text-sandigan-navy-600 text-[11px]">
                        Source: {event.source}
                      </span>
                    </div>

                    <div className="text-[11px] text-sandigan-navy-400 font-mono">
                      {new Date(event.created_at).toLocaleString()}
                    </div>
                  </div>

                  <p className="text-xs text-sandigan-navy-700 leading-relaxed font-inter">
                    {event.message}
                  </p>

                  {/* Metadata Toggle */}
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEvent(event.id)}
                        className="text-[11px] text-sandigan-navy-500 h-6 px-2 gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3 h-3" /> Hide Metadata
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" /> Inspect Metadata
                          </>
                        )}
                      </Button>

                      {isExpanded && (
                        <div className="mt-2 p-3 rounded-lg bg-sandigan-navy-900 text-sandigan-teal-300 font-mono text-[11px] overflow-x-auto">
                          <pre>{JSON.stringify(event.metadata, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
