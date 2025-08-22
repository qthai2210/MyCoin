/* eslint-disable @typescript-eslint/no-require-imports */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { tempWalletStorage } from "@/services/tempWalletStorage";
import { useWallet } from "@/context/WalletContext";
import styles from "./verify.module.css";

export default function VerifyPhrasePage() {
  const [mounted, setMounted] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<Record<number, string>>(
    {}
  );
  const [wordOptions, setWordOptions] = useState<Record<number, string[]>>({});
  const [positionsToVerify, setPositionsToVerify] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();
  const { createWallet, error: walletError } = useWallet();

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
    const phraseArray = tempData.passphrase.split(/\s+/);
    setRecoveryPhrase(phraseArray);

    // Select random positions from the phrase to verify (4 positions)
    const positions = selectRandomPositions(phraseArray.length, 4);
    setPositionsToVerify(positions);

    // Generate options for each position (one correct, two random)
    const options: Record<number, string[]> = {};
    positions.forEach((position) => {
      const correctWord = phraseArray[position];
      const otherWords = generateRandomWords(phraseArray, correctWord);

      // Shuffle the options
      options[position] = shuffleArray([
        correctWord,
        ...otherWords.slice(0, 2),
      ]);
    });

    setWordOptions(options);
  }, []);

  // Select random unique positions from the phrase
  const selectRandomPositions = (max: number, count: number): number[] => {
    const positions: number[] = [];
    while (positions.length < count) {
      const position = Math.floor(Math.random() * max);
      if (!positions.includes(position)) {
        positions.push(position);
      }
    }
    return positions;
  };

  // Generate random words that are different from the recovery phrase
  const generateRandomWords = (
    phrase: string[],
    excludeWord: string
  ): string[] => {
    // This is a simplified version - in a real app, you'd use a larger wordlist
    const wordList = [
      "abandon",
      "ability",
      "able",
      "about",
      "above",
      "absent",
      "absorb",
      "abstract",
      "absurd",
      "abuse",
      "access",
      "accident",
      "account",
      "accuse",
      "achieve",
      "acid",
      "acoustic",
      "acquire",
      "across",
      "act",
      "action",
      "actor",
      "actress",
      "actual",
      "adapt",
      "add",
      "addict",
      "address",
      "adjust",
      "admit",
      "adult",
      "advance",
      "zebra",
      "zero",
      "zone",
      "zoo",
    ];

    const result: string[] = [];
    while (result.length < 2) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      const word = wordList[randomIndex];
      if (
        !phrase.includes(word) &&
        word !== excludeWord &&
        !result.includes(word)
      ) {
        result.push(word);
      }
    }

    return result;
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleWordSelect = (position: number, word: string) => {
    setSelectedWords((prev) => ({
      ...prev,
      [position]: word,
    }));
  };

  const isWordSelected = (position: number, word: string) => {
    return selectedWords[position] === word;
  };

  const areAllWordsCorrect = () => {
    return positionsToVerify.every(
      (position) => selectedWords[position] === recoveryPhrase[position]
    );
  };

  const isAllSelected = () => {
    return positionsToVerify.every(
      (position) => selectedWords[position] !== undefined
    );
  };

  const handleSubmit = async () => {
    if (!areAllWordsCorrect()) {
      setError(
        "The selected words don't match your recovery phrase. Please try again."
      );
      return;
    }

    // Get temporary wallet data
    const tempData = tempWalletStorage.retrieve();

    if (!tempData) {
      setError(
        "No wallet data found. Please restart the wallet creation process."
      );
      return;
    }

    setIsCreating(true);

    try {
      // Now create the actual wallet with the API
      await createWallet(tempData.userId, tempData.passphrase);

      // Clear the temporary data
      tempWalletStorage.clear();

      // Navigate to the dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to create wallet:", err);
      setError("Failed to create wallet. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.card}></div>
      </div>
    );
  }

  if (error || walletError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>Error</h2>
          <p>{error || walletError}</p>
          <Link href="/create/success" className={styles.errorButton}>
            Back to Recovery Phrase
          </Link>
        </div>
      </div>
    );
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

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Link href="/create/success" className={styles.backButton}>
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
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>Let&apos;s verify your phrase</h1>
          <p className={styles.subtitle}>
            Select the correct words from your recovery phrase
          </p>

          {positionsToVerify
            .sort((a, b) => a - b)
            .map((position) => (
              <div key={position} className={styles.verifySection}>
                <p className={styles.selectPrompt}>
                  Select word #{position + 1}
                </p>
                <div className={styles.wordOptions}>
                  {wordOptions[position]?.map((word) => (
                    <button
                      key={word}
                      className={`${styles.wordButton} ${
                        isWordSelected(position, word) ? styles.selected : ""
                      }`}
                      onClick={() => handleWordSelect(position, word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          <button
            className={`${styles.nextButton} ${
              isAllSelected() ? "" : styles.disabled
            }`}
            onClick={handleSubmit}
            disabled={!isAllSelected() || isCreating}
          >
            {isCreating ? "Creating Wallet..." : "Create Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
}
