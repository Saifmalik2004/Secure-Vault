
const STORAGE_PREFIX = 'secure-vault-';

/**
 * Save data to local storage
 * @param key Storage key
 * @param data Data to save
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
}

/**
 * Load data from local storage
 * @param key Storage key
 * @param defaultValue Default value if key doesn't exist
 * @returns Stored data or default value
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const storedData = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Remove data from local storage
 * @param key Storage key
 */
export function removeFromStorage(key: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

// Credential storage keys
export const CREDENTIALS_KEY = 'credentials';
export const PIN_HASH_KEY = 'pin-hash';

// Notes storage key
export const NOTES_KEY = 'notes';
