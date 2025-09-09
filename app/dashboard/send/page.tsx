"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatAddress } from "@/utils/formatter";
import { useWallet } from "@/context/WalletContext";
import styles from "./send.module.css";

export default function SendPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isConfirmStep, setIsConfirmStep] = useState(false);
  const [formError, setFormError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { wallet, walletStats, isLoading, error, sendCoins } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!wallet || !walletStats) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>No Wallet Found</h2>
          <p>Please go back to the dashboard and try again.</p>
          <Link href="/dashboard" className={styles.backLink}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    if (!recipient) {
      setFormError("Please enter a recipient address");
      return false;
    }

    if (!recipient.startsWith("0x") || recipient.length !== 42) {
      setFormError("Please enter a valid address");
      return false;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Please enter a valid amount");
      return false;
    }

    if (parsedAmount > walletStats.balance) {
      setFormError("Insufficient balance for this transaction");
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setFormError("");
      setIsConfirmStep(true);
    }
  };

  const handleSend = async () => {
    try {
      const success = await sendCoins(recipient, parseFloat(amount));
      if (success) {
        alert("Transaction successfully sent!");
        router.push("/dashboard");
      } else {
        console.log("Transaction failed", error);
        setFormError("Transaction failed. Please try again.");
        setIsConfirmStep(false);
      }
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Unknown error sending transaction"
      );
      setIsConfirmStep(false);
    }
  };

  const handleCancel = () => {
    if (isConfirmStep) {
      setIsConfirmStep(false);
    } else {
      router.push("/dashboard");
    }
  };

  const setMaxAmount = () => {
    setAmount(walletStats.balance.toString());
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/dashboard" className={styles.backButton}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <div className={styles.headerTitle}>
            {isConfirmStep ? "Confirm Transaction" : "Send MYC"}
          </div>
        </div>
      </header>

      <main className={styles.content}>
        {isLoading && (
          <div className={styles.loadingOverlay}>Processing transaction...</div>
        )}

        {error && <div className={styles.apiError}>Error: {error}</div>}

        {!isConfirmStep ? (
          <div className={styles.sendForm}>
            <div className={styles.balanceInfo}>
              <div className={styles.balanceLabel}>Available Balance</div>
              <div className={styles.balanceValue}>
                {walletStats.balance} MYC
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Recipient Address</label>
              <div className={styles.inputWithIcon}>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className={styles.input}
                />
                <button
                  className={styles.iconButton}
                  onClick={() => {
                    // In a real app, this would open a QR code scanner
                    alert("QR Scanner would open here");
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3H8V8H3V3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 3H17V8H12V3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 12H8V17H3V12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 17V12H17V17H12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => {
                    // In a real app, this would open the contacts list
                    alert("Address book would open here");
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 17V15C16 13.9 15.1 13 14 13H6C4.9 13 4 13.9 4 15V17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="10"
                      cy="7"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Amount</label>
              <div className={styles.amountInputGroup}>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={styles.input}
                />
                <div className={styles.amountActions}>
                  <span className={styles.currencyLabel}>MYC</span>
                  <button className={styles.maxButton} onClick={setMaxAmount}>
                    MAX
                  </button>
                </div>
              </div>
            </div>

            {formError && (
              <div className={styles.errorMessage}>{formError}</div>
            )}

            <div className={styles.actionButtons}>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
              <button
                className={styles.continueButton}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.confirmTransaction}>
            <div className={styles.confirmBox}>
              <div className={styles.confirmHeader}>Transaction Details</div>

              <div className={styles.confirmDetail}>
                <div className={styles.detailLabel}>From</div>
                <div className={styles.detailValue}>
                  {formatAddress(wallet.address)}
                </div>
              </div>

              <div className={styles.confirmDetail}>
                <div className={styles.detailLabel}>To</div>
                <div className={styles.detailValue}>
                  {formatAddress(recipient)}
                </div>
              </div>

              <div className={styles.confirmDetail}>
                <div className={styles.detailLabel}>Amount</div>
                <div className={styles.detailValue}>{amount} MYC</div>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.totalAmount}>
                <div className={styles.totalLabel}>Total Amount</div>
                <div className={styles.totalValue}>
                  {parseFloat(amount).toFixed(2)} MYC
                </div>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Back
              </button>
              <button
                className={styles.sendButton}
                onClick={handleSend}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
