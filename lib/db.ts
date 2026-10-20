import { get, set, del, createStore } from "idb-keyval";

export interface StoredPhoto {
  id: string;
  blob: Blob;
  name: string;
  caption?: string;
  timestamp: number;
  width: number;
  height: number;
}

const DB_NAME = "women_day_2010_db";
const STORE_NAME = "photos";

// Bộ nhớ đệm fallback khi IndexedDB bị chặn (chế độ ẩn danh, safari lockdown, v.v.)
const memoryFallback = new Map<string, StoredPhoto>();
let isIdbSupported: boolean | null = null;
let customStore: ReturnType<typeof createStore> | null = null;

function checkIdbSupport(): boolean {
  if (typeof window === "undefined") return false;
  if (isIdbSupported !== null) return isIdbSupported;
  try {
    if (!window.indexedDB) {
      isIdbSupported = false;
      return false;
    }
    customStore = createStore(DB_NAME, STORE_NAME);
    isIdbSupported = true;
    return true;
  } catch {
    isIdbSupported = false;
    return false;
  }
}

const PHOTOS_KEY = "user_photos_list";

export async function savePhotosToDb(photos: StoredPhoto[]): Promise<boolean> {
  if (!checkIdbSupport() || !customStore) {
    memoryFallback.clear();
    photos.forEach((p) => memoryFallback.set(p.id, p));
    return false; // lưu trong RAM
  }

  try {
    await set(PHOTOS_KEY, photos, customStore);
    return true;
  } catch (err) {
    console.warn("IndexedDB ghi lỗi, chuyển sang fallback bộ nhớ:", err);
    memoryFallback.clear();
    photos.forEach((p) => memoryFallback.set(p.id, p));
    return false;
  }
}

export async function loadPhotosFromDb(): Promise<{ photos: StoredPhoto[]; isPersistent: boolean }> {
  if (!checkIdbSupport() || !customStore) {
    return {
      photos: Array.from(memoryFallback.values()).sort((a, b) => b.timestamp - a.timestamp),
      isPersistent: false,
    };
  }

  try {
    const list = await get<StoredPhoto[]>(PHOTOS_KEY, customStore);
    if (Array.isArray(list)) {
      return {
        photos: list.sort((a, b) => b.timestamp - a.timestamp),
        isPersistent: true,
      };
    }
    return { photos: [], isPersistent: true };
  } catch (err) {
    console.warn("IndexedDB đọc lỗi, dùng fallback bộ nhớ:", err);
    return {
      photos: Array.from(memoryFallback.values()).sort((a, b) => b.timestamp - a.timestamp),
      isPersistent: false,
    };
  }
}

export async function deletePhotoFromDb(id: string): Promise<void> {
  const { photos } = await loadPhotosFromDb();
  const filtered = photos.filter((p) => p.id !== id);
  await savePhotosToDb(filtered);
}

export async function clearAllPhotosFromDb(): Promise<void> {
  memoryFallback.clear();
  if (checkIdbSupport() && customStore) {
    try {
      await del(PHOTOS_KEY, customStore);
    } catch (err) {
      console.warn("Lỗi xóa IndexedDB:", err);
    }
  }
}
