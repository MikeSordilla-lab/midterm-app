/**
 * Storage Service - Abstraction layer for AsyncStorage
 * Provides fallback mechanism when native modules are unavailable
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StorageValue {
  [key: string]: string | null;
}

// In-memory fallback storage for when native modules aren't available
const memoryStorage: StorageValue = {};

class StorageService {
  private useMemoryFallback = false;

  /**
   * Initialize storage service
   * Test if AsyncStorage is available, fall back to memory storage if needed
   */
  async initialize(): Promise<void> {
    try {
      // Test AsyncStorage availability
      await AsyncStorage.setItem('__storage_test__', 'test');
      await AsyncStorage.removeItem('__storage_test__');
      this.useMemoryFallback = false;
      console.log('✅ AsyncStorage initialized successfully');
    } catch (error) {
      console.warn(
        '⚠️ AsyncStorage unavailable, using in-memory fallback:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      this.useMemoryFallback = true;
    }
  }

  /**
   * Set item in storage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (this.useMemoryFallback) {
        memoryStorage[key] = value;
        console.log(`💾 [Memory] Stored ${key}`);
      } else {
        await AsyncStorage.setItem(key, value);
        console.log(`💾 [AsyncStorage] Stored ${key}`);
      }
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get item from storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      if (this.useMemoryFallback) {
        const value = memoryStorage[key] ?? null;
        console.log(`📖 [Memory] Retrieved ${key}: ${value ? 'found' : 'not found'}`);
        return value;
      } else {
        const value = await AsyncStorage.getItem(key);
        console.log(`📖 [AsyncStorage] Retrieved ${key}: ${value ? 'found' : 'not found'}`);
        return value;
      }
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (this.useMemoryFallback) {
        delete memoryStorage[key];
        console.log(`🗑️ [Memory] Removed ${key}`);
      } else {
        await AsyncStorage.removeItem(key);
        console.log(`🗑️ [AsyncStorage] Removed ${key}`);
      }
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      if (this.useMemoryFallback) {
        Object.keys(memoryStorage).forEach((key) => {
          delete memoryStorage[key];
        });
        console.log('🗑️ [Memory] Cleared all storage');
      } else {
        await AsyncStorage.clear();
        console.log('🗑️ [AsyncStorage] Cleared all storage');
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get all keys in storage
   */
  async getAllKeys(): Promise<string[]> {
    try {
      if (this.useMemoryFallback) {
        return Object.keys(memoryStorage);
      } else {
        return await AsyncStorage.getAllKeys();
      }
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Check if using memory fallback
   */
  isUsingMemoryFallback(): boolean {
    return this.useMemoryFallback;
  }
}

// Create singleton instance
export const storageService = new StorageService();
