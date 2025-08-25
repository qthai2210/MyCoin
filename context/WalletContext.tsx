"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api, Wallet, WalletStats, Transaction } from "@/services/api";

interface WalletContextType {
  wallet: Wallet | null;
  walletStats: WalletStats | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  createWallet: (userId: string, passphrase?: string) => Promise<Wallet>; // Fix return type to match implementation
  loadWallet: (address: string) => Promise<void>;
  loadWalletWithPrivateKey: (address: string) => Promise<void>;
  refreshWalletStats: () => Promise<void>;
  loadTransactionHistory: () => Promise<void>;
  sendCoins: (toAddress: string, amount: number) => Promise<boolean>;
  clearWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Try to load wallet from localStorage on mount
  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      try {
        const parsedWallet = JSON.parse(storedWallet) as Wallet;
        // Validate minimal required wallet properties
        if (!parsedWallet.address) {
          throw new Error("Invalid wallet data in localStorage");
        }
        setWallet(parsedWallet);
        // Load wallet stats if we have an address
        if (parsedWallet.address) {
          loadWalletStats(parsedWallet.address);
          loadTransactionHistoryByAddress(parsedWallet.address);
        }
      } catch (err) {
        console.error("Failed to parse wallet from localStorage:", err);
        localStorage.removeItem("wallet"); // Remove invalid data
      }
    }
  }, []);

  const loadWalletStats = async (address: string) => {
    try {
      const stats = await api.getWalletStats(address);
      setWalletStats(stats);
    } catch (err) {
      console.error("Failed to load wallet stats:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error loading wallet stats"
      );
    }
  };

  const loadTransactionHistoryByAddress = async (address: string) => {
    try {
      // Log the request for debugging
      console.log(`Fetching transaction history for address: ${address}`);

      const history = await api.getTransactionHistory(address);
      setTransactions(history);
    } catch (err) {
      console.error("Failed to load transaction history:", err);

      // If the API returns 404, it might mean no transactions yet rather than an error
      if (err instanceof Error && err.message.includes("Not Found")) {
        console.log("No transaction history found, using empty array");
        setTransactions([]);
        // Don't set error for 404 - it's a valid state for new wallets
      } else {
        // For other errors, update the error state
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error loading transaction history"
        );
      }
    }
  };

  const createWallet = async (userId: string, passphrase?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.createWallet(userId, passphrase);

      // Extract complete wallet data from the response
      const newWallet = response.data;

      // Set the complete wallet object with all available fields
      setWallet(newWallet);

      // Use more detailed wallet stats from the response
      setWalletStats({
        address: newWallet.address,
        balance: newWallet.balance,
        network: newWallet.network,
        createdAt: newWallet.createdAt,
        status: newWallet.status,
        hasPrivateKey: newWallet.hasPrivateKey,
        qrCode: newWallet.qrCode,
        links: newWallet.links,
      });

      // Log additional info for user if available
      if (newWallet.passphrase) {
        console.info(
          "A recovery passphrase has been generated. Please save it securely."
        );
      }

      // Save complete wallet data to localStorage
      localStorage.setItem("wallet", JSON.stringify(newWallet));
      return newWallet;
    } catch (err) {
      console.error("Failed to create wallet:", err);
      setError(
        err instanceof Error ? err.message : "Unknown error creating wallet"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadWallet = async (address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await loadWalletStats(address);
      await loadTransactionHistoryByAddress(address);
      setWallet({ address, userId: "unknown" }); // We don't have the private key here
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unknown error loading wallet"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadWalletWithPrivateKey = async (address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fullWallet = await api.getWalletWithPrivateKey(address);
      setWallet(fullWallet);
      await loadWalletStats(address);
      await loadTransactionHistoryByAddress(address);
      // Save wallet to localStorage (includes private key)
      localStorage.setItem("wallet", JSON.stringify(fullWallet));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unknown error loading wallet"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWalletStats = async () => {
    if (!wallet?.address) return;
    await loadWalletStats(wallet.address);
  };

  const loadTransactionHistory = async () => {
    if (!wallet?.address) return;

    try {
      await loadTransactionHistoryByAddress(wallet.address);
    } catch (err) {
      console.error("Error in loadTransactionHistory:", err);
      // Already handled in loadTransactionHistoryByAddress
    }
  };

  const sendCoins = async (toAddress: string, amount: number) => {
    if (!wallet?.address || !wallet?.privateKey) {
      setError("Wallet not loaded with private key");
      return false;
    }

    console.log("Sending coins:", { toAddress, amount });
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.sendCoins(
        wallet.address,
        toAddress,
        amount,
        wallet.privateKey
      );

      // Log success response
      console.log("Transaction successful:", response);

      // Refresh wallet stats and transaction history
      await refreshWalletStats();
      await loadTransactionHistory();
      return true;
    } catch (err) {
      console.error("Transaction failed:", err);

      // Provide more specific error message
      setError(
        err instanceof Error
          ? err.message
          : "Transaction failed. Please try again."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearWallet = () => {
    setWallet(null);
    setWalletStats(null);
    setTransactions([]);
    localStorage.removeItem("wallet");
  };

  const value = {
    wallet,
    walletStats,
    transactions,
    isLoading,
    error,
    createWallet,
    loadWallet,
    loadWalletWithPrivateKey,
    refreshWalletStats,
    loadTransactionHistory,
    sendCoins,
    clearWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
