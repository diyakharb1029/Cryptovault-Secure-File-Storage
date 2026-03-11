"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  decryptStoredFile,
  encryptFileForVault,
  generateVaultKeyPair,
} from "@/lib/crypto";
import {
  DemoUserProfile,
  EncryptedVaultRecord,
  deleteVaultItem,
  getDemoProfile,
  getVaultItems,
  saveDemoProfile,
  saveVaultItem,
} from "@/lib/storage";

type SessionUser = {
  name?: string;
  email?: string;
  password?: string;
  createdAt?: string;
};

export default function VaultPage() {
  const router = useRouter();

  const [session, setSession] = useState<SessionUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [profile, setProfile] = useState<DemoUserProfile | null>(null);
  const [vaultItems, setVaultItems] = useState<EncryptedVaultRecord[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("CryptoVault secure environment active and ready for encrypted file operations.");
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    const savedSession = localStorage.getItem("cryptovault-session");

    if (!savedSession) {
      router.push("/login");
      return;
    }

    try {
      const parsedSession: SessionUser = JSON.parse(savedSession);
      setSession(parsedSession);

      const existingProfile = getDemoProfile();
      const items = getVaultItems();

      setProfile(existingProfile);
      setVaultItems(items);

      if (existingProfile?.ownerName) {
        setName(existingProfile.ownerName);
      } else if (parsedSession?.name) {
        setName(parsedSession.name);
      }

      setAuthChecked(true);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("cryptovault-session");
      router.push("/login");
    }
  }, [router]);

  const totalSize = useMemo(() => {
    return vaultItems.reduce((sum, item) => sum + item.originalSize, 0);
  }, [vaultItems]);

  const latestFile = vaultItems[0];

  const securityScore = useMemo(() => {
    if (!profile) return 42;
    if (vaultItems.length === 0) return 78;
    return Math.min(98, 84 + vaultItems.length * 2);
  }, [profile, vaultItems.length]);

  const handleInitializeVault = async () => {
    try {
      setBusy("Initializing secure identity...");
      setMessage("Generating RSA key pair locally...");

      const ownerName =
        name.trim() || session?.name?.trim() || session?.email?.trim() || "Demo User";

      const keys = await generateVaultKeyPair();

      const newProfile: DemoUserProfile = {
        ownerName,
        publicKey: keys.publicKey,
        privateKey: keys.privateKey,
        createdAt: new Date().toISOString(),
      };

      saveDemoProfile(newProfile);
      setProfile(newProfile);
      setName(ownerName);
      setMessage(`Vault initialized for ${ownerName}. RSA keys generated successfully.`);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while creating the vault identity.");
    } finally {
      setBusy("");
    }
  };

  const handleFilePick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setSelectedFileName(file.name);

    try {
      setBusy(`Encrypting ${file.name}...`);
      setMessage("Generating AES key, encrypting file, protecting key with RSA...");

      const encryptedPayload = await encryptFileForVault(file, profile.publicKey);

      const newRecord: EncryptedVaultRecord = {
        id: crypto.randomUUID(),
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        originalSize: file.size,
        encryptedSize: encryptedPayload.encryptedData.length,
        encryptedData: encryptedPayload.encryptedData,
        encryptedAesKey: encryptedPayload.encryptedAesKey,
        iv: encryptedPayload.iv,
        sha256: encryptedPayload.sha256,
        uploadedAt: new Date().toISOString(),
      };

      saveVaultItem(newRecord);

      const updatedItems = getVaultItems();
      setVaultItems(updatedItems);
      setMessage(`File "${file.name}" encrypted and stored inside CryptoVault.`);
    } catch (error) {
      console.error(error);
      setMessage("Failed to encrypt the file. Try a smaller demo file.");
    } finally {
      setBusy("");
      event.target.value = "";
      setSelectedFileName("");
    }
  };

  const handleDownload = async (item: EncryptedVaultRecord) => {
    if (!profile) return;

    try {
      setBusy(`Decrypting ${item.fileName}...`);
      setMessage("Decrypting AES key with RSA and restoring original file...");

      const result = await decryptStoredFile(item, profile.privateKey);

      const blob = new Blob([result.fileBuffer], { type: item.fileType });
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = item.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
      setMessage(`Decryption successful. "${item.fileName}" downloaded securely.`);
    } catch (error) {
      console.error(error);
      setMessage("Decryption failed. The private key or encrypted data may be invalid.");
    } finally {
      setBusy("");
    }
  };

  const handleDelete = (id: string) => {
    deleteVaultItem(id);
    setVaultItems(getVaultItems());
    setMessage("Encrypted file removed from vault.");
  };

  const handleLogout = () => {
    localStorage.removeItem("cryptovault-session");
    router.push("/login");
  };

  if (!authChecked) {
    return (
      <main className="vault-shell loading-shell">
        <div className="animated-grid" />
        <div className="ambient-orb orb-one" />
        <div className="ambient-orb orb-two" />
        <div className="ambient-orb orb-three" />
        <div className="scanline" />

        <div className="loading-center">
          <motion.div
            className="loading-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading secure vault...</p>
        </div>

        <style jsx>{styles}</style>
      </main>
    );
  }

  return (
    <main className="vault-shell">
      <div className="animated-grid" />
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <div className="ambient-orb orb-three" />
      <div className="scanline" />

      <div className="vault-container">
        <motion.header
          className="topbar"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="brand-wrap">
            <motion.div
              className="brand-mark"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(76,201,240,0.18)",
                  "0 0 28px rgba(76,201,240,0.22)",
                  "0 0 0 rgba(76,201,240,0.18)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Image
                src="/cryptovault-logo.png"
                alt="CryptoVault Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </motion.div>

            <div>
              <p className="brand-name">CryptoVault</p>
              <p className="brand-sub">
                {session?.email ? `Signed in as ${session.email}` : "Secure File Storage Demo"}
              </p>
            </div>
          </div>

          <div className="topbar-actions">
            <Link href="/" className="ghost-btn">
              Back Home
            </Link>
            <button className="ghost-btn danger-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </motion.header>

        <motion.section
          className="hero-panel"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="hero-copy">
            <div className="eyebrow-row">
              <span className="pill premium">Live Secure Workspace</span>
            </div>

            <h1>
              CryptoVault <span>Secure Workspace</span>
            </h1>

            <p className="hero-text">
A secure file vault where encryption happens directly in your browser. 
CryptoVault protects files using hybrid cryptography and integrity verification before they are stored.
            </p>


            <motion.div
              className="message-bar"
              animate={{
                borderColor: busy
                  ? "rgba(76, 201, 240, 0.55)"
                  : "rgba(255,255,255,0.10)",
              }}
            >
              <span className={`status-dot ${busy ? "live" : ""}`} />
              <p>{busy || message}</p>
            </motion.div>
          </div>

          <div className="hero-right">
            <div className="hero-stat-card">
              <div className="hero-stat-grid">
                <StatCard label="Logged In User" value={session?.name || session?.email || "Authorized"} />
                <StatCard label="Vault Owner" value={profile?.ownerName || "Not initialized"} />
                <StatCard label="Stored Files" value={`${vaultItems.length}`} />
                <StatCard label="Total Size" value={formatBytes(totalSize)} />
              </div>

              <div className="security-meter-wrap">
                <div className="security-meter-head">
                  <span>Vault confidence score</span>
                  <strong>{securityScore}%</strong>
                </div>
                <div className="security-meter">
                  <motion.div
                    className="security-meter-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${securityScore}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {!profile ? (
          <motion.section
            className="glass-panel setup-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="section-title-wrap">
              <div>
                <p className="section-kicker">Setup</p>
                <h2>Initialize Secure Identity</h2>
                <p className="section-subtext">
                  Create a local vault owner profile and generate your RSA key pair.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Vault Owner Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <button
              className="primary-btn big-btn"
              onClick={handleInitializeVault}
              disabled={!!busy}
            >
              {busy ? "Please wait..." : "Generate Secure Vault Identity"}
            </button>
          </motion.section>
        ) : (
          <>
            <section className="content-grid">
              <motion.div
                className="glass-panel upload-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                <div className="section-title-wrap">
                  <div>
                    <p className="section-kicker">Ingestion</p>
                    <h2>Upload & Encrypt File</h2>
                    <p className="section-subtext">
                      Files are encrypted inside your browser before being stored in the vault.
                    </p>
                  </div>
                </div>

                <label className="upload-zone">
                  <input type="file" onChange={handleFilePick} disabled={!!busy} />
                  <motion.div
                    className="upload-zone-inner"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="upload-icon"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ⬆
                    </motion.div>
                    <h3>Drop file or click to upload</h3>
                    <p>Supported Formats: PDF, images, and text files (recommended under 2 MB).</p>
                    {selectedFileName && <span className="file-chip">{selectedFileName}</span>}
                  </motion.div>
                </label>

                <div className="crypto-badges">
                  <span>AES-GCM</span>
                  <span>RSA-OAEP</span>
                  <span>SHA-256</span>
                </div>
              </motion.div>

              <motion.div
                className="glass-panel insights-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.14 }}
              >
                <div className="section-title-wrap">
                  <div>
                    <p className="section-kicker">Security Model</p>
                    <h2>Vault Architecture</h2>
                    <p className="section-subtext">
                      CryptoVault combines modern cryptographic techniques to protect files before storage.
                    </p>
                  </div>
                </div>

                <div className="explain-list">
                  <ExplainItem
                    title="Client-side encryption"
                    body="Files are encrypted locally in the browser before they are stored in the vault."
                  />
                  <ExplainItem
                    title="Hybrid key protection"
                    body="AES encrypts the file data while RSA secures the encryption key."
                  />
                  <ExplainItem
                    title="Integrity verification"
                    body="SHA-256 hashing ensures that files remain unchanged and tamper-free."
                  />
                  <ExplainItem
                    title="Authorized retrieval"
                    body="Only the private key holder can decrypt and access protected files."
                  />
                </div>
              </motion.div>
            </section>

            <section className="lower-grid">
              <motion.section
                className="glass-panel telemetry-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
              >
                <div className="section-title-wrap">
                  <div>
                    <p className="section-kicker">Live Telemetry</p>
                    <h2>Vault Security Status</h2>
                  </div>
                </div>

                <div className="telemetry-grid">
                  <Telemetry label="Encryption Mode" value="Hybrid" />
                  <Telemetry label="Key Status" value={profile ? "Generated" : "Pending"} />
                  <Telemetry label="Last Activity" value={vaultItems.length ? "File stored" : "Idle"} />
                  <Telemetry label="Integrity Mode" value="SHA-256" />
                </div>

                <div className="telemetry-footer">
                  <div className="pulse-wrap">
                    <span className="pulse-dot" />
                    <span>Secure session active</span>
                  </div>
                  <span className="subtle-text">
                    {latestFile
                      ? `Latest item: ${latestFile.fileName}`
                      : "Waiting for first encrypted file"}
                  </span>
                </div>
              </motion.section>

              <motion.section
                className="glass-panel files-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22 }}
              >
                <div className="section-title-wrap">
                  <div>
                    <p className="section-kicker">Vault Records</p>
                    <h2>Encrypted Vault Records</h2>
                    <p className="section-subtext">
                      Files stored in the vault remain encrypted until authorized retrieval.
                    </p>
                  </div>
                </div>

                <AnimatePresence mode="popLayout">
                  {vaultItems.length === 0 ? (
                    <motion.div
                      className="empty-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="empty-icon"
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        🛡️
                      </motion.div>
                      <h3>No Encrypted Files Yet</h3>
                      <p>Upload a file to begin securing data with CryptoVault.</p>
                    </motion.div>
                  ) : (
                    <div className="file-list">
                      {vaultItems.map((item, index) => (
                        <motion.div
                          layout
                          key={item.id}
                          className="file-row"
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.3, delay: index * 0.04 }}
                        >
                          <div className="file-meta">
                            <div className="file-icon">{getFileEmoji(item.fileType)}</div>
                            <div>
                              <h3>{item.fileName}</h3>
                              <p>
                                Uploaded {formatDate(item.uploadedAt)} • {formatBytes(item.originalSize)}
                              </p>
                              <span className="hash-line">
                                SHA-256: {item.sha256.slice(0, 18)}...
                              </span>
                            </div>
                          </div>

                          <div className="file-actions">
                            <button
                              className="secondary-btn"
                              onClick={() => handleDownload(item)}
                              disabled={!!busy}
                            >
                              Decrypt & Download
                            </button>
                            <button
                              className="danger-btn"
                              onClick={() => handleDelete(item.id)}
                              disabled={!!busy}
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </motion.section>
            </section>
          </>
        )}
      </div>

      <style jsx>{styles}</style>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ExplainItem({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      className="explain-item"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.18 }}
    >
      <div className="explain-line" />
      <div>
        <strong>{title}</strong>
        <span>{body}</span>
      </div>
    </motion.div>
  );
}

