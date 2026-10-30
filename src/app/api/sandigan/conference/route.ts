import { NextRequest, NextResponse } from 'next/server';
import { generateOfficerConferenceReply } from '@/lib/sandigan/ai-service';
import { AIOfficerId } from '@/types/sandigan';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { officerId, directive, transcriptSummary } = body;

    if (!directive || typeof directive !== 'string') {
      return NextResponse.json({ error: 'Valid directive is required.' }, { status: 400 });
    }

    const officer: AIOfficerId = officerId || 'amara';
    const reply = await generateOfficerConferenceReply(
      officer,
      directive.slice(0, 1000),
      transcriptSummary ? transcriptSummary.slice(0, 2000) : undefined
    );

    // Save message to Supabase ai_messages table if client is configured
    try {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        await supabase.from('ai_messages').insert([
          {
            sender_type: 'founder',
            sender_id: 'founder-01',
            sender_name: 'Emmanuel James C. Dela Cruz',
            recipient_id: officer,
            content: directive,
            context_meeting_id: 'founder-conference',
          },
          {
            sender_type: 'officer',
            sender_id: officer,
            sender_name: `${officer.toUpperCase()} (AI Officer)`,
            recipient_id: 'founder-01',
            content: reply,
            context_meeting_id: 'founder-conference',
          },
        ]);
      }
    } catch (e) {
      console.warn('Could not record AI message to Supabase:', e);
    }

    return NextResponse.json({
      success: true,
      officerId: officer,
      reply,
    });
  } catch (error: any) {
    console.error('Error in conference API endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process AI Officer conference communication.' },
      { status: 500 }
    );
  }
}
