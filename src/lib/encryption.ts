
import * as CryptoJS from 'crypto-js';

/**
 * Interface for encryption options
 */
interface EncryptionOptions {
  keySize?: number;
  iterations?: number;
  salt?: string;
}

/**
 * Default encryption configuration
 */
const DEFAULT_OPTIONS: EncryptionOptions = {
  keySize: 256/32,
  iterations: 1000,
  salt: 'SecureVault'
};

/**
 * Encrypt data using AES
 * @param data Data to encrypt
 * @param key Encryption key (username)
 * @returns Encrypted string
 */
export function encryptData(
  data: string, 
  key: string
): string {
  try {
    console.log("Encrypting with key:", key);
    
    // Use the raw key (username) for encryption without additional processing
    return CryptoJS.AES.encrypt(data, key).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES
 * @param encryptedData Encrypted data string
 * @param key Decryption key (username)
 * @returns Decrypted string or null if decryption fails
 */
export function decryptData(
  encryptedData: string, 
  key: string
): string | null {
  try {
    console.log("Decrypting with key:", key);
    
    // Use the raw key (username) for decryption without additional processing
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    console.log("Decryption result:", decryptedString ? "Success" : "Empty string");
    
    // If decryption results in empty string, consider it failed
    if (!decryptedString) {
      console.error("Decryption resulted in empty string");
      return null;
    }
    
    return decryptedString;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

/**
 * Hash a PIN using SHA-256
 * @param pin PIN to hash
 * @returns Hashed PIN
 */
export function hashPin(pin: string): string {
  return CryptoJS.SHA256(pin).toString();
}

/**
 * Verify a PIN against its hash
 * @param pin PIN to verify
 * @param hash Hash to compare against
 * @returns true if PIN matches the hash
 */
export function verifyPin(pin: string, hash: string): boolean {
  return hashPin(pin) === hash;
}

/**
 * Test function to validate encryption and decryption
 * This can be called to debug encryption/decryption issues
 */
export function testEncryptionDecryption(text: string, key: string): boolean {
  try {
    console.log("=== TESTING ENCRYPTION/DECRYPTION ===");
    console.log("Original text:", text);
    console.log("Key:", key);
    
    // Encrypt
    const encrypted = encryptData(text, key);
    console.log("Encrypted:", encrypted);
    
    // Decrypt using the same key
    const decrypted = decryptData(encrypted, key);
    console.log("Decrypted:", decrypted);
    
    const success = decrypted === text;
    console.log("Test " + (success ? "PASSED" : "FAILED"));
    return success;
  } catch (error) {
    console.error("Test failed with error:", error);
    return false;
  }
}
