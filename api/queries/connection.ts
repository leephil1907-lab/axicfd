import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env.js";
import * as schema from "@db/schema";
import * as relations from "@db/relations";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const fullSchema = { ...schema, ...relations };

let instance: any;

const MOCK_DB_PATH = path.resolve(process.cwd(), "db/mock_db.json");

function readMockDb() {
  if (!fs.existsSync(MOCK_DB_PATH)) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync("password", salt);
    const initialData = {
      local_users: [
        { id: 1, email: "user@axi.com", passwordHash, name: "John Doe", role: "user", isActive: true, createdAt: new Date().toISOString() },
        { id: 2, email: "admin@axi.com", passwordHash, name: "Admin", role: "admin", isActive: true, createdAt: new Date().toISOString() }
      ],
      trading_accounts: [
        { id: 1, userId: 1, accountNumber: "AXI-100293", accountType: "standard", balance: "5000.00", equity: "5000.00", marginUsed: "0.00", marginAvailable: "5000.00", leverage: 100, currency: "USD", isActive: true, createdAt: new Date().toISOString() },
        { id: 2, userId: 1, accountNumber: "AXI-DEMO-9238", accountType: "demo", balance: "10000.00", equity: "10000.00", marginUsed: "0.00", marginAvailable: "10000.00", leverage: 200, currency: "USD", isActive: true, createdAt: new Date().toISOString() }
      ],
      positions: [],
      orders: [],
      transactions: [
        { id: 1, userId: 1, accountId: 1, type: "deposit", amount: "5000.00", currency: "USD", status: "completed", paymentMethod: "Credit Card", reference: "TX-10023", createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
        { id: 2, userId: 1, accountId: 1, type: "withdrawal", amount: "250.00", currency: "USD", status: "pending", paymentMethod: "Bank Transfer", reference: "TX-10024", createdAt: new Date().toISOString() }
      ],
      trade_history: []
    };
    fs.mkdirSync(path.dirname(MOCK_DB_PATH), { recursive: true });
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(MOCK_DB_PATH, "utf-8"));
  } catch (e) {
    return {};
  }
}

function writeMockDb(data: any) {
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2));
}

class MockQueryChain {
  private queryData?: any;

  constructor(private table: string, private operation: 'select' | 'insert' | 'update' | 'delete', initialValues?: any) {
    if (initialValues !== undefined) {
      this.queryData = initialValues;
    }
  }
  
  private conditions: { key: string, value: any }[] = [];
  private limitVal?: number;
  private offsetVal?: number;

  where(cond: any) {
    if (cond) {
      if (cond.left && cond.left.name) {
        this.conditions.push({ key: cond.left.name, value: cond.right });
      } else if (typeof cond === 'object') {
        Object.entries(cond).forEach(([k, v]) => {
          if (v !== undefined) {
            this.conditions.push({ key: k, value: v });
          }
        });
      }
    }
    return this;
  }

  orderBy() { return this; }
  limit(val: number) { this.limitVal = val; return this; }
  offset(val: number) { this.offsetVal = val; return this; }
  values(val: any) { this.queryData = val; return this; }
  set(val: any) { this.queryData = val; return this; }

  async then(resolve: any, reject: any) {
    try {
      const dbData = readMockDb();
      const list = dbData[this.table] || [];

      if (this.operation === 'select') {
        let results = [...list];
        for (const cond of this.conditions) {
          results = results.filter(item => {
            const itemVal = item[cond.key];
            return String(itemVal) === String(cond.value);
          });
        }
        if (this.offsetVal !== undefined) {
          results = results.slice(this.offsetVal);
        }
        if (this.limitVal !== undefined) {
          results = results.slice(0, this.limitVal);
        }
        resolve(results);
      } else if (this.operation === 'insert') {
        const items = Array.isArray(this.queryData) ? this.queryData : [this.queryData];
        const newItems = items.map((item: any) => ({
          id: list.length > 0 ? Math.max(...list.map((i: any) => i.id)) + 1 : 1,
          ...item,
          createdAt: new Date().toISOString()
        }));
        dbData[this.table] = [...list, ...newItems];
        writeMockDb(dbData);
        resolve(newItems);
      } else if (this.operation === 'update') {
        let updatedCount = 0;
        const updatedList = list.map((item: any) => {
          let match = true;
          for (const cond of this.conditions) {
            match = match && (String(item[cond.key]) === String(cond.value));
          }
          if (match) {
            updatedCount++;
            return { ...item, ...this.queryData, updatedAt: new Date().toISOString() };
          }
          return item;
        });
        dbData[this.table] = updatedList;
        writeMockDb(dbData);
        resolve({ affectedRows: updatedCount });
      } else if (this.operation === 'delete') {
        let deletedCount = 0;
        const keptList = list.filter((item: any) => {
          let match = true;
          for (const cond of this.conditions) {
            match = match && (String(item[cond.key]) === String(cond.value));
          }
          if (match) {
            deletedCount++;
            return false;
          }
          return true;
        });
        dbData[this.table] = keptList;
        writeMockDb(dbData);
        resolve({ affectedRows: deletedCount });
      }
    } catch (e) {
      reject(e);
    }
  }
}

const mockDb = {
  select: () => ({
    from: (table: any) => new MockQueryChain(table._.name, 'select')
  }),
  insert: (table: any) => ({
    values: (vals: any) => new MockQueryChain(table._.name, 'insert', vals)
  }),
  update: (table: any) => ({
    set: (vals: any) => new MockQueryChain(table._.name, 'update', vals)
  }),
  delete: (table: any) => new MockQueryChain(table._.name, 'delete')
};

export function getDb() {
  if (!env.databaseUrl || (!env.databaseUrl.startsWith('mysql://') && !env.databaseUrl.startsWith('postgres://'))) {
    return mockDb as any;
  }
  try {
    if (!instance) {
      instance = drizzle(env.databaseUrl, {
        mode: "planetscale",
        schema: fullSchema,
      });
    }
    return instance;
  } catch (err) {
    console.warn("Drizzle initialization failed, using mock database fallback:", err);
    return mockDb as any;
  }
}

