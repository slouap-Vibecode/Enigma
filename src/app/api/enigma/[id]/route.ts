import { NextRequest, NextResponse } from 'next/server';
import { readEnigmaData } from '@/lib/fileUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enigmaData = readEnigmaData(id);

    if (!enigmaData) {
      return NextResponse.json(
        { error: 'Enigma not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(enigmaData);
  } catch (error) {
    console.error('Error fetching enigma:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}