import { NextRequest, NextResponse } from 'next/server';
import { processHQAssistant } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assistantType, query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Valid query string is required.' }, { status: 400 });
    }

    const validTypes = ['research', 'editorial', 'creative', 'coordination', 'librarian'] as const;
    const type = validTypes.includes(assistantType) ? assistantType : 'coordination';

    const result = await processHQAssistant(type, query.slice(0, 1500));

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in HQ Assistant endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
