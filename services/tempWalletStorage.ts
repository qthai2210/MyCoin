// This service manages temporary wallet data during the creation process
// We store data in sessionStorage to maintain it only for the current session

interface TempWalletData {
  userId: string;
  passphrase: string;
  password: string;
  timestamp: number;
}

const STORAGE_KEY = "temp_wallet_data";

export const tempWalletStorage = {
  // Store temporary wallet data
  store(userId: string, passphrase: string, password: string): void {
    const data: TempWalletData = {
      userId,
      passphrase,
      password,
      timestamp: Date.now(),
    };

    // Only available in browser
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  },

  // Retrieve temporary wallet data
  retrieve(): TempWalletData | null {
    // Only available in browser
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem(STORAGE_KEY);
      if (data) {
        try {
          const parsed = JSON.parse(data) as TempWalletData;
          // Check if data is not too old (30 minutes expiry)
          if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
            return parsed;
          }
        } catch (e) {
          console.error("Failed to parse temp wallet data", e);
        }
      }
    }
    return null;
  },

  // Clear temporary wallet data
  clear(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  },

  // Generate a random passphrase
  generatePassphrase(): string {
    // This is a simplified version - in a real app, you'd use a cryptographically secure method
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
      // More words would be included in a real implementation
    ];

    const result: string[] = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      result.push(wordList[randomIndex]);
    }

    return result.join(" ");
  },
};
