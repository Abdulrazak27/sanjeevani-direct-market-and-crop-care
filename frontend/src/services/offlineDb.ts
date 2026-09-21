import { openDB } from "idb";

const DB_NAME = "sanjeevani_offline_db";
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("diagnoses")) {
        db.createObjectStore("diagnoses", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("sync_queue")) {
        db.createObjectStore("sync_queue", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("weather_cache")) {
        db.createObjectStore("weather_cache", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("farmer_profile")) {
        db.createObjectStore("farmer_profile", { keyPath: "id" });
      }
    },
  });
}

export async function saveOfflineAction(actionType: string, payload: any) {
  const db = await initDB();
  return db.add("sync_queue", {
    actionType,
    payload,
    created_at: new Date().toISOString()
  });
}

export async function getSyncQueue() {
  const db = await initDB();
  return db.getAll("sync_queue");
}

export async function clearSyncQueue() {
  const db = await initDB();
  return db.clear("sync_queue");
}

export async function cacheWeatherData(data: any) {
  const db = await initDB();
  return db.put("weather_cache", { id: "current_weather", data, updated_at: new Date().toISOString() });
}

export async function getCachedWeatherData() {
  const db = await initDB();
  const res = await db.get("weather_cache", "current_weather");
  return res ? res.data : null;
}
