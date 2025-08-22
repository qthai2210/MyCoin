"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { tempWalletStorage } from "@/services/tempWalletStorage";
import styles from "./success.module.css";

export default function SecretRecoveryPhrasePage() {
  const [mounted, setMounted] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // Get temporary wallet data
    const tempData = tempWalletStorage.retrieve();

    if (!tempData) {
      setError(
        "No wallet data found. Please restart the wallet creation process."
      );
      return;
    }

    // Split the passphrase into words
    setRecoveryPhrase(tempData.passphrase.split(/\s+/));
  }, []);

  const handleNext = () => {
    router.push("/create/verify");
  };

  // Return a loading state or empty div during SSR to avoid hydration issues
  if (!mounted) {
    return <div className={styles.container}></div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>Error</h2>
          <p>{error}</p>
          <Link href="/create/password" className={styles.errorButton}>
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Link href="/create/password" className={styles.backButton}>
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
          <div className={styles.logo}>
            <Image
              src="/logo-enkrypt.svg"
              alt="Enkrypt"
              width={120}
              height={28}
            />
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>Secret recovery phrase</h1>

          <p className={styles.description}>
            This is the recovery phrase for your wallet. You and you alone have
            access to it. It can be used to restore your wallet.
          </p>

          <p className={styles.warning}>
            Best practices for your recovery phrase are to write it down on
            paper and store it somewhere secure. Resist temptation to email it
            to yourself or screenshot it.
          </p>

          <div className={styles.phraseGrid}>
            {recoveryPhrase.map((word, index) => (
              <div key={index} className={styles.phraseItem}>
                <span className={styles.phraseNumber}>{index + 1}</span>
                <span className={styles.phraseWord}>{word}</span>
              </div>
            ))}
          </div>

          <button className={styles.nextButton} onClick={handleNext}>
            I've written it down
          </button>
        </div>
      </div>
    </div>
  );
}
