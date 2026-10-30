import { NextRequest, NextResponse } from 'next/server';
import { processSandiganChat } from '@/lib/sandigan/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, mode, tone, language, preferredName, anonymousId, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Valid message is required.' }, { status: 400 });
    }

    const sanitizedMessage = message.slice(0, 1000);

    const result = await processSandiganChat({
      message: sanitizedMessage,
      mode: mode || 'listening',
      tone: tone || 'gentle',
      language: language || 'taglish',
      preferredName: preferredName || undefined,
      anonymousId: anonymousId || 'SAN-000000',
      history: history || [],
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in Sandigan chat endpoint:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the support session.' },
      { status: 500 }
    );
  }
}
