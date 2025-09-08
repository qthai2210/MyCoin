"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./dashboard.module.css";
import { formatAddress, formatAmount } from "@/utils/formatter";
import { useWallet } from "@/context/WalletContext";
import { Transaction } from "@/services/api";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const {
    wallet,
    walletStats,
    transactions,
    blockchainTransactions,
    isLoading,
    error,
    refreshWalletStats,
    loadTransactionHistory,
    loadBlockchainTransactions,
  } = useWallet();

  // Use blockchain transactions for display
  const displayTransactions =
    blockchainTransactions.length > 0 ? blockchainTransactions : [];

  useEffect(() => {
    setMounted(true);

    // Refresh data when dashboard loads
    if (wallet?.address) {
      refreshWalletStats();
      // Load blockchain transactions instead of user's transactions
      loadBlockchainTransactions();

      // Also load user's transaction history
      loadTransactionHistory();
    }
  }, [wallet?.address]);

  // Debug - log transactions to see what's available
  useEffect(() => {
    if (displayTransactions.length > 0) {
      console.log(
        `Loaded ${displayTransactions.length} blockchain transactions:`,
        displayTransactions
      );
    }
  }, [displayTransactions]);

  // Function to handle transaction refresh with better debugging
  const handleRefreshTransactions = () => {
    if (wallet?.address) {
      console.log("Manually refreshing blockchain transactions");
      setIsLoading(true);
      loadBlockchainTransactions()
        .then(() => {
          console.log("Blockchain transaction refresh complete");
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error refreshing blockchain transactions:", err);
          setIsLoading(false);
        });
    }
  };

  // Function to refresh personal transaction history
  const handleRefreshHistory = () => {
    if (wallet?.address) {
      console.log("Refreshing personal transaction history");
      loadTransactionHistory()
        .then(() => {
          console.log("Transaction history refresh complete");
        })
        .catch((err) => {
          console.error("Error refreshing transaction history:", err);
        });
    }
  };

  if (!mounted) {
    return null;
  }

  if (!wallet || !walletStats) {
    return (
      <div className={styles.container}>
        <div className={styles.noWalletMessage}>
          <div className={styles.noWalletIcon}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 11.5C16.2761 11.5 16.5 11.7239 16.5 12C16.5 12.2761 16.2761 12.5 16 12.5C15.7239 12.5 15.5 12.2761 15.5 12C15.5 11.7239 15.7239 11.5 16 11.5Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 7V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>No Wallet Found</h2>
          <p>Please create or restore a wallet to continue</p>
          <Link href="/" className={styles.primaryButton}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <Image src="/logo-enkrypt.svg" alt="MyCoin" width={120} height={28} />
        </div>

        <nav className={styles.nav}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "overview" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <svg
                className={styles.tabIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"
                />
              </svg>
              Overview
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "history" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("history")}
            >
              <svg
                className={styles.tabIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                />
              </svg>
              History
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "send" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("send")}
            >
              <svg
                className={styles.tabIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14m-7-7v14"
                />
              </svg>
              Send
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "receive" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("receive")}
            >
              <svg
                className={styles.tabIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Receive
            </button>
          </div>
          <div className={styles.accountSection}>
            <span className={styles.networkBadge}>MyCoin</span>
            <div className={styles.addressPill}>
              <span>{formatAddress(wallet.address)}</span>
              <button
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(wallet.address);
                  // Show toast notification here if you have a toast component
                }}
                title="Copy Address"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V8.342a2 2 0 00-.602-1.43l-3.31-3.31A2 2 0 0014.658 3H10a2 2 0 00-2 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className={styles.content}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <span>Loading...</span>
          </div>
        )}

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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        {activeTab === "overview" && (
          <div className={styles.overviewContent}>
            <div className={styles.balanceCard}>
              <div className={styles.balanceHeader}>
                <h2 className={styles.balanceLabel}>Your Balance</h2>
                <div className={styles.balanceBadge}>
                  <span className={styles.balanceDot}></span> Active
                </div>
              </div>
              <div className={styles.balanceAmount}>
                {walletStats.balance}{" "}
                <span className={styles.currencySymbol}>MYC</span>
              </div>
              <div className={styles.balanceUsd}>
                ${(walletStats.balance * 2).toFixed(2)}{" "}
                <span className={styles.usdLabel}>USD</span>
              </div>
            </div>

            <div className={styles.actionsGrid}>
              <Link href="/dashboard/send" className={styles.actionButton}>
                <div className={styles.actionIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                </div>
                <span>Send</span>
              </Link>
              <Link href="/dashboard/receive" className={styles.actionButton}>
                <div className={styles.actionIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </div>
                <span>Receive</span>
              </Link>
              <button
                onClick={refreshWalletStats}
                className={styles.actionButton}
              >
                <div className={styles.actionIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Refresh</span>
              </button>
              <Link href="/mining" className={styles.actionButton}>
                <div className={styles.actionIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M14 10L4.5 20.5M18 14l1.5-1.5M14 4l-4.5 4.5M21 8l-2 2m-9-6l6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Mining</span>
              </Link>
              <Link href="/" className={styles.actionButton}>
                <div className={styles.actionIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
                <span>Settings</span>
              </Link>
            </div>

            <div className={styles.transactionsCard}>
              <div className={styles.transactionsHeader}>
                <h3 className={styles.sectionTitle}>
                  <svg
                    className={styles.sectionIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  Blockchain Transactions
                </h3>
                <div className={styles.transactionActions}>
                  <button
                    onClick={handleRefreshTransactions}
                    className={styles.iconButton}
                    title="Refresh blockchain transactions"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className={styles.iconButton}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className={styles.loadingState}>
                  <div className={styles.spinnerSmall}></div>
                  <p>Loading blockchain transactions...</p>
                </div>
              ) : displayTransactions.length === 0 ? (
                <div className={styles.emptyState}>
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
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <p className={styles.emptyStateTitle}>
                    No blockchain transactions yet
                  </p>
                  <p className={styles.emptyStateSubtext}>
                    Blockchain transaction history will appear here
                  </p>
                  <button
                    onClick={handleRefreshTransactions}
                    className={styles.primaryButton}
                  >
                    Refresh Blockchain
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.transactionsTable}>
                    {displayTransactions.slice(0, 10).map((tx) => (
                      <div
                        key={tx._id || tx.id || tx.hash || tx.transactionId}
                        className={styles.transactionRow}
                      >
                        <div className={styles.txIconCol}>
                          <div className={styles.txTypeIcon}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="20"
                              height="20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon
                                points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className={styles.txHashCol}>
                          <a href="#" className={styles.txHash}>
                            {(
                              tx.hash ||
                              tx.id ||
                              tx.transactionId ||
                              ""
                            ).substring(0, 10)}
                            ...
                          </a>
                          <div className={styles.txTime}>
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className={styles.txDetailsCol}>
                          <div className={styles.txAddressLine}>
                            <span className={styles.txAddressLabel}>From</span>
                            <a href="#" className={styles.txAddress}>
                              {formatAddress(tx.fromAddress || "")}
                            </a>
                          </div>
                          <div className={styles.txAddressLine}>
                            <span className={styles.txAddressLabel}>To</span>
                            <a href="#" className={styles.txAddress}>
                              {formatAddress(tx.toAddress || "")}
                            </a>
                          </div>
                        </div>
                        <div className={styles.txAmountCol}>
                          <div className={styles.txAmount}>
                            {tx.amount}{" "}
                            <span className={styles.txCurrency}>MYC</span>
                          </div>
                          <div className={styles.txStatus}>Confirmed</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {displayTransactions.length > 10 && (
                    <div className={styles.viewAllContainer}>
                      <Link href="/explorer" className={styles.viewAllLink}>
                        VIEW BLOCKCHAIN EXPLORER
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
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className={styles.tabContent}>
            <TransactionHistoryView
              transactions={transactions}
              walletAddress={wallet.address}
              isLoading={isLoading}
              onRefresh={handleRefreshHistory}
            />
          </div>
        )}

        {activeTab === "send" && (
          <div className={styles.tabContent}>
            <div className={styles.redirectCard}>
              <svg
                className={styles.redirectIcon}
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
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 16 16 12 12 8"></polyline>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <p>Redirecting to send page...</p>
              <Link href="/dashboard/send" className={styles.primaryButton}>
                Go to Send Page
              </Link>
            </div>
          </div>
        )}

        {activeTab === "receive" && (
          <div className={styles.tabContent}>
            <ReceiveView address={wallet.address} />
          </div>
        )}
      </main>
    </div>
  );
}

// Transaction History View Component - Updated with new styling
function TransactionHistoryView({
  transactions,
  walletAddress,
  isLoading,
  onRefresh,
}: {
  transactions: any[];
  walletAddress: string;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <svg
            className={styles.cardTitleIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
            />
          </svg>
          Transaction History
        </h2>
        <button
          onClick={onRefresh}
          className={styles.iconButton}
          title="Refresh transaction history"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinnerSmall}></div>
          <p>Loading transaction history...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className={styles.emptyState}>
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path>
            </svg>
          </div>
          <p className={styles.emptyStateTitle}>No transaction history found</p>
          <p className={styles.emptyStateSubtext}>
            Your personal transactions will appear here once you send or receive
            MYC
          </p>
          <button onClick={onRefresh} className={styles.primaryButton}>
            Refresh History
          </button>
        </div>
      ) : (
        <div className={styles.transactionsTable}>
          {transactions.map((tx) => {
            const isIncoming =
              tx.toAddress?.toLowerCase() === walletAddress.toLowerCase();
            return (
              <div
                key={tx.transactionId || tx._id || tx.id || tx.hash}
                className={`${styles.transactionRow} ${
                  isIncoming ? styles.incomingTx : styles.outgoingTx
                }`}
              >
                <div className={styles.txIconCol}>
                  <div
                    className={`${styles.txTypeIcon} ${
                      isIncoming ? styles.incomingIcon : styles.outgoingIcon
                    }`}
                  >
                    {isIncoming ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                        <polyline points="17 18 23 18 23 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
                <div className={styles.txHashCol}>
                  <div className={styles.txType}>
                    {isIncoming ? "Received" : "Sent"}
                  </div>
                  <div className={styles.txTime}>
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className={styles.txDetailsCol}>
                  <div className={styles.txAddressLine}>
                    <span className={styles.txAddressLabel}>
                      {isIncoming ? "From" : "To"}
                    </span>
                    <a href="#" className={styles.txAddress}>
                      {formatAddress(
                        isIncoming ? tx.fromAddress : tx.toAddress || ""
                      )}
                    </a>
                  </div>
                </div>
                <div className={styles.txAmountCol}>
                  <div
                    className={`${styles.txAmount} ${
                      isIncoming ? styles.incomingAmount : styles.outgoingAmount
                    }`}
                  >
                    {isIncoming ? "+" : "-"}
                    {tx.amount} <span className={styles.txCurrency}>MYC</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Receive View Component - Updated with better styling
function ReceiveView({ address }: { address: string }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <svg
          className={styles.cardTitleIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        Receive MYC
      </h2>

      <div className={styles.qrContainer}>
        <div className={styles.qrPlaceholder}>
          {/* In a real app, we would generate a QR code here */}
          QR Code for {formatAddress(address)}
        </div>
      </div>

      <div className={styles.addressContainer}>
        <p className={styles.addressLabel}>Your MyCoin Address</p>
        <div className={styles.addressValue}>
          {address}
          <button
            className={styles.copyButton}
            onClick={() => navigator.clipboard.writeText(address)}
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
              <rect
                x="9"
                y="9"
                width="13"
                height="13"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></rect>
              <path
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Copy
          </button>
        </div>
      </div>

      <div className={styles.receiveInfo}>
        <svg
          className={styles.infoIcon}
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
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <p>
          Share your address to receive MYC and other tokens compatible with the
          MyCoin network.
        </p>
      </div>
    </div>
  );
}
