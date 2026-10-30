'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  LineChart,
  PenTool,
  FolderKanban,
  Library,
  ShieldAlert,
  CheckCircle2,
  Lock,
} from 'lucide-react';

type AssistantType = 'research' | 'editorial' | 'creative' | 'coordination' | 'librarian';

export default function AIAssistantsPage() {
  const [selectedAssistant, setSelectedAssistant] = useState<AssistantType>('coordination');
  const [queryText, setQueryText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<
    { id: string; type: AssistantType; query: string; response: string; timestamp: string }[]
  >([
    {
      id: 'init-1',
      type: 'coordination',
      query: 'Summarize the sprint status for Project Balik-Sigla across campuses.',
      response:
        '[TK Project Operations Coordinator AI Output]\n\nSprint Status: 68% milestone completion. 250 student peer counselors enrolled across 30 universities. Pending blocker: Final approval of Module 3 child protection safeguards needed from the Knowledge Brain before field rollout.',
      timestamp: 'Today, 09:30 AM',
    },
  ]);

  const assistants = [
    {
      id: 'coordination' as AssistantType,
      name: 'Project Coordination AI',
      role: 'Operations & Sprints',
      icon: FolderKanban,
      color: 'bg-blue-600',
      scope: 'Project boards, sprint checklists, and inter-departmental blocker alerts.',
      sampleQuery: 'What are the top 3 pending tasks for the Visayas Summit?',
    },
    {
      id: 'research' as AssistantType,
      name: 'Research & Policy AI',
      role: 'Demographic Insights',
      icon: LineChart,
      color: 'bg-cyan-600',
      scope: 'Youth demographic surveys, mental well-being datasets, and advocacy policy drafts.',
      sampleQuery: 'Synthesize the latest youth academic burnout indicators in NCR.',
    },
    {
      id: 'editorial' as AssistantType,
      name: 'Editorial & Voice AI',
      role: 'Publication Mentorship',
      icon: PenTool,
      color: 'bg-purple-600',
      scope: 'TK Stylebook compliance, ethical trauma reporting, and literary anthology curation.',
      sampleQuery: 'Review this headline for adherence to non-stigmatizing youth media guidelines.',
    },
    {
      id: 'creative' as AssistantType,
      name: 'Creative Campaigns AI',
      role: 'Concept Ideation',
      icon: Sparkles,
      color: 'bg-amber-600',
      scope: 'Grassroots campaign slogans, campus poster themes, and social outreach strategies.',
      sampleQuery: 'Generate 3 youth-friendly slogan concepts for our stress reset campaign.',
    },
    {
      id: 'librarian' as AssistantType,
      name: 'Knowledge Librarian AI',
      role: 'Archive & SOPs',
      icon: Library,
      color: 'bg-emerald-600',
      scope: 'Standard Operating Procedures, certified templates, and organizational policies.',
      sampleQuery: 'Retrieve the protocol for level 3 crisis hotline escalation in SOP-MHD-01.',
    },
  ];

  const currentAssistant = assistants.find(a => a.id === selectedAssistant) || assistants[0];

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim() || isProcessing) return;

    const currentQuery = queryText.trim();
    setQueryText('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/ai/hq-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assistantType: selectedAssistant,
          query: currentQuery,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setHistory(prev => [
          {
            id: `item-${Date.now()}`,
            type: selectedAssistant,
            query: currentQuery,
            response: result.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase">
          <Bot className="w-4 h-4 text-sky-400" />
          <span>Internal Organizational Assistants</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Department AI Copilots
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Specialized, compartmentalized AI assistants designed to support research, publication editing, creative campaigns, sprint tracking, and knowledge retrieval with strict data boundaries.
        </p>
      </div>

      {/* Assistant Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {assistants.map(a => {
          const Icon = a.icon;
          const isSelected = a.id === selectedAssistant;
          return (
            <button
              key={a.id}
              onClick={() => setSelectedAssistant(a.id)}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-sky-400 bg-sky-950/40 shadow-lg'
                  : 'border-slate-800 bg-slate-950 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl ${a.color} text-white flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{a.name}</h4>
                <p className="text-[10px] text-slate-400">{a.role}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Copilot Workspace */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-sky-400 uppercase">
              {currentAssistant.name}
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Scope: {currentAssistant.scope}
            </p>
          </div>

          <button
            onClick={() => setQueryText(currentAssistant.sampleQuery)}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold underline text-left sm:text-right"
          >
            Insert sample prompt
          </button>
        </div>

        {/* Query Input */}
        <form onSubmit={handleSendQuery} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={queryText}
              onChange={e => setQueryText(e.target.value)}
              placeholder={`Ask ${currentAssistant.name}...`}
              className="flex-1 p-3 text-xs sm:text-sm rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!queryText.trim() || isProcessing}
              className="px-6 py-3 rounded-2xl bg-tk-deepblue hover:bg-tk-darkblue disabled:opacity-50 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Query</span>
            </button>
          </div>
        </form>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400 italic">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>Consulting authorized department documents and knowledge indexes...</span>
          </div>
        )}

        {/* Output Feed */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Assistant Dispatches & Analysis History
          </h4>

          {history.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between text-slate-400 font-medium">
                <span className="font-semibold text-white">Prompt: "{item.query}"</span>
                <span className="text-[10px] font-mono">{item.timestamp}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-200 whitespace-pre-line leading-relaxed font-mono text-xs">
                {item.response}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
