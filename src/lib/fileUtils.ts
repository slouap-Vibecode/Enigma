import fs from 'fs';
import path from 'path';
import { EnigmaData } from '@/types/enigma';

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
export function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read enigma data from JSON file
export function readEnigmaData(id: string): EnigmaData | null {
  try {
    ensureDataDir();
    const filePath = path.join(dataDir, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as EnigmaData;
  } catch (error) {
    console.error('Error reading enigma data:', error);
    return null;
  }
}

// Write enigma data to JSON file
export function writeEnigmaData(id: string, data: EnigmaData): boolean {
  try {
    ensureDataDir();
    const filePath = path.join(dataDir, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing enigma data:', error);
    return false;
  }
}

// Delete enigma file
export function deleteEnigmaData(id: string): boolean {
  try {
    ensureDataDir();
    const filePath = path.join(dataDir, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting enigma data:', error);
    return false;
  }
}

// List all enigma files
export function listEnigmas(): string[] {
  try {
    ensureDataDir();
    const files = fs.readdirSync(dataDir);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => path.basename(file, '.json'));
  } catch (error) {
    console.error('Error listing enigmas:', error);
    return [];
  }
}