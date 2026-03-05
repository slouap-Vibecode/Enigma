export interface EnigmaData {
  passwords: string[];
  reward: string;
}

export interface EnigmaFormData {
  [key: string]: string;
}

export interface EnigmaListItem {
  id: string;
  name: string;
}

export interface CreateEnigmaRequest {
  name: string;
  passwords: string[];
  reward: string;
}

export interface AdminConfig {
  token: string;
}