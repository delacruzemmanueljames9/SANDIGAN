import { NextRequest, NextResponse } from 'next/server';
import { processSupportChat } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, consentGranted } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Valid message string is required.' }, { status: 400 });
    }

    // Limit message length for safety and data minimization
    const sanitizedMessage = message.slice(0, 1000);

    const result = await processSupportChat(sanitizedMessage, history || []);

    return NextResponse.json({
      success: true,
      data: result,
      consentStatus: Boolean(consentGranted),
    });
  } catch (error: any) {
    console.error('Error in AI support chat endpoint:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the support session.' },
      { status: 500 }
    );
  }
}
