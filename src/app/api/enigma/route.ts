import { NextRequest, NextResponse } from 'next/server';
import { listEnigmas } from '@/lib/fileUtils';

export async function GET() {
  try {
    const enigmas = listEnigmas();
    return NextResponse.json({ enigmas });
  } catch (error) {
    console.error('Error listing enigmas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}