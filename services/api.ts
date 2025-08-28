const API_BASE_URL = "http://localhost:4000/api";

export interface NetworkInfo {
  name: string;
  chainId: number;
  currency: string;
}

export interface WalletLinks {
  viewOnExplorer: string;
  [key: string]: string;
}

export interface Wallet {
  address: string;
  userId: string;
  balance?: number;
  privateKey?: string;
  publicKey?: string;
  passphrase?: string;
  createdAt?: string;
  hasPrivateKey?: boolean;
  network?: NetworkInfo;
  qrCode?: string;
  status?: string;
  links?: WalletLinks;
}

export interface WalletStats {
  address: string;
  balance: number;
  network?: NetworkInfo;
  createdAt?: string;
  status?: string;
  hasPrivateKey?: boolean;
  qrCode?: string;
  links?: WalletLinks;
}

export interface Transaction {
  _id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  type: string;
  hash: string;
  status: string;
  timestamp: string;
  // These are added for UI compatibility
  id?: string;
  transactionId?: string;
}

// Define pagination response interface
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface BlockchainTransactionsResponse {
  transactions: Transaction[];
  pagination: PaginationInfo;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// API implementation
export const api = {
  // Create a new wallet
  async createWallet(
    userId: string,
    passphrase?: string
  ): Promise<ApiResponse<Wallet>> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, passphrase }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create wallet: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error("API error creating wallet:", error);
      throw error;
    }
  },

  // Get wallet statistics
  async getWalletStats(address: string): Promise<WalletStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets/${address}/stats`);

      if (!response.ok) {
        throw new Error(`Failed to get wallet stats: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("API error getting wallet stats:", error);
      throw error;
    }
  },

  // Get wallet with private key
  async getWalletWithPrivateKey(address: string): Promise<Wallet> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets/${address}`);

      if (!response.ok) {
        throw new Error(`Failed to get wallet: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("API error getting wallet:", error);
      throw error;
    }
  },

  // Get all blockchain transactions
  getAllBlockchainTransactions: async (
    page = 1,
    limit = 10
  ): Promise<BlockchainTransactionsResponse> => {
    try {
      console.log(
        `Fetching blockchain transactions, page ${page}, limit ${limit}`
      );
      const response = await fetch(
        `${API_BASE_URL}/transactions/blockchain?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to get blockchain transactions: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Blockchain transactions API response:", data);

      // Extract transactions from the response
      const transactions = data.data.transactions || [];

      // Add UI helper fields to transactions if needed
      const formattedTransactions = transactions.map((tx: any) => ({
        ...tx,
        id: tx._id || tx.id || tx.transactionId || tx.hash,
        transactionId: tx._id || tx.id || tx.transactionId || tx.hash,
      }));

      return {
        transactions: formattedTransactions,
        pagination: data.data.pagination || { total: 0, page, limit, pages: 1 },
      };
    } catch (error) {
      console.error("API error getting blockchain transactions:", error);
      throw error;
    }
  },

  // Get transaction history for a specific wallet
  getTransactionHistory: async (address: string): Promise<Transaction[]> => {
    try {
      console.log(`Fetching transaction history for: ${address}`);
      const response = await fetch(
        `${API_BASE_URL}/transactions/${address}/history`
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log("No transaction history found, using empty array");
          return [];
        }
        throw new Error(
          `Failed to get transaction history: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Transaction history response:", data);

      // Check if we have transactions in the expected structure
      const transactions = data.data.transactions || data.data || [];

      if (transactions.length === 0) {
        console.log("No transactions found in response");
      } else {
        console.log(`Found ${transactions.length} transactions`);
      }

      // Map the transactions to the expected format
      return transactions.map((tx: any) => {
        // Ensure we have consistent IDs across different response structures
        const id = tx._id || tx.id || tx.transactionId || tx.hash;

        // Add derived UI fields
        return {
          ...tx,
          id: id,
          transactionId: id,
          // For UI, determine if this is incoming or outgoing relative to the wallet
          type: tx.fromAddress === address ? "outgoing" : "incoming",
        };
      });
    } catch (error) {
      console.error("API error getting transaction history:", error);
      throw error;
    }
  },

  // Send coins
  sendCoins: async (
    fromAddress: string,
    toAddress: string,
    amount: number,
    privateKey: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {
    try {
      // Use the correct endpoint for transactions
      const response = await fetch(`${API_BASE_URL}/transactions/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAddress,
          toAddress,
          amount,
          privateKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || response.statusText;
        throw new Error(`Failed to send coins: ${errorMessage}`);
      }

      const result = await response.json();
      return result.data; // Return the data portion of the response
    } catch (error) {
      console.error("API error sending coins:", error);
      throw error;
    }
  },
};
