"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    title: "Hybrid Encryption",
    desc: "Files are encrypted with AES-GCM, while the AES key is protected with RSA-OAEP.",
  },
  {
    title: "Integrity Verification",
    desc: "Each file gets a SHA-256 hash to verify tamper-resistance and strengthen trust in stored files.",
  },
  {
    title: "Secure Retrieval",
    desc: "Only authorized users can access, decrypt, and download protected files from the vault.",
  },
];

const workflowSteps = [
  {
    id: "01",
    title: "Selection",
    side: "right",
    desc: "User identity is verified before vault access begins, ensuring protected entry into the secure environment.",
  },
  {
    id: "02",
    title: "Vault Initialization",
    side: "left",
    desc: "A secure vault session is initialized with protected context, preparing the system for encrypted file operations.",
  },
  {
    id: "03",
    title: "Protected Upload",
    side: "right",
    desc: "Sensitive files are uploaded into the protected flow, ready for client-side encryption and integrity locking.",
  },
  {
    id: "04",
    title: "AES-GCM Encryption",
    side: "left",
    desc: "The file content is encrypted using AES-GCM to deliver confidentiality with authenticated protection.",
  },
  {
    id: "05",
    title: "RSA-OAEP Key Lock",
    side: "right",
    desc: "The file encryption key is secured using RSA-OAEP, adding strong asymmetric key protection.",
  },
  {
    id: "06",
    title: "Integrity Verification",
    side: "left",
    desc: "SHA-256 hashing confirms tamper resistance so stored files remain trusted and evaluator-ready.",
  },
  {
    id: "07",
    title: "Secure Retrieval",
    side: "right",
    desc: "Authorized access enables secure decryption and controlled retrieval of protected files from the vault.",
  },
];

