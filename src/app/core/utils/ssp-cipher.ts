/**
 * SSP-ID Cipher & Validation Utility
 *
 * Implements the exact custom cipher logic:
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

export const SSP_ALPHA_TO_DIGIT: Record<string, string> = {
  'A': '0',
  'B': '1',
  'C': '2',
  'D': '3',
  'E': '4',
  'F': '5',
  'G': '6',
  'H': '7',
  'I': '8',
  'J': '9'
};

export interface CipherValidationResult {
  isValid: boolean;
  numericId: string | null;
  errorReason?: 'START_WITH_NUM' | 'END_WITH_ALPHA' | 'ALPHA_ALPHA' | 'NUM_NUM' | 'INVALID_CHAR' | 'MISMATCH_PAIR' | 'EMPTY' | 'FORMAT_ERROR';
}

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
      // If there's an unexpected non-digit, keep it or fallback
      encoded += char;
    }
  }
  return encoded;
}

/**
 * Validates and decodes an encoded SSP-ID according to the exact rules:
 * 1. Checks:
 *    - Must start with Alpha, not Num (start Num => NotValid)
 *    - Must end with Num, not Alpha (end Alpha => NotValid)
 *    - No Alpha + Alpha (consecutive letters => NotValid)
 *    - No Num + Num (consecutive numbers => NotValid)
 *    - Alternating Alpha then Num (is Alpha+Num pairs)
 * 2. Checks:
 *    - Letters must be only those used in the dictionary (A-J)
 *    - Pair correspondence: Letter must match the digit according to the dictionary
 * 3. Extracts:
 *    - Separates numbers from letters to retrieve the original numeric ID
 */
export function validateAndDecodeSspId(input: string | null | undefined): CipherValidationResult {
  if (!input || !input.trim()) {
    return { isValid: false, numericId: null, errorReason: 'EMPTY' };
  }

  const trimmed = input.trim();

  // Rule: Check if input starts with a number
  if (/^\d/.test(trimmed)) {
    return { isValid: false, numericId: null, errorReason: 'START_WITH_NUM' };
  }

  // Rule: Check if input ends with an alphabet character
  if (/[a-zA-Z]$/.test(trimmed)) {
    return { isValid: false, numericId: null, errorReason: 'END_WITH_ALPHA' };
  }

  // Rule: Check if contains consecutive alphabets (Alpha + Alpha)
  if (/[a-zA-Z]{2,}/.test(trimmed)) {
    return { isValid: false, numericId: null, errorReason: 'ALPHA_ALPHA' };
  }

  // Rule: Check if contains consecutive numbers (Num + Num)
  if (/\d{2,}/.test(trimmed)) {
    return { isValid: false, numericId: null, errorReason: 'NUM_NUM' };
  }

  // Length must be even because each pair is 1 Alpha + 1 Num
  if (trimmed.length % 2 !== 0) {
    return { isValid: false, numericId: null, errorReason: 'FORMAT_ERROR' };
  }

  let extractedNumericId = '';

  // Process each 2-character pair (Alpha, Num)
  for (let i = 0; i < trimmed.length; i += 2) {
    const alpha = trimmed[i].toUpperCase();
    const digit = trimmed[i + 1];

    // Check if alpha is within the dictionary (A-J)
    if (!(alpha in SSP_ALPHA_TO_DIGIT)) {
      return { isValid: false, numericId: null, errorReason: 'INVALID_CHAR' };
    }

    // Check if digit is a valid number 0-9
    if (!/^\d$/.test(digit)) {
      return { isValid: false, numericId: null, errorReason: 'FORMAT_ERROR' };
    }

    // Check if the alpha strictly matches the digit according to the dictionary
    if (SSP_ALPHA_TO_DIGIT[alpha] !== digit) {
      return { isValid: false, numericId: null, errorReason: 'MISMATCH_PAIR' };
    }

    extractedNumericId += digit;
  }

  return {
    isValid: true,
    numericId: extractedNumericId
  };
}
