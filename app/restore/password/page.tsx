"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./restore.module.css";

export default function RestorePasswordPage() {
  const [recoveryMethod, setRecoveryMethod] = useState("phrase");
  const [recoveryInput, setRecoveryInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryInput.trim().length > 0 && password.trim().length > 0) {
      // In a real app, here we would validate and process the recovery
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
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
          <h1 className={styles.heading}>Restore your wallet</h1>
          <p className={styles.subtitle}>
            Enter your recovery information below
          </p>

          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${
                recoveryMethod === "phrase" ? styles.activeTab : ""
              }`}
              onClick={() => setRecoveryMethod("phrase")}
            >
              Recovery Phrase
            </button>
            <button
              className={`${styles.tabButton} ${
                recoveryMethod === "key" ? styles.activeTab : ""
              }`}
              onClick={() => setRecoveryMethod("key")}
            >
              Private Key
            </button>
            <button
              className={`${styles.tabButton} ${
                recoveryMethod === "file" ? styles.activeTab : ""
              }`}
              onClick={() => setRecoveryMethod("file")}
            >
              Keystore File
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formSection}>
              <label className={styles.label}>
                {recoveryMethod === "phrase" && "Recovery Phrase"}
                {recoveryMethod === "key" && "Private Key"}
                {recoveryMethod === "file" && "Keystore File"}
              </label>

              {recoveryMethod !== "file" ? (
                <textarea
                  className={styles.textArea}
                  placeholder={
                    recoveryMethod === "phrase"
                      ? "Enter your 12 or 24 word recovery phrase"
                      : "Enter your private key"
                  }
                  value={recoveryInput}
                  onChange={(e) => setRecoveryInput(e.target.value)}
                  rows={4}
                />
              ) : (
                <div className={styles.fileUploadContainer}>
                  <input
                    type="file"
                    id="keystoreFile"
                    className={styles.fileInput}
                    onChange={() => setRecoveryInput("file-selected")}
                  />
                  <label htmlFor="keystoreFile" className={styles.fileLabel}>
                    Select Keystore File
                  </label>
                </div>
              )}
            </div>

            <div className={styles.formSection}>
              <label className={styles.label}>Wallet Password</label>
              <div className={styles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.passwordInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.toggleButton}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {showPassword ? (
                      <path
                        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M2 2L22 22M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.divider}></div>

            <button
              type="submit"
              className={styles.restoreButton}
              disabled={
                recoveryInput.trim().length === 0 ||
                password.trim().length === 0
              }
            >
              Restore Wallet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
