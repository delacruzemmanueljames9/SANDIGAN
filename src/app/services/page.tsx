"use client";

import * as React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  MessageSquareHeart,
  Sparkles,
  ShieldAlert,
  FileHeart,
  Wind,
  BookHeart,
  MapPin,
  BookText,
  Moon,
  Sun,
  TrendingUp,
  Users,
  Megaphone,
  HeartHandshake,
  Search,
  ArrowRight,
  Filter,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  MessageSquareHeart,
  Sparkles,
  ShieldAlert,
  FileHeart,
  Wind,
  BookHeart,
  MapPin,
  BookText,
  Moon,
  Sun,
  TrendingUp,
  Users,
  Megaphone,
  HeartHandshake,
};

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const categories = [
    { id: "all", label: "All 14 Services" },
    { id: "crisis", label: "Crisis & Preparedness" },
    { id: "self-care", label: "Self-Care & Grounding" },
    { id: "ai", label: "AI Companionship" },
    { id: "community", label: "Community & Referrals" },
  ];

  const filteredServices = SITE_CONFIG.services.filter((svc) => {
    const matchesSearch =
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === "all") return true;
    if (selectedCategory === "crisis") {
      return ["get-help-now", "safety-plan", "professional-referrals"].includes(svc.id);
    }
    if (selectedCategory === "self-care") {
      return ["wellness-check", "reset-room", "inner-garden", "sleep-wellness", "growth-journey"].includes(svc.id);
    }
    if (selectedCategory === "ai") {
      return ["talk-to-tinig", "daily-companion"].includes(svc.id);
    }
    if (selectedCategory === "community") {
      return ["safe-community", "voice-of-community", "find-support", "mind-library"].includes(svc.id);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="teal">Integrated Digital Ecosystem</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          Fourteen Integrated Core Services
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Every service is purpose-built to deliver compassionate emotional support, private reflection, or clear pathways to verified professional help.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-dark text-sm focus:outline-none focus:ring-2 focus:ring-sandigan-teal"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-sandigan-teal text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-sandigan-navy-800 dark:text-slate-300 dark:hover:bg-sandigan-navy-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((svc) => {
          const Icon = ICON_MAP[svc.iconName] || Sparkles;
          return (
            <Card key={svc.id} className="flex flex-col justify-between hover:shadow-soft-md transition-shadow group">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sandigan-navy-50 text-sandigan-navy dark:bg-sandigan-navy-800 dark:text-sandigan-gold flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  {svc.badge && <Badge variant="neutral">{svc.badge}</Badge>}
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-sandigan-teal transition-colors">
                    {svc.name}
                  </CardTitle>
                  <p className="text-xs font-medium text-sandigan-teal dark:text-sandigan-teal-300 mt-0.5">
                    {svc.tagline}
                  </p>
                </div>
                <CardDescription className="text-xs pt-1">{svc.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-2">
                <div className="text-[11px] text-slate-400 dark:text-slate-500">
                  Lead AI Officer: <span className="font-semibold text-slate-700 dark:text-slate-300">{svc.officerLead}</span>
                </div>
                <div className="pt-1">
                  <Link href={svc.href}>
                    <Button variant="outline" size="sm" className="w-full justify-between group-hover:border-sandigan-teal" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      <span>Open Service</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm text-slate-500">No services matched your search &quot;{searchQuery}&quot;.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
