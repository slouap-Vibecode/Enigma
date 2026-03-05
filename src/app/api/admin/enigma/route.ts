import { NextRequest, NextResponse } from 'next/server';
import { writeEnigmaData, deleteEnigmaData, listEnigmas } from '@/lib/fileUtils';
import { config } from '@/lib/config';
import { CreateEnigmaRequest } from '@/types/enigma';

// Verify admin token
function verifyToken(request: NextRequest): boolean {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  return token === config.token;
}

export async function GET(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, passwords, reward }: CreateEnigmaRequest = await request.json();

    if (!name || !passwords || !reward) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Filter out empty passwords
    const filteredPasswords = passwords.filter(p => p.trim() !== '');

    if (filteredPasswords.length === 0) {
      return NextResponse.json(
        { error: 'At least one password is required' },
        { status: 400 }
      );
    }

    const enigmaData = {
      passwords: filteredPasswords,
      reward: reward.trim()
    };

    const success = writeEnigmaData(name, enigmaData);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to create enigma' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating enigma:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, passwords, reward }: CreateEnigmaRequest = await request.json();

    if (!name || !passwords || !reward) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Filter out empty passwords
    const filteredPasswords = passwords.filter(p => p.trim() !== '');

    if (filteredPasswords.length === 0) {
      return NextResponse.json(
        { error: 'At least one password is required' },
        { status: 400 }
      );
    }

    const enigmaData = {
      passwords: filteredPasswords,
      reward: reward.trim()
    };

    const success = writeEnigmaData(name, enigmaData);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update enigma' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating enigma:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing enigma id' },
        { status: 400 }
      );
    }

    const success = deleteEnigmaData(id);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Enigma not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting enigma:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}