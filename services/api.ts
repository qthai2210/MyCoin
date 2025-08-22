const API_BASE_URL = "http://localhost:4000/api";

export interface Wallet {
  address: string;
  privateKey?: string;
  passphrase?: string;
  userId: string;
}

export interface WalletStats {
  address: string;
  balance: number;
}

export interface Transaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  timestamp: number;
  status: "pending" | "completed" | "failed";
}

export const api = {
  // Wallet API
  async createWallet(userId: string, passphrase?: string): Promise<Wallet> {
    const response = await fetch(`${API_BASE_URL}/wallets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        ...(passphrase && { passphrase }),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create wallet: ${response.statusText}`);
    }

    return response.json();
  },

  async getWalletStats(address: string): Promise<WalletStats> {
    const response = await fetch(`${API_BASE_URL}/wallets/${address}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to get wallet stats: ${response.statusText}`);
    }

    return response.json();
  },

  async getWalletWithPrivateKey(address: string): Promise<Wallet> {
    const response = await fetch(`${API_BASE_URL}/wallets/${address}/test`);

    if (!response.ok) {
      throw new Error(`Failed to get wallet: ${response.statusText}`);
    }

    return response.json();
  },

  // Transaction API
  async sendCoins(
    fromAddress: string,
    toAddress: string,
    amount: number,
    privateKey: string
  ): Promise<Transaction> {
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
      throw new Error(`Failed to send transaction: ${response.statusText}`);
    }

    return response.json();
  },

  async getTransactionHistory(address: string): Promise<Transaction[]> {
    const response = await fetch(
      `${API_BASE_URL}/transactions/${address}/history`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get transaction history: ${response.statusText}`
      );
    }

    return response.json();
  },
};
