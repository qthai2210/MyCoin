/**
 * Format an Ethereum address to show shortened version
 * 0x71C7656EC7ab88b098defB751B7401B5f6d8976F -> 0x71C7...976F
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Format amount with commas for thousands
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  });
}
