import { EncryptedVaultRecord } from "@/lib/storage";

type EncryptedPayload = {
  encryptedData: string;
  encryptedAesKey: string;
  iv: string;
  sha256: string;
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateVaultKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKeyBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: arrayBufferToBase64(publicKeyBuffer),
    privateKey: arrayBufferToBase64(privateKeyBuffer),
  };
}

async function importPublicKey(publicKeyBase64: string) {
  return crypto.subtle.importKey(
    "spki",
    base64ToArrayBuffer(publicKeyBase64),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

async function importPrivateKey(privateKeyBase64: string) {
  return crypto.subtle.importKey(
    "pkcs8",
    base64ToArrayBuffer(privateKeyBase64),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
}

export async function encryptFileForVault(
  file: File,
  publicKeyBase64: string
): Promise<EncryptedPayload> {
  const fileBuffer = await file.arrayBuffer();
  const publicKey = await importPublicKey(publicKeyBase64);

  const aesKey = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    aesKey,
    fileBuffer
  );

  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);

  const encryptedAesKeyBuffer = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    rawAesKey
  );

  const sha256 = await sha256Hex(fileBuffer);

  return {
    encryptedData: arrayBufferToBase64(encryptedBuffer),
    encryptedAesKey: arrayBufferToBase64(encryptedAesKeyBuffer),
    iv: arrayBufferToBase64(iv.buffer),
    sha256,
  };
}

export async function decryptStoredFile(
  item: EncryptedVaultRecord,
  privateKeyBase64: string
) {
  const privateKey = await importPrivateKey(privateKeyBase64);

  const decryptedAesKeyBuffer = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    base64ToArrayBuffer(item.encryptedAesKey)
  );

  const aesKey = await crypto.subtle.importKey(
    "raw",
    decryptedAesKeyBuffer,
    {
      name: "AES-GCM",
    },
    false,
    ["decrypt"]
  );

  const fileBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(base64ToArrayBuffer(item.iv)),
    },
    aesKey,
    base64ToArrayBuffer(item.encryptedData)
  );

  return {
    fileBuffer,
  };
}