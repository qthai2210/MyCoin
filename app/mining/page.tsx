"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import Link from "next/link";
import styles from "./mining.module.css";
import { Transaction } from "@/services/api";

export default function MiningPage() {
  const {
    wallet,
    walletStats,
    miningStatus,
    getMiningStatus,
    setMiningAddress,
    setMiningDifficulty,
    startMining,
    stopMining,
    mineBlock,
    isLoading,
    error,
    transactions,
    refreshWalletStats,
    loadTransactionHistory,
  } = useWallet();

  const [customAddress, setCustomAddress] = useState("");
  const [difficulty, setDifficulty] = useState<number>(4);
  const [miningResult, setMiningResult] = useState<any>(null);
  const [operationMessage, setOperationMessage] = useState("");
  const [miningApiAvailable, setMiningApiAvailable] = useState<boolean | null>(
    null
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDifficultyChanged, setIsDifficultyChanged] = useState(false);
  const [showDifficultyInfo, setShowDifficultyInfo] = useState(false);

  // Filter mining transactions
  const miningTransactions = transactions.filter(
    (tx) => tx.type === "MINING_REWARD" || tx.fromAddress === null
  );

  // Fix: Remove getMiningStatus from the dependency array to prevent infinite loop
  useEffect(() => {
    const checkMiningAPI = async () => {
      try {
        await getMiningStatus();
        setMiningApiAvailable(true);
        setLocalError(null);

        // Also load wallet stats and transaction history when checking mining API
        if (wallet?.address) {
          await refreshWalletStats();
          await loadTransactionHistory();
        }
      } catch (err) {
        setMiningApiAvailable(false);
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setLocalError(errorMsg);
      }
    };

    checkMiningAPI();
    // Only run on mount
  }, []);

  useEffect(() => {
    if (miningStatus?.difficulty) {
      setDifficulty(miningStatus.difficulty);
    }
  }, [miningStatus]);

  const handleSetMiningAddress = async () => {
    try {
      const addressToUse = customAddress || wallet?.address;
      if (!addressToUse) {
        setOperationMessage("No address provided");
        return;
      }
      await setMiningAddress(addressToUse);
      setOperationMessage("Mining address set successfully!");
      setTimeout(() => setOperationMessage(""), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setOperationMessage(`Error: ${errorMsg}`);
      setTimeout(() => setOperationMessage(""), 5000);
    }
  };

  const handleSetDifficulty = async () => {
    try {
      await setMiningDifficulty(difficulty);
      setOperationMessage("Mining difficulty updated successfully!");
      setIsDifficultyChanged(false);
      setTimeout(() => setOperationMessage(""), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setOperationMessage(`Error: ${errorMsg}`);
      setTimeout(() => setOperationMessage(""), 5000);
    }
  };

  // Add the missing setDifficultyPreset function
  const setDifficultyPreset = (level: "easy" | "medium" | "hard") => {
    switch (level) {
      case "easy":
        setDifficulty(2);
        break;
      case "medium":
        setDifficulty(4);
        break;
      case "hard":
        setDifficulty(6);
        break;
    }
    setIsDifficultyChanged(true);
  };

  const handleStartMining = async () => {
    try {
      await startMining();
      setOperationMessage("Mining started successfully!");
      setTimeout(() => setOperationMessage(""), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";

      // Check for specific internal server error
      if (errorMsg.includes("Internal Server Error")) {
        setOperationMessage(
          "Failed to start mining: Server error. The mining node might be unavailable or experiencing issues."
        );
      } else {
        setOperationMessage(`Error: ${errorMsg}`);
      }

      // Show error message for longer time
      setTimeout(() => setOperationMessage(""), 8000);
    }
  };

  const handleStopMining = async () => {
    try {
      await stopMining();
      setOperationMessage("Mining stopped successfully!");
      setTimeout(() => setOperationMessage(""), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setOperationMessage(`Error: ${errorMsg}`);
      setTimeout(() => setOperationMessage(""), 5000);
    }
  };

  const handleMineBlock = async () => {
    try {
      setMiningResult(null);
      const addressToUse = customAddress || wallet?.address;
      if (!addressToUse) {
        setOperationMessage("No address provided for mining rewards");
        return;
      }

      setOperationMessage("Mining a block... Please wait.");
      const result = await mineBlock(addressToUse);
      setMiningResult(result);
      setOperationMessage("Block mined successfully!");

      // Refresh wallet stats and transactions to see mining rewards
      if (wallet?.address) {
        await refreshWalletStats();
        await loadTransactionHistory();
      }

      setTimeout(() => setOperationMessage(""), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setOperationMessage(`Error: ${errorMsg}`);
      setTimeout(() => setOperationMessage(""), 5000);
    }
  };

  // Show the mining API not available message
  if (miningApiAvailable === false) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>
            <svg
              className={styles.pageTitleIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 10L4.5 20.5M18 14l1.5-1.5M14 4l-4.5 4.5M21 8l-2 2m-9-6l6 6" />
            </svg>
            Cryptocurrency Mining
          </h1>
          <Link href="/dashboard" className={styles.backLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </header>

        <div className={styles.notAvailableCard}>
          <div className={styles.notAvailableIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className={styles.notAvailableTitle}>
            Mining Features Not Available
          </h2>
          <p className={styles.notAvailableMessage}>
            {localError?.includes("not implemented")
              ? "The mining feature appears to not be implemented on the server yet."
              : "Cannot connect to the mining API."}
          </p>
          <div className={styles.notAvailableDetails}>
            <p>This could be due to:</p>
            <ul className={styles.notAvailableList}>
              <li>
                The mining endpoints are not yet implemented in the backend API
              </li>
              <li>The backend server is not running or is unreachable</li>
              <li>There is a network connectivity issue</li>
            </ul>
          </div>
          <div className={styles.notAvailableActions}>
            <button
              onClick={() => {
                setMiningApiAvailable(null);
                getMiningStatus().catch((err) => {
                  setMiningApiAvailable(false);
                  const errorMsg =
                    err instanceof Error ? err.message : "Unknown error";
                  setLocalError(errorMsg);
                });
              }}
              className={styles.primaryButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              Retry Connection
            </button>
            <Link href="/dashboard" className={styles.secondaryButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Return to Dashboard
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <svg
              className={styles.cardTitleIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            About Mining
          </h2>
          <div className={styles.cardContent}>
            <p className={styles.aboutText}>
              Mining is the process of adding new blocks to the blockchain by
              solving complex cryptographic puzzles. Miners are rewarded with
              newly created cryptocurrency coins for their work.
            </p>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles.featureTitle}>Address Configuration</h3>
                  <p>Set a mining address to receive mining rewards</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles.featureTitle}>Difficulty Adjustment</h3>
                  <p>Control block generation rate with difficulty settings</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles.featureTitle}>Mining Process</h3>
                  <p>Start and stop the mining process as needed</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles.featureTitle}>Manual Mining</h3>
                  <p>Mine individual blocks for testing purposes</p>
                </div>
              </div>
            </div>
            <div className={styles.warningBox}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p>
                Mining requires significant computational resources and can
                affect your system is performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (miningApiAvailable === null) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>
            Checking mining API availability...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>
          <svg
            className={styles.pageTitleIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 10L4.5 20.5M18 14l1.5-1.5M14 4l-4.5 4.5M21 8l-2 2m-9-6l6 6" />
          </svg>
          Cryptocurrency Mining
        </h1>
        <Link href="/dashboard" className={styles.backLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </header>

      {error && (
        <div className={styles.errorMessage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {operationMessage && (
        <div
          className={`${styles.messageBox} ${
            operationMessage.startsWith("Error") ||
            operationMessage.startsWith("Failed")
              ? styles.errorBox
              : operationMessage.includes("wait")
              ? styles.infoBox
              : styles.successBox
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {operationMessage.startsWith("Error") ||
            operationMessage.startsWith("Failed") ? (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </>
            ) : operationMessage.includes("wait") ? (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="6" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </>
            ) : (
              <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </>
            )}
          </svg>
          {operationMessage}
          {(operationMessage.includes("Internal Server Error") ||
            operationMessage.includes("Server error")) && (
            <div className={styles.errorDetails}>
              <p>This could be caused by:</p>
              <ul>
                <li>The mining server is not running</li>
                <li>The server has resource constraints</li>
                <li>There are issues with the blockchain node</li>
              </ul>
              <p>Try again later or contact the system administrator.</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.contentGrid}>
        {/* New wallet balance card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <svg
              className={styles.cardTitleIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
            Mining Rewards
          </h2>
          <div className={styles.cardContent}>
            <div className={styles.walletStatsGrid}>
              <div className={styles.walletStatItem}>
                <div className={styles.walletStatHeader}>
                  <span className={styles.walletStatLabel}>
                    Current Balance
                  </span>
                  <button
                    onClick={refreshWalletStats}
                    className={styles.refreshIconButton}
                    title="Refresh balance"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                    </svg>
                  </button>
                </div>
                <div className={styles.walletStatValue}>
                  {walletStats?.balance || 0}
                  <span className={styles.currencyUnit}>MYC</span>
                </div>
              </div>

              <div className={styles.walletStatItem}>
                <div className={styles.walletStatHeader}>
                  <span className={styles.walletStatLabel}>Mining Rewards</span>
                  <span className={styles.rewardsBadge}>
                    +
                    {miningTransactions.reduce((sum, tx) => sum + tx.amount, 0)}{" "}
                    MYC
                  </span>
                </div>
                <div className={styles.rewardsInfo}>
                  <span className={styles.rewardsCount}>
                    {miningTransactions.length} mining rewards received
                  </span>
                  {miningTransactions.length > 0 && (
                    <span className={styles.rewardsDate}>
                      Latest:{" "}
                      {new Date(
                        miningTransactions[0]?.timestamp || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.miningAddressInfo}>
              <div className={styles.miningAddressHeader}>
                <span className={styles.miningAddressLabel}>
                  Current Mining Address
                </span>
                {miningStatus?.miningAddress &&
                  wallet?.address &&
                  miningStatus.miningAddress === wallet.address && (
                    <span className={styles.addressMatchBadge}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Rewards to your wallet
                    </span>
                  )}
              </div>
              <div className={styles.miningAddressValue}>
                {miningStatus?.miningAddress || "Not set"}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <svg
              className={styles.cardTitleIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Mining Status
          </h2>
          <div className={styles.cardContent}>
            {isLoading && !miningStatus ? (
              <div className={styles.cardLoading}>
                <div className={styles.spinnerSmall}></div>
                <p>Loading mining status...</p>
              </div>
            ) : (
              <>
                <div className={styles.statusGrid}>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Mining Status</span>
                    <div
                      className={`${styles.statusBadge} ${
                        miningStatus?.mining
                          ? styles.activeBadge
                          : styles.inactiveBadge
                      }`}
                    >
                      <span
                        className={`${styles.statusIndicator} ${
                          miningStatus?.mining ? styles.pulsingDot : ""
                        }`}
                      ></span>
                      {miningStatus?.mining ? "Active" : "Inactive"}
                    </div>
                  </div>

                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>
                      Mining Difficulty
                    </span>
                    <div className={styles.difficultyDisplay}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <span
                          key={i}
                          className={`${styles.difficultyDot} ${
                            i < (miningStatus?.difficulty || 0)
                              ? styles.activeDot
                              : styles.inactiveDot
                          }`}
                        ></span>
                      ))}
                      <span className={styles.difficultyValue}>
                        {miningStatus?.difficulty || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Mining Address</span>
                    <div className={styles.addressDisplay}>
                      {miningStatus?.miningAddress ? (
                        <div className={styles.addressPill}>
                          <span className={styles.addressText}>
                            {miningStatus.miningAddress}
                          </span>
                          <button
                            className={styles.copyAddressButton}
                            onClick={() => {
                              navigator.clipboard.writeText(
                                miningStatus.miningAddress || ""
                              );
                            }}
                            title="Copy address"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span className={styles.notSet}>Not set</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.miningControls}>
                  <button
                    onClick={handleStartMining}
                    disabled={isLoading || miningStatus?.mining}
                    className={`${styles.controlButton} ${styles.startButton} ${
                      isLoading || miningStatus?.mining
                        ? styles.disabledButton
                        : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Start Mining
                  </button>
                  <button
                    onClick={handleStopMining}
                    disabled={isLoading || !miningStatus?.mining}
                    className={`${styles.controlButton} ${styles.stopButton} ${
                      isLoading || !miningStatus?.mining
                        ? styles.disabledButton
                        : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="6" y="6" width="12" height="12" />
                    </svg>
                    Stop Mining
                  </button>
                </div>

                <button
                  onClick={() => getMiningStatus()}
                  className={styles.refreshButton}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                  Refresh Status
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <svg
              className={styles.cardTitleIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20v-6M6 20V10M18 20V4" />
            </svg>
            Mining Configuration
          </h2>
          <div className={styles.cardContent}>
            <div className={styles.configSection}>
              <label className={styles.configLabel}>Mining Address</label>
              <div className={styles.inputWithButton}>
                <input
                  className={styles.addressInput}
                  placeholder={wallet?.address || "Enter mining address"}
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                />
                <button
                  onClick={handleSetMiningAddress}
                  disabled={isLoading}
                  className={styles.setButton}
                >
                  Set
                </button>
              </div>
              <p className={styles.inputHelp}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                Leave empty to use your current wallet address
              </p>
            </div>

            <div className={styles.configSection}>
              <div className={styles.difficultyHeader}>
                <label className={styles.configLabel}>
                  Mining Difficulty{" "}
                  <button
                    className={styles.infoButton}
                    onClick={() => setShowDifficultyInfo(!showDifficultyInfo)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </button>
                </label>
                <span
                  className={`${styles.difficultyValue} ${
                    isDifficultyChanged ? styles.difficultyChanged : ""
                  }`}
                >
                  {difficulty}/8
                </span>
              </div>

              {showDifficultyInfo && (
                <div className={styles.difficultyInfoBox}>
                  <h4>About Mining Difficulty</h4>
                  <p>
                    The mining difficulty determines how hard it is to find a
                    valid block hash:
                  </p>
                  <ul>
                    <li>
                      <strong>Lower difficulty (1-3):</strong> Faster mining,
                      quicker rewards, less security
                    </li>
                    <li>
                      <strong>Medium difficulty (4-5):</strong> Balanced mining
                      speed and security
                    </li>
                    <li>
                      <strong>Higher difficulty (6-8):</strong> Slower mining,
                      more secure blockchain
                    </li>
                  </ul>
                  <p>
                    Each +1 difficulty makes mining approximately 16x harder.
                  </p>
                </div>
              )}

              <div className={styles.difficultyPresets}>
                <button
                  className={`${styles.presetButton} ${
                    difficulty <= 3 ? styles.activePreset : ""
                  }`}
                  onClick={() => setDifficultyPreset("easy")}
                >
                  Easy (2)
                </button>
                <button
                  className={`${styles.presetButton} ${
                    difficulty >= 4 && difficulty <= 5
                      ? styles.activePreset
                      : ""
                  }`}
                  onClick={() => setDifficultyPreset("medium")}
                >
                  Medium (4)
                </button>
                <button
                  className={`${styles.presetButton} ${
                    difficulty >= 6 ? styles.activePreset : ""
                  }`}
                  onClick={() => setDifficultyPreset("hard")}
                >
                  Hard (6)
                </button>
              </div>

              <div className={styles.difficultySliderContainer}>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(parseInt(e.target.value));
                    setIsDifficultyChanged(true);
                  }}
                  className={styles.difficultySlider}
                />
                <div className={styles.difficultyLabels}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
                    <div
                      key={value}
                      className={`${styles.difficultyLabel} ${
                        value === difficulty ? styles.activeDifficultyLabel : ""
                      }`}
                      onClick={() => {
                        setDifficulty(value);
                        setIsDifficultyChanged(true);
                      }}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.difficultyHints}>
                <span>Faster Mining</span>
                <span>Increased Security</span>
              </div>

              <div className={styles.difficultyEstimate}>
                <div className={styles.estimateIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span>
                  Estimated mining time:{" "}
                  {difficulty <= 3
                    ? "Seconds"
                    : difficulty <= 5
                    ? "Minutes"
                    : "Hours+"}
                </span>
              </div>

              <div className={styles.difficultyButtonContainer}>
                <button
                  onClick={handleSetDifficulty}
                  disabled={isLoading || !isDifficultyChanged}
                  className={`${styles.setButton} ${
                    isDifficultyChanged ? styles.changedButton : ""
                  }`}
                >
                  Apply Difficulty
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.wideCard}`}>
          <h2 className={styles.cardTitle}>
            <svg
              className={styles.cardTitleIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Mine Single Block (Testing)
          </h2>
          <div className={styles.cardContent}>
            <div className={styles.mineBlockSection}>
              <p className={styles.mineBlockDescription}>
                This is for testing purposes. Mining a single block will
                generate new coins to the configured mining address. It is a
                good way to test your mining setup without running the
                continuous mining process.
              </p>
              <button
                onClick={handleMineBlock}
                disabled={isLoading}
                className={styles.mineButton}
              >
                {isLoading ? (
                  <>
                    <div className={styles.buttonSpinner}></div>
                    Mining in progress...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 10L4.5 20.5M18 14l1.5-1.5M14 4l-4.5 4.5M21 8l-2 2m-9-6l6 6" />
                    </svg>
                    Mine One Block
                  </>
                )}
              </button>
            </div>

            {miningResult && (
              <div className={styles.miningResultContainer}>
                <h3 className={styles.resultTitle}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Block Mined Successfully
                </h3>
                <div className={styles.resultStats}>
                  <div className={styles.resultStat}>
                    <span className={styles.resultStatLabel}>Block Index</span>
                    <span className={styles.resultStatValue}>
                      {miningResult.index}
                    </span>
                  </div>
                  <div className={styles.resultStat}>
                    <span className={styles.resultStatLabel}>Nonce</span>
                    <span className={styles.resultStatValue}>
                      {miningResult.nonce}
                    </span>
                  </div>
                  <div className={styles.resultStat}>
                    <span className={styles.resultStatLabel}>Timestamp</span>
                    <span className={styles.resultStatValue}>
                      {new Date(miningResult.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.resultStat}>
                    <span className={styles.resultStatLabel}>Transactions</span>
                    <span className={styles.resultStatValue}>
                      {miningResult.transactions?.length || 0}
                    </span>
                  </div>
                </div>
                <div className={styles.hashDetails}>
                  <div className={styles.hashRow}>
                    <span className={styles.hashLabel}>Hash:</span>
                    <span className={styles.hashValue}>
                      {miningResult.hash}
                    </span>
                  </div>
                  <div className={styles.hashRow}>
                    <span className={styles.hashLabel}>Previous:</span>
                    <span className={styles.hashValue}>
                      {miningResult.previousHash}
                    </span>
                  </div>
                </div>
                <div className={styles.resultDetails}>
                  <div className={styles.detailsHeader}>
                    <h4 className={styles.detailsTitle}>Raw Block Data</h4>
                    <button
                      className={styles.copyJsonButton}
                      onClick={() =>
                        navigator.clipboard.writeText(
                          JSON.stringify(miningResult, null, 2)
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy JSON
                    </button>
                  </div>
                  <pre className={styles.jsonViewer}>
                    {JSON.stringify(miningResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Mining Transactions card - spans full width */}
        <div className={`${styles.card} ${styles.wideCard}`}>
          <h2 className={styles.cardTitle}>
            <svg
              className={styles.cardTitleIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Mining Transactions
          </h2>
          <div className={styles.cardContent}>
            {isLoading ? (
              <div className={styles.cardLoading}>
                <div className={styles.spinnerSmall}></div>
                <p>Loading mining transactions...</p>
              </div>
            ) : miningTransactions.length === 0 ? (
              <div className={styles.emptyStateContainer}>
                <div className={styles.emptyStateIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <p className={styles.emptyStateTitle}>No Mining Rewards Yet</p>
                <p className={styles.emptyStateText}>
                  Start mining or mine a block to receive mining rewards
                </p>
                <button
                  onClick={loadTransactionHistory}
                  className={styles.refreshButton}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                  Refresh Transactions
                </button>
              </div>
            ) : (
              <div className={styles.transactionsList}>
                <div className={styles.transactionsHeader}>
                  <div className={styles.transactionHeaderCell}>Block</div>
                  <div className={styles.transactionHeaderCell}>Time</div>
                  <div className={styles.transactionHeaderCell}>To</div>
                  <div className={styles.transactionHeaderCell}>Amount</div>
                  <div className={styles.transactionHeaderCell}>Status</div>
                </div>

                {miningTransactions.map((tx) => (
                  <div key={tx._id || tx.id} className={styles.transactionRow}>
                    <div className={styles.transactionCell}>
                      <div className={styles.blockBadge}>
                        {tx._id?.substring(0, 6) || "N/A"}
                      </div>
                    </div>
                    <div className={styles.transactionCell}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                    <div className={styles.transactionCell}>
                      <div className={styles.addressContainer}>
                        {tx.toAddress?.substring(0, 8)}...
                        {tx.toAddress?.substring(tx.toAddress.length - 8)}
                      </div>
                    </div>
                    <div className={styles.transactionCell}>
                      <div className={styles.amountValue}>+{tx.amount} MYC</div>
                    </div>
                    <div className={styles.transactionCell}>
                      <div className={styles.statusBadge}>
                        {tx.status || "Confirmed"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
