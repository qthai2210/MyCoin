"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./success.module.css";
import { generateRecoveryPhrase } from "@/utils/phraseGenerator";

export default function SecretRecoveryPhrasePage() {
  const [recoveryPhrase, setRecoveryPhrase] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Generate a 12-word recovery phrase
    const phrase = generateRecoveryPhrase(12);
    setRecoveryPhrase(phrase);

    // In a real app, we would store this securely
    // For demo purposes, we'll use sessionStorage
    sessionStorage.setItem("recoveryPhrase", JSON.stringify(phrase));
  }, []);

  const handleNext = () => {
    router.push("/create/verify");
  };

  // Return a loading state or empty div during SSR to avoid hydration issues
  if (!mounted) {
    return <div className={styles.container}></div>;
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
            This is the recovery phase for your wallet. You and you alone have
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
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
