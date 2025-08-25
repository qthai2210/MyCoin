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
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
  hash?: string;
  blockNumber?: number;
  fee?: number;
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

  // Get transaction history
  async getTransactionHistory(address: string): Promise<Transaction[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wallets/${address}/transactions`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to get transaction history: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data;
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