function Telemetry({ label, value }: { label: string; value: string }) {
  return (
    <div className="telemetry-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getFileEmoji(fileType: string) {
  if (fileType.includes("image")) return "🖼️";
  if (fileType.includes("pdf")) return "📕";
  if (fileType.includes("text")) return "📝";
  return "📄";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

const styles = `
  .vault-shell {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background:
      radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.24), transparent 30%),
      radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.16), transparent 28%),
      radial-gradient(circle at 75% 75%, rgba(56, 189, 248, 0.10), transparent 24%),
      linear-gradient(180deg, #030816 0%, #041126 40%, #020712 100%);
    color: #f8fbff;
  }

  .vault-container {
    position: relative;
    z-index: 2;
    max-width: 1380px;
    margin: 0 auto;
    padding: 28px 24px 48px;
  }

  .animated-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent 92%);
    opacity: 0.35;
    animation: driftGrid 20s linear infinite;
  }

  .scanline {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 46%,
      rgba(83, 217, 255, 0.07) 50%,
      transparent 54%,
      transparent 100%
    );
    animation: scan 7.5s linear infinite;
    pointer-events: none;
    z-index: 1;
  }

  .ambient-orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(65px);
    opacity: 0.22;
    pointer-events: none;
    z-index: 0;
  }

  .orb-one {
    width: 320px;
    height: 320px;
    left: -70px;
    top: 70px;
    background: rgba(59, 130, 246, 0.55);
    animation: floatOrb 12s ease-in-out infinite;
  }

  .orb-two {
    width: 260px;
    height: 260px;
    right: 8%;
    top: 26%;
    background: rgba(16, 185, 129, 0.35);
    animation: floatOrb 14s ease-in-out infinite reverse;
  }

  .orb-three {
    width: 240px;
    height: 240px;
    right: 0;
    bottom: 10%;
    background: rgba(14, 165, 233, 0.34);
    animation: floatOrb 10s ease-in-out infinite;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 22px;
  }

  .brand-wrap {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .brand-mark {
    width: 58px;
    height: 58px;
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.12);
    background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.12),
      0 18px 50px rgba(2, 8, 23, 0.4);
    backdrop-filter: blur(16px);
  }

  .brand-name {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    margin: 0 0 4px;
  }

  .brand-sub {
    font-size: 0.98rem;
    color: rgba(223, 234, 255, 0.72);
    margin: 0;
  }

  .topbar-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .ghost-btn,
  .primary-btn,
  .secondary-btn,
  .danger-btn {
    appearance: none;
    border: none;
    outline: none;
    cursor: pointer;
    transition: 0.25s ease;
    font-weight: 700;
  }

  .ghost-btn {
    height: 50px;
    padding: 0 18px;
    border-radius: 16px;
    color: #eff7ff;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(12px);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ghost-btn:hover {
    transform: translateY(-2px);
    background: rgba(255,255,255,0.09);
    border-color: rgba(255,255,255,0.2);
  }

  .danger-ghost:hover {
    border-color: rgba(248, 113, 113, 0.4);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.16);
  }

  .hero-panel,
  .glass-panel {
    position: relative;
    overflow: hidden;
    border-radius: 30px;
    border: 1px solid rgba(255,255,255,0.08);
    background:
      linear-gradient(180deg, rgba(10, 24, 51, 0.76), rgba(4, 12, 28, 0.82)),
      rgba(255,255,255,0.03);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.08),
      0 24px 80px rgba(2, 8, 23, 0.45);
    backdrop-filter: blur(22px);
  }

  .hero-panel {
    display: grid;
    grid-template-columns: 1.35fr 0.95fr;
    gap: 22px;
    padding: 28px;
    margin-bottom: 22px;
  }

  .hero-panel::before,
  .glass-panel::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(255,255,255,0.06), transparent 36%, transparent 68%, rgba(45, 212, 191, 0.06));
    pointer-events: none;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .eyebrow-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  .pill,
  .tiny-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    font-weight: 700;
  }

  .pill {
    min-height: 34px;
    padding: 0 14px;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(129, 140, 248, 0.22);
    color: #e9f3ff;
    font-size: 0.92rem;
  }

  .premium {
    box-shadow: 0 0 24px rgba(59, 130, 246, 0.16);
  }

  .tiny-badge {
    min-height: 32px;
    padding: 0 12px;
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(231, 240, 255, 0.75);
    font-size: 0.84rem;
  }

  .hero-copy h1 {
    margin: 0;
    font-size: clamp(2.2rem, 5vw, 4rem);
    line-height: 0.98;
    font-weight: 850;
    letter-spacing: -0.05em;
    max-width: 740px;
  }

  .hero-copy h1 span {
    color: #8bd8ff;
    text-shadow: 0 0 22px rgba(76, 201, 240, 0.24);
  }

  .hero-text {
    margin: 16px 0 18px;
    max-width: 720px;
    font-size: 1.08rem;
    line-height: 1.75;
    color: rgba(225, 236, 255, 0.78);
  }

  .trust-strip {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }

  .trust-pill {
    min-height: 36px;
    padding: 0 14px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    color: #edf7ff;
    font-size: 0.88rem;
    font-weight: 700;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
  }

  .hero-right {
    display: flex;
    align-items: stretch;
  }

  .hero-stat-card {
    width: 100%;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.08);
    background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.035));
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .hero-stat-grid {
    display: grid;
    gap: 12px;
  }

  .status-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
    padding: 16px 18px;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.075);
    background: rgba(255,255,255,0.035);
  }

  .status-row span {
    color: rgba(219, 230, 252, 0.72);
    font-size: 0.95rem;
  }

  .status-row strong {
    color: #ffffff;
    font-size: 1rem;
    text-align: right;
    max-width: 58%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .security-meter-wrap {
    margin-top: 16px;
    padding-top: 6px;
  }

  .security-meter-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
    color: rgba(220, 232, 255, 0.76);
    font-size: 0.95rem;
  }

  .security-meter-head strong {
    color: #8fe3ff;
  }

  .security-meter {
    height: 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.07);
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.07);
  }

  .security-meter-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #22d3ee, #3b82f6, #34d399);
    box-shadow: 0 0 24px rgba(34, 211, 238, 0.35);
  }

  .message-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 58px;
    padding: 0 16px;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .message-bar p {
    margin: 0;
    color: rgba(232, 239, 255, 0.84);
  }

  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(255,255,255,0.35);
    box-shadow: 0 0 0 rgba(255,255,255,0.1);
    flex: 0 0 auto;
  }

  .status-dot.live {
    background: #22d3ee;
    box-shadow: 0 0 0 8px rgba(34, 211, 238, 0.08), 0 0 24px rgba(34, 211, 238, 0.4);
    animation: pulseLive 1.8s infinite;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    margin-bottom: 22px;
  }

  .lower-grid {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 22px;
  }

  .upload-card,
  .insights-card,
  .telemetry-card,
  .files-card,
  .setup-card {
    padding: 24px;
  }

  .section-title-wrap {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 20px;
  }

  .section-kicker {
    margin: 0 0 8px;
    font-size: 0.82rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #8fdfff;
    font-weight: 800;
  }

  .section-title-wrap h2 {
    margin: 0;
    font-size: 2rem;
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  .section-subtext {
    margin: 10px 0 0;
    color: rgba(224, 235, 255, 0.72);
    line-height: 1.7;
  }

  .upload-zone {
    display: block;
    cursor: pointer;
  }

  .upload-zone input {
    display: none;
  }

  .upload-zone-inner {
    position: relative;
    border-radius: 26px;
    min-height: 320px;
    display: grid;
    place-items: center;
    text-align: center;
    padding: 28px;
    border: 1px solid rgba(255,255,255,0.1);
    background:
      radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.16), transparent 35%),
      linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.025));
    overflow: hidden;
  }

  .upload-zone-inner::before {
    content: "";
    position: absolute;
    inset: -40%;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%);
    transform: translateX(-60%);
    animation: sweep 5.2s linear infinite;
  }

  .upload-icon {
    width: 76px;
    height: 76px;
    border-radius: 22px;
    display: grid;
    place-items: center;
    font-size: 2rem;
    background: rgba(255,255,255,0.085);
    border: 1px solid rgba(255,255,255,0.08);
    margin: 0 auto 18px;
    position: relative;
    z-index: 1;
  }

  .upload-zone-inner h3,
  .upload-zone-inner p,
  .file-chip {
    position: relative;
    z-index: 1;
  }

  .upload-zone-inner h3 {
    margin: 0;
    font-size: 1.9rem;
    letter-spacing: -0.04em;
  }

  .upload-zone-inner p {
    margin: 14px 0 0;
    color: rgba(228, 236, 255, 0.72);
    font-size: 1rem;
  }

  .file-chip {
    margin-top: 16px;
    display: inline-flex;
    min-height: 36px;
    align-items: center;
    padding: 0 14px;
    border-radius: 999px;
    background: rgba(34, 211, 238, 0.12);
    border: 1px solid rgba(34, 211, 238, 0.24);
    color: #bff6ff;
    font-weight: 700;
  }

  .crypto-badges {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 16px;
  }

  .crypto-badges span {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    padding: 0 14px;
    border-radius: 999px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.88rem;
    font-weight: 700;
  }

  .explain-list {
    display: grid;
    gap: 14px;
  }

  .explain-item {
    position: relative;
    display: grid;
    grid-template-columns: 4px 1fr;
    gap: 14px;
    align-items: stretch;
    padding: 16px;
    border-radius: 20px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.075);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
  }

  .explain-line {
    border-radius: 999px;
    background: linear-gradient(180deg, #22d3ee, #3b82f6);
    box-shadow: 0 0 24px rgba(34, 211, 238, 0.24);
  }

  .explain-item strong {
    display: block;
    margin-bottom: 6px;
    font-size: 1.05rem;
  }

  .explain-item span {
    display: block;
    color: rgba(223, 233, 252, 0.72);
    line-height: 1.7;
  }

  .telemetry-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .telemetry-box {
    padding: 18px;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
  }

  .telemetry-box span {
    display: block;
    color: rgba(218, 228, 250, 0.7);
    margin-bottom: 8px;
    font-size: 0.92rem;
  }

  .telemetry-box strong {
    display: block;
    font-size: 1.12rem;
  }

  .telemetry-footer {
    margin-top: 16px;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .pulse-wrap {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #ecf6ff;
    font-weight: 700;
  }

  .pulse-dot {
    width: 10px;
    height: 10px;
    background: #34d399;
    border-radius: 999px;
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.45);
    animation: pulseGreen 1.8s infinite;
  }

  .subtle-text {
    color: rgba(220, 230, 248, 0.7);
  }

  .file-list {
    display: grid;
    gap: 14px;
  }

  .file-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 18px;
    border-radius: 22px;
    border: 1px solid rgba(255,255,255,0.08);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03));
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .file-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .file-icon {
    width: 56px;
    height: 56px;
    flex: 0 0 auto;
    border-radius: 18px;
    display: grid;
    place-items: center;
    font-size: 1.6rem;
    background: rgba(255,255,255,0.065);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .file-meta h3 {
    margin: 0 0 6px;
    font-size: 1.08rem;
  }

  .file-meta p {
    margin: 0 0 6px;
    color: rgba(223, 234, 255, 0.72);
  }

  .hash-line {
    display: inline-flex;
    min-height: 30px;
    align-items: center;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 0.82rem;
    background: rgba(34, 211, 238, 0.08);
    border: 1px solid rgba(34, 211, 238, 0.16);
    color: #c7f9ff;
  }

  .file-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .secondary-btn,
  .danger-btn,
  .primary-btn {
    min-height: 46px;
    padding: 0 16px;
    border-radius: 14px;
  }

  .primary-btn {
    background: linear-gradient(135deg, #0ea5e9, #3b82f6);
    color: white;
    box-shadow: 0 14px 32px rgba(59, 130, 246, 0.28);
  }

  .primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 36px rgba(59, 130, 246, 0.34);
  }

  .big-btn {
    margin-top: 8px;
    min-height: 54px;
    width: 100%;
    font-size: 1rem;
  }

  .secondary-btn {
    background: rgba(255,255,255,0.07);
    color: #eff8ff;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .secondary-btn:hover {
    transform: translateY(-2px);
    background: rgba(255,255,255,0.1);
  }

  .danger-btn {
    background: rgba(239, 68, 68, 0.08);
    color: #ffd3d3;
    border: 1px solid rgba(239, 68, 68, 0.16);
  }

  .danger-btn:hover {
    transform: translateY(-2px);
    background: rgba(239, 68, 68, 0.12);
  }

  .secondary-btn:disabled,
  .danger-btn:disabled,
  .primary-btn:disabled,
  .ghost-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .empty-state {
    min-height: 300px;
    border-radius: 24px;
    border: 1px dashed rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.03);
    display: grid;
    place-items: center;
    text-align: center;
    padding: 28px;
  }

  .empty-icon {
    font-size: 2.4rem;
    margin-bottom: 8px;
  }

  .empty-state h3 {
    margin: 4px 0 8px;
    font-size: 2rem;
    letter-spacing: -0.04em;
  }

  .empty-state p {
    margin: 0;
    color: rgba(223, 234, 255, 0.7);
    max-width: 420px;
    line-height: 1.7;
  }

  .form-grid {
    display: grid;
    gap: 16px;
    margin-bottom: 18px;
  }

  .field {
    display: grid;
    gap: 10px;
  }

  .field label {
    color: rgba(229, 237, 255, 0.84);
    font-weight: 700;
  }

  .field input {
    width: 100%;
    height: 56px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    padding: 0 16px;
    color: white;
    font-size: 1rem;
    outline: none;
    transition: 0.25s ease;
  }

  .field input:focus {
    border-color: rgba(34, 211, 238, 0.35);
    box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.08);
  }

  .loading-shell {
    display: grid;
    place-items: center;
  }

  .loading-center {
    position: relative;
    z-index: 2;
    display: grid;
    place-items: center;
    gap: 18px;
  }

  .loading-ring {
    width: 60px;
    height: 60px;
    border-radius: 999px;
    border: 3px solid rgba(255,255,255,0.1);
    border-top-color: #22d3ee;
  }

  .loading-center p {
    color: rgba(232, 239, 255, 0.84);
    font-size: 1.05rem;
  }

  @keyframes driftGrid {
    0% { transform: translateY(0); }
    50% { transform: translateY(14px); }
    100% { transform: translateY(0); }
  }

  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  @keyframes floatOrb {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(18px, -18px, 0); }
  }

  @keyframes pulseLive {
    0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.32), 0 0 24px rgba(34, 211, 238, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0), 0 0 28px rgba(34, 211, 238, 0.22); }
    100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0), 0 0 24px rgba(34, 211, 238, 0.4); }
  }

  @keyframes pulseGreen {
    0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.42); }
    70% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
    100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
  }

  @keyframes sweep {
    0% { transform: translateX(-65%) rotate(8deg); }
    100% { transform: translateX(65%) rotate(8deg); }
  }

  @media (max-width: 1100px) {
    .hero-panel,
    .content-grid,
    .lower-grid {
      grid-template-columns: 1fr;
    }

    .hero-copy h1 {
      max-width: 100%;
    }
  }

  @media (max-width: 760px) {
    .vault-container {
      padding: 18px 14px 34px;
    }

    .topbar {
      flex-direction: column;
      align-items: stretch;
    }

    .topbar-actions {
      width: 100%;
      justify-content: space-between;
    }

    .brand-name {
      font-size: 1.55rem;
    }

    .hero-panel,
    .upload-card,
    .insights-card,
    .telemetry-card,
    .files-card,
    .setup-card {
      padding: 18px;
      border-radius: 24px;
    }

    .hero-copy h1 {
      font-size: 2.2rem;
    }

    .section-title-wrap h2 {
      font-size: 1.55rem;
    }

    .upload-zone-inner {
      min-height: 260px;
      padding: 22px;
    }

    .upload-zone-inner h3 {
      font-size: 1.45rem;
    }

    .telemetry-grid {
      grid-template-columns: 1fr;
    }

    .file-row {
      flex-direction: column;
      align-items: stretch;
    }

    .file-actions {
      width: 100%;
    }

    .secondary-btn,
    .danger-btn {
      width: 100%;
      justify-content: center;
    }

    .status-row {
      padding: 14px;
    }

    .status-row strong {
      max-width: 50%;
    }
  }
`;