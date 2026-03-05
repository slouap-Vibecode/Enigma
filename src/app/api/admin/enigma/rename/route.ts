import { NextRequest, NextResponse } from 'next/server';
import { readEnigmaData, writeEnigmaData, deleteEnigmaData } from '@/lib/fileUtils';
import { config } from '@/lib/config';

// Vérifier le token admin
function verifyToken(request: NextRequest): boolean {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  return token === config.token;
}

export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { oldName, newName } = await request.json();

    if (!oldName || !newName) {
      return NextResponse.json(
        { error: 'oldName and newName are required' },
        { status: 400 }
      );
    }

    if (oldName === newName) {
      return NextResponse.json({ success: true });
    }

    // Lire les données de l'ancienne énigme
    const enigmaData = readEnigmaData(oldName);
    if (!enigmaData) {
      return NextResponse.json(
        { error: 'Enigma not found' },
        { status: 404 }
      );
    }

    // Vérifier que le nouveau nom n'existe pas déjà
    const existingData = readEnigmaData(newName);
    if (existingData) {
      return NextResponse.json(
        { error: 'An enigma with this name already exists' },
        { status: 409 }
      );
    }

    // Créer la nouvelle énigme avec le nouveau nom
    const success = writeEnigmaData(newName, enigmaData);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create renamed enigma' },
        { status: 500 }
      );
    }

    // Supprimer l'ancienne énigme
    const deleted = deleteEnigmaData(oldName);
    if (!deleted) {
      // Rollback : supprimer la nouvelle énigme si on n'arrive pas à supprimer l'ancienne
      deleteEnigmaData(newName);
      return NextResponse.json(
        { error: 'Failed to delete old enigma' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error renaming enigma:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}