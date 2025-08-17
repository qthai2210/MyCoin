"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./verify.module.css";
import { generateRecoveryPhrase } from "@/utils/phraseGenerator";

export default function VerifyPhrasePage() {
  const [recoveryPhrase, setRecoveryPhrase] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedWords, setSelectedWords] = useState<Record<number, string>>(
    {}
  );
  const [wordOptions, setWordOptions] = useState<Record<number, string[]>>({});
  const [positionsToVerify, setPositionsToVerify] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // In a real app, we would retrieve the saved phrase
    let phrase: string[] = [];

    try {
      // Try to get the phrase from session storage
      const storedPhrase = sessionStorage.getItem("recoveryPhrase");
      if (storedPhrase) {
        phrase = JSON.parse(storedPhrase);
      } else {
        // Fallback to generating a new phrase if not found
        phrase = generateRecoveryPhrase(12);
      }
    } catch (e) {
      // If there's any error, generate a new phrase as fallback
      phrase = generateRecoveryPhrase(12);
    }

    setRecoveryPhrase(phrase);

    // Select 4 random positions from the 12-word phrase
    const positions = selectRandomPositions(phrase.length, 4);
    setPositionsToVerify(positions);

    // Generate options for each position (one correct, two random)
    const options: Record<number, string[]> = {};
    positions.forEach((position) => {
      const correctWord = phrase[position];
      const otherWords = generateRandomWords(phrase, correctWord);

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
    const wordList = require("@/utils/phraseGenerator").wordList;
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

  const handleNext = () => {
    if (areAllWordsCorrect()) {
      router.push("/dashboard");
    } else {
      // Show error if words don't match
      alert(
        "The selected words don't match your recovery phrase. Please try again."
      );
    }
  };

  if (!mounted || recoveryPhrase.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.card}></div>
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
          <h1 className={styles.title}>Let's double check it</h1>
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
            onClick={handleNext}
            disabled={!isAllSelected()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
