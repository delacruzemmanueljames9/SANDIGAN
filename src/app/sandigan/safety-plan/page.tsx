'use client';

import React, { useState } from 'react';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import {
  FileText,
  ShieldCheck,
  Plus,
  Trash2,
  Download,
  Printer,
  CheckCircle2,
  Heart,
  PhoneCall,
  MapPin,
  Lock,
} from 'lucide-react';

export default function MySafetyPlanPage() {
  const { safetyPlan, updateSafetyPlan, isDarkMode } = useSandigan();

  const [newWarning, setNewWarning] = useState('');
  const [newCoping, setNewCoping] = useState('');
  const [newPlace, setNewPlace] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactRel, setNewContactRel] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const addWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarning.trim()) return;
    updateSafetyPlan({ warningSigns: [...safetyPlan.warningSigns, newWarning.trim()] });
    setNewWarning('');
    triggerSaved();
  };

  const removeWarning = (index: number) => {
    updateSafetyPlan({ warningSigns: safetyPlan.warningSigns.filter((_, i) => i !== index) });
  };

  const addCoping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoping.trim()) return;
    updateSafetyPlan({ copingStrategies: [...safetyPlan.copingStrategies, newCoping.trim()] });
    setNewCoping('');
    triggerSaved();
  };

  const removeCoping = (index: number) => {
    updateSafetyPlan({ copingStrategies: safetyPlan.copingStrategies.filter((_, i) => i !== index) });
  };

  const addPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlace.trim()) return;
    updateSafetyPlan({ safePlaces: [...safetyPlan.safePlaces, newPlace.trim()] });
    setNewPlace('');
    triggerSaved();
  };

  const removePlace = (index: number) => {
    updateSafetyPlan({ safePlaces: safetyPlan.safePlaces.filter((_, i) => i !== index) });
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    updateSafetyPlan({
      trustedContacts: [
        ...safetyPlan.trustedContacts,
        { name: newContactName.trim(), relationship: newContactRel.trim() || 'Friend', phone: newContactPhone.trim() },
      ],
    });
    setNewContactName('');
    setNewContactRel('');
    setNewContactPhone('');
    triggerSaved();
  };

  const removeContact = (index: number) => {
    updateSafetyPlan({ trustedContacts: safetyPlan.trustedContacts.filter((_, i) => i !== index) });
  };

  const triggerSaved = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleExportText = () => {
    const content = `MY PERSONAL SAFETY PLAN (PROJECT SANDIGAN)\n============================================\nSession ID: ${safetyPlan.anonymousId}\nLast Updated: ${new Date(safetyPlan.lastUpdated).toLocaleString()}\n\n1. MY WARNING SIGNS (Thoughts, physical cues, behaviors):\n${safetyPlan.warningSigns.map((w, i) => `  ${i + 1}. ${w}`).join('\n')}\n\n2. MY INTERNAL COPING STRATEGIES (Things I can do by myself):\n${safetyPlan.copingStrategies.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}\n\n3. MY TRUSTED CONTACTS (People I can reach out to):\n${safetyPlan.trustedContacts.map((t, i) => `  ${i + 1}. ${t.name} (${t.relationship}) - ${t.phone}`).join('\n')}\n\n4. MY SAFE PLACES (Locations where I feel calm and protected):\n${safetyPlan.safePlaces.map((p, i) => `  ${i + 1}. ${p}`).join('\n')}\n\n5. EMERGENCY CRISIS CONTACTS (When I cannot keep myself safe):\n  • National Center for Mental Health: 1553 (Toll-Free 24/7)\n  • Mariveles Mental Wellness Hospital (Bataan): (047) 935-4661\n  • Bataan General Hospital (Balanga): (047) 237-9770\n  • Philippine Emergency Line: 911\n\nRemember: "You don't have to carry it alone."`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `My-Safety-Plan-${safetyPlan.anonymousId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 px-3 py-1 rounded-full bg-sky-500/10 inline-block">
            Coordinated by GABAY (Crisis & Safeguarding Lead)
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
            My Personal Safety Plan
          </h1>
          <p
            className={`text-xs sm:text-sm mt-1 max-w-xl ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            A confidential step-by-step crisis buffer prepared ahead of time to keep you safe when emotional waves feel too intense.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportText}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Copy</span>
          </button>
          <button
            onClick={() => window.print()}
            className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Safety Plan saved locally to your device.</span>
        </div>
      )}

      {/* SECTION 1: WARNING SIGNS */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="border-b pb-3 dark:border-slate-800">
          <h3 className="text-base font-bold text-sky-600 dark:text-sky-400 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-500 text-xs flex items-center justify-center font-bold">1</span>
            <span>My Warning Signs</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Thoughts, feelings, physical cues, or behaviors showing me that a crisis might be starting.
          </p>
        </div>

        <div className="space-y-2">
          {safetyPlan.warningSigns.map((w, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span>• {w}</span>
              <button onClick={() => removeWarning(idx)} className="text-slate-400 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addWarning} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newWarning}
            onChange={e => setNewWarning(e.target.value)}
            placeholder="Add another warning sign..."
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs">
            Add
          </button>
        </form>
      </div>

      {/* SECTION 2: COPING STRATEGIES */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="border-b pb-3 dark:border-slate-800">
          <h3 className="text-base font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs flex items-center justify-center font-bold">2</span>
            <span>Internal Coping Strategies</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Things I can do by myself to take my mind off distress (breathing, walks, music).
          </p>
        </div>

        <div className="space-y-2">
          {safetyPlan.copingStrategies.map((c, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span>• {c}</span>
              <button onClick={() => removeCoping(idx)} className="text-slate-400 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addCoping} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newCoping}
            onChange={e => setNewCoping(e.target.value)}
            placeholder="Add a coping strategy..."
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs">
            Add
          </button>
        </form>
      </div>

      {/* SECTION 3: TRUSTED CONTACTS */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="border-b pb-3 dark:border-slate-800">
          <h3 className="text-base font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-500 text-xs flex items-center justify-center font-bold">3</span>
            <span>Trusted Contacts & People I Can Call</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            People who support me or whom I can talk to when I need a listening ear.
          </p>
        </div>

        <div className="space-y-2">
          {safetyPlan.trustedContacts.map((t, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <strong className="block text-slate-800 dark:text-slate-100">{t.name}</strong>
                <span className="text-[11px] text-slate-500">{t.relationship} • {t.phone}</span>
              </div>
              <button onClick={() => removeContact(idx)} className="text-slate-400 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addContact} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          <input
            type="text"
            value={newContactName}
            onChange={e => setNewContactName(e.target.value)}
            placeholder="Name..."
            className="text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
          />
          <input
            type="text"
            value={newContactRel}
            onChange={e => setNewContactRel(e.target.value)}
            placeholder="Relationship (e.g. Barkada)..."
            className="text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newContactPhone}
              onChange={e => setNewContactPhone(e.target.value)}
              placeholder="Phone number..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs">
              Add
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: SAFE PLACES */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="border-b pb-3 dark:border-slate-800">
          <h3 className="text-base font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-xs flex items-center justify-center font-bold">4</span>
            <span>Safe Environments & Settings</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Locations where I feel physically and emotionally grounded and secure.
          </p>
        </div>

        <div className="space-y-2">
          {safetyPlan.safePlaces.map((p, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span>• {p}</span>
              <button onClick={() => removePlace(idx)} className="text-slate-400 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addPlace} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newPlace}
            onChange={e => setNewPlace(e.target.value)}
            placeholder="Add a safe place..."
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs">
            Add
          </button>
        </form>
      </div>

      {/* SECTION 5: EMERGENCY CONTACTS */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
          isDarkMode ? 'bg-rose-950/20 border-rose-900/60' : 'bg-rose-50/50 border-rose-200'
        }`}
      >
        <div className="border-b pb-3 border-rose-200 dark:border-rose-900">
          <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 text-xs flex items-center justify-center font-bold">5</span>
            <span>Emergency Steps & Verified Professionals (24/7)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exact numbers to call if my safety feels at risk and internal coping is not enough.
          </p>
        </div>

        <div className="space-y-2 text-xs font-medium">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <strong className="block text-slate-800 dark:text-white">National Center for Mental Health Crisis Hotline</strong>
              <span className="text-[11px] text-slate-500">Toll-free via landline nationwide 24/7</span>
            </div>
            <a href="tel:1553" className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs">
              Call 1553
            </a>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <strong className="block text-slate-800 dark:text-white">Mariveles Mental Wellness Hospital (Bataan)</strong>
              <span className="text-[11px] text-slate-500">24/7 Acute Psychiatric Crisis & Triage</span>
            </div>
            <a href="tel:0479354661" className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs">
              Call (047) 935-4661
            </a>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <strong className="block text-slate-800 dark:text-white">Bataan General Hospital and Medical Center (Balanga)</strong>
              <span className="text-[11px] text-slate-500">24/7 Emergency Room</span>
            </div>
            <a href="tel:0472379770" className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-xs">
              Call (047) 237-9770
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
