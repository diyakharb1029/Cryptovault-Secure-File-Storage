"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const demoUser = {
      name: "Demo User",
      email: "demo@cryptovault.com",
      password: "CryptoVault@123",
      createdAt: new Date().toISOString(),
    };


    localStorage.setItem("cryptovault-user", JSON.stringify(demoUser));
    localStorage.setItem("cryptovault-session", JSON.stringify(demoUser));
    router.push("/vault");
  };


  return (
    <main className="landing-page">
      <div className="bg-grid" />
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <header className="topbar">
        <div className="brand-wrap">
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                overflow: "hidden",
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 10px 30px rgba(34,211,238,0.12)",
                flexShrink: 0,
              }}
            >
              <Image
                src="/cryptovault-logo.png"
                alt="CryptoVault Logo"
                width={34}
                height={34}
                style={{ objectFit: "contain" }}
                priority
              />
            </div>

            <div>
              <p className="brand-name">CryptoVault</p>
            </div>
          </Link>
        </div>

        <Link href="/" className="ghost-btn">
          Back Home
        </Link>
      </header>

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4px",
        }}
      >
        <div
          className="glass-card signup-shell"
          style={{
            display: "grid",
            gridTemplateColumns: "0.95fr 1.05fr",
            gap: "24px",
            padding: "24px",
            alignItems: "stretch",
          }}
        >
          <div
            className="signup-left-panel"
            style={{
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "radial-gradient(circle at top left, rgba(34,211,238,0.18), transparent 45%), rgba(255,255,255,0.03)",
              padding: "32px",
              minHeight: "540px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div>

              <h1
                style={{
                  fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                  lineHeight: 1.02,
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "14px",
                  maxWidth: "560px",
                  letterSpacing: "-0.03em",
                }}
              >
                Create a vault only you can open.
              </h1>

              <p
                style={{
                  color: "rgba(226,232,240,0.78)",
                  fontSize: "1.02rem",
                  lineHeight: 1.7,
                  maxWidth: "520px",
                  marginBottom: "10px",
                }}
              >
                Standard cloud storage protects servers. CryptoVault protects your data.
              </p>

              <div
                style={{
                  width: "80px",
                  height: "3px",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #7dd3fc, #67e8f9)",
                  marginTop: "18px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <div className="stat-card">
                <p className="stat-value">Only you control access</p>
                <p className="stat-label">Private keys stay with the vault owner.</p>
              </div>

              <div className="stat-card">
                <p className="stat-value">Encrypted before upload</p>
                <p className="stat-label">Your files are protected before the cloud sees them.</p>
              </div>

              <div className="stat-card">
                <p className="stat-value">Unreadable after a breach</p>
                <p className="stat-label">Compromised storage should not expose your data.</p>
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(6, 16, 35, 0.72)",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#67e8f9",
                marginBottom: "10px",
                fontWeight: 700,
              }}
            >
              Sign Up
            </p>

            <h2
              style={{
                fontSize: "2.25rem",
                color: "white",
                fontWeight: 800,
                marginBottom: "12px",
              }}
            >
              Create your account
            </h2>

            <p
              style={{
                color: "rgba(226,232,240,0.72)",
                marginBottom: "26px",
                lineHeight: 1.7,
              }}
            >
              Set up your CryptoVault identity in seconds.
            </p>

            <form onSubmit={handleSignup} style={{ display: "grid", gap: "18px" }}>
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Abhimanyu Kharb"
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                />
              </div>

              <button type="submit" className="primary-btn big-btn">
                Create Secure Account
              </button>
            </form>

            <p
              style={{
                marginTop: "22px",
                color: "rgba(226,232,240,0.72)",
                fontSize: "0.98rem",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                style={{
                  color: "#67e8f9",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}