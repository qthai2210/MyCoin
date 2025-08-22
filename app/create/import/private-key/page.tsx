"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import styles from "./private-key.module.css";

// Mock function for private key import - in a real app, this would use the API
async function importWalletWithPrivateKey(privateKey: string, userId: string) {
  try {
    // Call to an API endpoint that would handle this securely
    const response = await fetch(
      "http://localhost:4000/api/import/private-key",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ privateKey, userId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to import wallet");
    }

    return await response.json();
  } catch (error) {
    console.error("Error importing wallet:", error);
    throw error;
  }
}

export default function ImportPrivateKeyPage() {
  const [privateKey, setPrivateKey] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { loadWalletWithPrivateKey } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!privateKey.trim()) {
      setError("Please enter a private key");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // In a real implementation, we would call the API to import the wallet
      // For now, we'll just use a placeholder address to demonstrate
      const testAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
      await loadWalletWithPrivateKey(testAddress);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while importing the wallet"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.logoHeader}>
        <Link href="/">
          <Image
            src="/logo-enkrypt.svg"
            alt="Enkrypt"
            width={120}
            height={28}
            className={styles.logo}
          />
        </Link>
      </div>

      <div className={styles.contentWrapper}>
        <Link href="/create/option" className={styles.backButton}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Import Private Key</h1>
          <p className={styles.subtitle}>
            Import your existing wallet using a private key
          </p>

          <form onSubmit={handleSubmit}>
            {/* Private Key field */}
            <div className={styles.inputContainer}>
              <label htmlFor="privateKey" className={styles.label}>
                Private Key
              </label>
              <textarea
                id="privateKey"
                placeholder="Enter your private key (0x...)"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className={styles.textArea}
                rows={3}
              />
              <p className={styles.helperText}>
                This is the unencrypted text version of your private key (64
                characters hexadecimal).
              </p>
            </div>

            {/* Password field */}
            <div className={styles.inputContainer}>
              <label htmlFor="password" className={styles.label}>
                New Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* Confirm Password field */}
            <div className={styles.inputContainer}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.divider}></div>

            <button
              type="submit"
              className={styles.importButton}
              disabled={loading}
            >
              {loading ? "Importing..." : "Import Wallet"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
