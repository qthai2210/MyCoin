"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./json.module.css";

export default function ImportJsonPage() {
  const [fileName, setFileName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // In a real app, we would read the file content here
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!fileName) {
      setError("Please select a keystore file");
      return;
    }

    if (!password) {
      setError("Please enter the keystore password");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    // In a real app, we would import the wallet using the keystore file
    // For demo purposes, we'll just navigate to the dashboard
    router.push("/dashboard");
  };

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
          <h1 className={styles.heading}>Import JSON File</h1>
          <p className={styles.subtitle}>
            Import your existing wallet from a JSON keystore file
          </p>

          <form onSubmit={handleSubmit}>
            {/* File upload field */}
            <div className={styles.inputContainer}>
              <label htmlFor="keystoreFile" className={styles.label}>
                Keystore File (UTC / JSON)
              </label>
              <div className={styles.fileUpload}>
                <input
                  type="file"
                  id="keystoreFile"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <label htmlFor="keystoreFile" className={styles.fileLabel}>
                  {fileName ? fileName : "Choose File..."}
                </label>
              </div>
            </div>

            {/* Current Password field */}
            <div className={styles.inputContainer}>
              <label htmlFor="currentPassword" className={styles.label}>
                Keystore Password
              </label>
              <input
                id="currentPassword"
                type="password"
                placeholder="Enter the password for this keystore file"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.divider}></div>

            <p className={styles.sectionTitle}>
              Create a new wallet password (optional)
            </p>

            {/* New Password field */}
            <div className={styles.inputContainer}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Create a new password (optional)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* Confirm New Password field */}
            <div className={styles.inputContainer}>
              <label htmlFor="confirmNewPassword" className={styles.label}>
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className={styles.input}
              />
              <p className={styles.helperText}>
                Leave blank to keep using the same password as the keystore
                file.
              </p>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.divider}></div>

            <button type="submit" className={styles.importButton}>
              Import Wallet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
