export type DemoUserProfile = {
  ownerName: string;
  publicKey: string;
  privateKey: string;
  createdAt: string;
};

export type EncryptedVaultRecord = {
  id: string;
  fileName: string;
  fileType: string;
  originalSize: number;
  encryptedSize: number;
  encryptedData: string;
  encryptedAesKey: string;
  iv: string;
  sha256: string;
  uploadedAt: string;
};

const PROFILE_KEY = "cryptovault_profile";
const FILES_KEY = "cryptovault_files";

export function getDemoProfile(): DemoUserProfile | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDemoProfile(profile: DemoUserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getVaultItems(): EncryptedVaultRecord[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(FILES_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveVaultItem(item: EncryptedVaultRecord) {
  if (typeof window === "undefined") return;

  const items = getVaultItems();
  const updated = [item, ...items];
  localStorage.setItem(FILES_KEY, JSON.stringify(updated));
}

export function deleteVaultItem(id: string) {
  if (typeof window === "undefined") return;

  const items = getVaultItems();
  const updated = items.filter((item) => item.id !== id);
  localStorage.setItem(FILES_KEY, JSON.stringify(updated));
}