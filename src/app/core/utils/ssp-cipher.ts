/**
 * SSP-ID Cipher Utility
 *
 * Implements the custom cipher logic for QR Code generation:
 * Dictionary:
 * 0 -> A, 1 -> B, 2 -> C, 3 -> D, 4 -> E,
 * 5 -> F, 6 -> G, 7 -> H, 8 -> I, 9 -> J
 *
 * Format:
 * Alternating Alpha + Num pairs (e.g. 15 -> B1F5, 10637 -> B1A0G6D3H7)
 */

export const SSP_DIGIT_TO_ALPHA: Record<string, string> = {
  '0': 'A',
  '1': 'B',
  '2': 'C',
  '3': 'D',
  '4': 'E',
  '5': 'F',
  '6': 'G',
  '7': 'H',
  '8': 'I',
  '9': 'J'
};

/**
 * Encodes a numeric SSP-ID or Certificate ID into the custom cipher format:
 * Each digit -> Corresponding Letter + Digit
 * Example: "15" -> "B1F5"
 * Example: "10637" -> "B1A0G6D3H7"
 */
export function encodeSspId(rawId: string | number | null | undefined): string {
  if (rawId === null || rawId === undefined) return '';
  const strId = String(rawId).trim();
  if (!strId) return '';

  let encoded = '';
  for (const char of strId) {
    if (SSP_DIGIT_TO_ALPHA[char]) {
      encoded += `${SSP_DIGIT_TO_ALPHA[char]}${char}`;
    } else {
      encoded += char;
    }
  }
  return encoded;
}
