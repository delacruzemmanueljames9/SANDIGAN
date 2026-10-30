"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  MapPin,
  PhoneCall,
  Mail,
  Globe,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import supportData from "../../../.data/support_directory.json";
import { SupportProvider } from "@/types";

export default function FindSupportPage() {
  const [search, setSearch] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState<string>("all");
  const [only247, setOnly247] = React.useState(false);
  const [onlyFree, setOnlyFree] = React.useState(false);

  const providers = supportData as SupportProvider[];

  const regions = ["all", "National", "NCR", "Luzon", "Visayas", "Mindanao"];

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.services_offered.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      (p.physical_address && p.physical_address.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedRegion !== "all" && p.region !== selectedRegion) return false;
    if (only247 && !p.is_24_7) return false;
    if (onlyFree && !p.is_free_service) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="teal">Verified Support Directory</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          Find Mental Health Support in the Philippines
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Search accredited crisis lines, government hospitals, free university clinics, and non-profit psychological services across the archipelago.
        </p>
      </div>

      {/* Immediate Crisis Callout */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5 dark:border-rose-900/60 dark:bg-rose-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-rose-900 dark:text-rose-200">
              Need Immediate Emergency Help Right Now?
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-400">
              Dial <strong>1553</strong> (NCMH 24/7 toll-free) or visit our dedicated crisis page.
            </p>
          </div>
        </div>
        <Link href="/get-help-now">
          <Button variant="danger" size="sm" className="bg-rose-600 hover:bg-rose-700 shadow-sm shrink-0">
            Get Emergency Help
          </Button>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-sandigan-border-dark dark:bg-sandigan-surface-cardDark shadow-soft-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by facility name, service, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-dark text-sm focus:outline-none focus:ring-2 focus:ring-sandigan-teal"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedRegion === reg
                    ? "bg-sandigan-navy text-white shadow-sm dark:bg-sandigan-teal"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-sandigan-navy-800 dark:text-slate-300 dark:hover:bg-sandigan-navy-700"
                }`}
              >
                {reg === "all" ? "All Regions" : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles: 24/7 & Free */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 dark:border-sandigan-navy-800 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={only247}
              onChange={(e) => setOnly247(e.target.checked)}
              className="rounded text-sandigan-teal focus:ring-sandigan-teal"
            />
            <span>24/7 Helplines Only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setOnlyFree(e.target.checked)}
              className="rounded text-sandigan-teal focus:ring-sandigan-teal"
            />
            <span>Free Services Only</span>
          </label>

          <span className="text-slate-400 ml-auto">
            Showing {filteredProviders.length} verified {filteredProviders.length === 1 ? "provider" : "providers"}
          </span>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProviders.map((prov) => (
          <Card key={prov.id} className="flex flex-col justify-between hover:shadow-soft-md transition-shadow">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sandigan-teal">
                      {prov.organization_type}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-[11px] font-medium text-slate-500">{prov.region}</span>
                  </div>
                  <CardTitle className="text-lg mt-1">{prov.name}</CardTitle>
                </div>
                {prov.is_24_7 && <Badge variant="teal">24/7 Available</Badge>}
              </div>
              <CardDescription className="text-xs leading-relaxed">{prov.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {/* Services badges */}
              <div className="flex flex-wrap gap-1.5">
                {prov.services_offered.map((svc) => (
                  <span
                    key={svc}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-sandigan-navy-800 text-[11px] text-slate-700 dark:text-slate-300"
                  >
                    {svc}
                  </span>
                ))}
              </div>

              {/* Contact info list */}
              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-sandigan-navy-900 border border-slate-200/80 dark:border-sandigan-navy-800 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <PhoneCall className="w-3.5 h-3.5 text-sandigan-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Hotline / Phone: </span>
                    <a
                      href={`tel:${prov.contact_phone.split("/")[0].trim().replace(/[^0-9]/g, "")}`}
                      className="font-bold text-sandigan-navy dark:text-sandigan-gold hover:underline"
                    >
                      {prov.contact_phone}
                    </a>
                  </div>
                </div>

                {prov.contact_email && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-sandigan-teal shrink-0" />
                    <span className="truncate">{prov.contact_email}</span>
                  </div>
                )}

                {prov.physical_address && (
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-sandigan-teal shrink-0 mt-0.5" />
                    <span>{prov.physical_address}</span>
                  </div>
                )}
              </div>

              {/* Footer status & official link */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-sandigan-navy-800 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified October 2026
                </span>
                {prov.website_url && (
                  <a
                    href={prov.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sandigan-teal hover:underline font-semibold"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm text-slate-500">No organizations found matching your search and filter criteria.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setSelectedRegion("all"); setOnly247(false); setOnlyFree(false); }}>
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
