import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async () => {
    if (db) return db;
    db = await SQLite.openDatabaseAsync('nadi_pos.db');
    return db;
};

export const initDatabase = async () => {
    const database = await getDB();

    await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS local_meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      updated_at TEXT,
      sync_status TEXT
    );

    CREATE TABLE IF NOT EXISTS inventory_cache (
      product_id TEXT PRIMARY KEY,
      stock INTEGER NOT NULL,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS customers_cache (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS cart_draft (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      cart_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (cart_id) REFERENCES cart_draft (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    CREATE TABLE IF NOT EXISTS transactions_local (
      id TEXT PRIMARY KEY,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      discount REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      sync_status TEXT NOT NULL, -- pending / synced / failed
      server_id TEXT
    );

    CREATE TABLE IF NOT EXISTS transaction_items_local (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (transaction_id) REFERENCES transactions_local (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    CREATE TABLE IF NOT EXISTS payment_attempts_local (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL,
      provider_ref TEXT,
      sync_status TEXT,
      FOREIGN KEY (transaction_id) REFERENCES transactions_local (id) ON DELETE CASCADE
    );
  `);

    console.log('Database initialized successfully');
};
