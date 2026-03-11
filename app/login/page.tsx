"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const demoUser = {
      name: "Demo User",
      email: "demo@cryptovault.com",
      password: "CryptoVault@123",
      createdAt: new Date().toISOString(),
    };

    if (email === demoUser.email && password === demoUser.password) {
      localStorage.setItem("cryptovault-user", JSON.stringify(demoUser));
      localStorage.setItem("cryptovault-session", JSON.stringify(demoUser));
      router.push("/vault");
    } else {
      alert("Invalid demo credentials.");
    }
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
          padding: "24px",
        }}
      >
        <div
          className="glass-card login-shell"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            padding: "24px",
            alignItems: "stretch",
          }}
        >
          <div
            className="login-left-panel"
            style={{
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: `
                radial-gradient(circle at 20% 18%, rgba(96,165,250,0.30), transparent 30%),
                radial-gradient(circle at 82% 78%, rgba(34,211,238,0.18), transparent 26%),
                linear-gradient(145deg, rgba(21,38,79,0.96), rgba(6,14,34,0.94))
              `,
              padding: "48px",
              minHeight: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.05), 0 30px 80px rgba(2,6,23,0.45)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                opacity: 0.07,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "-70px",
                right: "-50px",
                width: "240px",
                height: "240px",
                borderRadius: "999px",
                background: "rgba(103,232,249,0.12)",
                filter: "blur(55px)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "-90px",
                left: "-30px",
                width: "220px",
                height: "220px",
                borderRadius: "999px",
                background: "rgba(59,130,246,0.16)",
                filter: "blur(55px)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "560px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p
                className="pill"
                style={{
                  display: "inline-flex",
                  marginBottom: "22px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e2e8f0",
                  backdropFilter: "blur(8px)",
                }}
              >
                Welcome back
              </p>

              <h1
                style={{
                  fontSize: "clamp(2.7rem, 4.2vw, 4rem)",
                  lineHeight: 1.02,
                  fontWeight: 800,
                  color: "white",
                  maxWidth: "700px",
                  letterSpacing: "-0.045em",
                  margin: 0,
                }}
              >
                Your files should belong to you.
              </h1>

              <p
                style={{
                  marginTop: "22px",
                  maxWidth: "520px",
                  color: "rgba(226,232,240,0.8)",
                  fontSize: "1.04rem",
                  lineHeight: 1.8,
                  marginBottom: 0,
                }}
              >
                Enter your credentials to access the protected vault dashboard.
              </p>
            </div>
          </div>

          <div
            style={{
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(6, 16, 35, 0.72)",
              padding: "26px",
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
              Login
            </p>

            <h2
              style={{
                fontSize: "2.25rem",
                color: "white",
                fontWeight: 800,
                marginBottom: "24px",
              }}
            >
              Sign in to CryptoVault
            </h2>

            <form onSubmit={handleLogin} style={{ display: "grid", gap: "18px" }}>
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
                  placeholder="Enter password"
                />
              </div>

              <button type="submit" className="primary-btn big-btn">
                Login Securely
              </button>
            </form>

            <p
              style={{
                marginTop: "22px",
                color: "rgba(226,232,240,0.72)",
                fontSize: "0.98rem",
              }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                style={{
                  color: "#67e8f9",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}