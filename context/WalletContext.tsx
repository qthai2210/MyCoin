"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  api,
  Wallet,
  WalletStats,
  Transaction,
  MiningStatus,
  Block,
} from "@/services/api";

interface WalletContextType {
  wallet: Wallet | null;
  walletStats: WalletStats | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  createWallet: (userId: string, passphrase?: string) => Promise<Wallet>;
  loadWallet: (address: string) => Promise<void>;
  loadWalletWithPrivateKey: (address: string) => Promise<void>;
  refreshWalletStats: () => Promise<void>;
  loadTransactionHistory: () => Promise<void>;
  sendCoins: (toAddress: string, amount: number) => Promise<boolean>;
  clearWallet: () => void;
  blockchainTransactions: Transaction[];
  loadBlockchainTransactions: () => Promise<void>;
  // Add mining related properties and methods
  miningStatus: MiningStatus | null;
  getMiningStatus: () => Promise<void>;
  setMiningAddress: (address: string) => Promise<void>;
  setMiningDifficulty: (difficulty: number) => Promise<void>;
  startMining: () => Promise<void>;
  stopMining: () => Promise<void>;
  mineBlock: (minerAddress?: string) => Promise<Block>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blockchainTransactions, setBlockchainTransactions] = useState<
    Transaction[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Add mining status state
  const [miningStatus, setMiningStatus] = useState<MiningStatus | null>(null);

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
      // Ensure all required number fields have fallback values
      setWalletStats({
        address: newWallet.address,
        balance: newWallet.balance ?? 0, // Provide fallback of 0 if balance is undefined
        network: newWallet.network,
        createdAt: newWallet.createdAt,
        status: newWallet.status,
        hasPrivateKey: newWallet.hasPrivateKey ?? false, // Add fallback for boolean properties
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

  const loadBlockchainTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Loading all blockchain transactions");
      const response = await api.getAllBlockchainTransactions();
      setBlockchainTransactions(response.transactions);
      console.log(
        `Loaded ${response.transactions.length} blockchain transactions`
      );
    } catch (err) {
      console.error("Failed to load blockchain transactions:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error loading blockchain transactions"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Mining related methods
  const getMiningStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getMiningStatus();
      setMiningStatus(response.data);
    } catch (err) {
      console.error("Failed to get mining status:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error getting mining status"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const setMiningAddress = async (address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.setMiningAddress(address);
      await getMiningStatus(); // Refresh mining status
    } catch (err) {
      console.error("Failed to set mining address:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error setting mining address"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const setMiningDifficulty = async (difficulty: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.setMiningDifficulty(difficulty);
      await getMiningStatus(); // Refresh mining status
    } catch (err) {
      console.error("Failed to set mining difficulty:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error setting mining difficulty"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const startMining = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.startMining();
      await getMiningStatus(); // Refresh mining status
    } catch (err) {
      console.error("Failed to start mining:", err);
      setError(
        err instanceof Error ? err.message : "Unknown error starting mining"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const stopMining = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.stopMining();
      await getMiningStatus(); // Refresh mining status
    } catch (err) {
      console.error("Failed to stop mining:", err);
      setError(
        err instanceof Error ? err.message : "Unknown error stopping mining"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const mineBlock = async (minerAddress?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the provided minerAddress or the current wallet address
      const address = minerAddress || wallet?.address;

      if (!address) {
        throw new Error("No mining address provided or wallet not loaded");
      }

      const result = await api.mineBlock(address);

      // Refresh wallet stats and transaction history after mining
      if (wallet?.address) {
        await loadWalletStats(wallet.address);
        await loadTransactionHistoryByAddress(wallet.address);
      }

      return result.data;
    } catch (err) {
      console.error("Failed to mine block:", err);
      setError(
        err instanceof Error ? err.message : "Unknown error mining block"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Try to get mining status on mount
  useEffect(() => {
    // Don't show errors for mining status if it fails - it might not be implemented yet
    api
      .getMiningStatus()
      .then((response) => setMiningStatus(response.data))
      .catch((err) => console.log("Mining status not available:", err));
  }, []);

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
    blockchainTransactions,
    loadBlockchainTransactions,
    // Add mining related properties and methods
    miningStatus,
    getMiningStatus,
    setMiningAddress,
    setMiningDifficulty,
    startMining,
    stopMining,
    mineBlock,
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