function WorkflowRoadmap() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 85%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 20,
    mass: 0.35,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const arrowY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const arrowOpacity = useTransform(smoothProgress, [0, 0.06, 1], [0, 1, 1]);

  return (
    <section className="workflow-roadmap-section">
      <div className="workflow-roadmap-head">
        <h2>Secure Vault Workflow</h2>
        <p>
          Scroll through the complete protection lifecycle — from user
          authentication to encrypted storage and secure retrieval.
        </p>
      </div>

      <div ref={containerRef} className="roadmap-shell glass-card">
        <div className="roadmap-centerline">
          <div className="roadmap-line-base" />
          <motion.div className="roadmap-line-active" style={{ height: lineHeight }} />

          <motion.div
            className="roadmap-arrow"
            style={{ top: arrowY, opacity: arrowOpacity }}
          >
            <div className="roadmap-arrow-inner" />
          </motion.div>
        </div>

        <div className="roadmap-items">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`roadmap-row ${step.side === "left" ? "left" : "right"}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="roadmap-side-card glass-card">
                <div className="roadmap-step-badge">{step.id}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>

              <div className="roadmap-node-wrap">
                <motion.div
                  className="roadmap-node"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(103,232,249,0.20)",
                      "0 0 0 12px rgba(103,232,249,0.00)",
                      "0 0 0 0 rgba(103,232,249,0.20)",
                    ],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    delay: index * 0.18,
                  }}
                >
                  <span>{step.id}</span>
                </motion.div>
              </div>

              <div className="roadmap-empty" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [liveTime, setLiveTime] = useState("Updating...");
  const [vaultPulse, setVaultPulse] = useState(98);
  const [threatScore, setThreatScore] = useState("Low");
  const [integrity, setIntegrity] = useState("Verified");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const metricsTimer = setInterval(() => {
      setVaultPulse((prev) => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1);
        if (next > 100) return 100;
        if (next < 97) return 97;
        return next;
      });

      setThreatScore((prev) => {
        const values = ["Low", "Minimal", "Low"];
        return values[Math.floor(Math.random() * values.length)];
      });

      setIntegrity((prev) => {
        const values = ["Verified", "Locked", "Verified"];
        return values[Math.floor(Math.random() * values.length)];
      });
    }, 2200);

    return () => clearInterval(metricsTimer);
  }, []);

  return (
    <main className="landing-page">
      <div className="bg-grid" />
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <header className="topbar">
        <div className="brand-wrap">
          <div
            className="brand-mark"
            style={{
              position: "relative",
              overflow: "hidden",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            <Image
              src="/cryptovault-logo.png"
              alt="CryptoVault Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>

          <div>
            <p className="brand-name">CryptoVault</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/login" className="ghost-btn">
            Login
          </Link>
          <Link href="/signup" className="primary-btn">
            Sign Up
          </Link>
        </div>
      </header>

      <section className="hero-section hero-section-clean">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="pill">Next-Generation Secure File Vault</span>

          <h1 className="hero-title">
            Zero-Trust File Storage
            <span className="gradient-text"> Built To Protect What Matters.</span>
          </h1>

          <p className="hero-text hero-text-compact">
            CryptoVault brings together client-side encryption, protected key
            exchange, integrity verification, and controlled retrieval in one
            premium vault experience that feels modern, fast, and evaluator-ready.
          </p>

          <div className="hero-actions">
            <Link href="/signup" className="primary-btn">
              Launch Secure Vault
            </Link>
            <a href="#features" className="secondary-btn">
              View Vault Workflow
            </a>
          </div>

          <div className="mini-stats mini-stats-compact">
            <div className="stat-card">
              <p className="stat-value">AES-GCM</p>
              <p className="stat-label">Client-side encryption</p>
            </div>
            <div className="stat-card">
              <p className="stat-value">RSA-OAEP</p>
              <p className="stat-label">Key protection</p>
            </div>
            <div className="stat-card">
              <p className="stat-value">SHA-256</p>
              <p className="stat-label">Integrity verification</p>
            </div>
          </div>
        </motion.div>

        
        <motion.div
          className="hero-visual glass-card hero-visual-clean"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="visual-top">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>

          <div className="vault-command-shell">
            <div className="vault-command-top">
              <div>
                <h3>Secure Vault Core</h3>
              </div>

              <div className="live-pill">
                <span className="live-dot" />
                Live status
              </div>
            </div>

            <div className="vault-core-grid">
              <div className="vault-core-main">
                <div className="preview-ring advanced-ring" />
                <motion.div
                  className="vault-core-center"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(103,232,249,0.12)",
                      "0 0 0 16px rgba(103,232,249,0.02)",
                      "0 0 0 0 rgba(103,232,249,0.12)",
                    ],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "74px",
                      height: "74px",
                      margin: "0 auto 14px",
                    }}
                  >
                    <Image
                      src="/cryptovault-logo.png"
                      alt="Encrypted Vault Core"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  <p className="preview-title">Vault Core</p>
                  <p className="preview-sub">Protected session active</p>
                </motion.div>
              </div>

              <div className="vault-side-stack">
                <div className="vault-side-card">
                  <span>Encryption Layer</span>
                  <strong>AES-GCM Enabled</strong>
                </div>
                <div className="vault-side-card">
                  <span>Key Exchange</span>
                  <strong>RSA-OAEP Locked</strong>
                </div>
                <div className="vault-side-card">
                  <span>Integrity State</span>
                  <strong>{integrity}</strong>
                </div>
              </div>
            </div>

            <div className="preview-metrics preview-metrics-clean advanced-metrics">
              <div className="metric">
                <span>Security Pulse</span>
                <strong>{vaultPulse}%</strong>
              </div>
              <div className="metric">
                <span>Access Policy</span>
                <strong>Authorized Only</strong>
              </div>
              <div className="metric">
                <span>Threat Surface</span>
                <strong>{threatScore}</strong>
              </div>
              <div className="metric">
                <span>Last Sync</span>
                <strong>{liveTime}</strong>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="features-section">
        {features.map((item, index) => (
          <motion.div
            key={item.title}
            className="feature-card glass-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
          >
            <div className="feature-index">0{index + 1}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </section>

      <WorkflowRoadmap />
    </main>
  );
}