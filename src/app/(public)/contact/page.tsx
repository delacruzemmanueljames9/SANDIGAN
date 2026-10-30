'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, HeartHandshake } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tk-deepblue bg-tk-lightblue/60 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Connect with Tinig KaBataan
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Have questions, partnership inquiries, or interested in launching a student chapter? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold">Secretariat & Secretariat Desk</h3>
              <p className="text-xs text-slate-400 mt-1">
                Serving youth organizations nationwide.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-tk-lavender shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-200">Email Inquiries:</span>
                  <a href="mailto:contact@tinigkabataan.org" className="text-tk-lightblue hover:underline">
                    contact@tinigkabataan.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-200">National Headquarters:</span>
                  <span className="text-slate-400">Metro Manila, Philippines (with regional chapters nationwide)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <HeartHandshake className="w-4 h-4" />
              <span>In Urgent Crisis?</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Do not wait for a contact form reply. Call the 24/7 National Center for Mental Health Crisis Hotline at <strong className="text-white">1553</strong> (Toll-Free).
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          {sent ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Message Dispatched!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for reaching out to Tinig KaBataan. Our secretariat will review your inquiry and respond within 24-48 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Juan dela Cruz"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tk-deepblue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. juan@university.edu.ph"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tk-deepblue"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tk-deepblue"
                >
                  <option value="General Inquiry">General Organization Inquiry</option>
                  <option value="Campus Partnership">Campus / University Partnership</option>
                  <option value="Editorial Submission">Editorial Article / Publication Inquiry</option>
                  <option value="Volunteer Application">Volunteer / Officer Application</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can we collaborate or assist you?"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tk-deepblue"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow-md transition"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
