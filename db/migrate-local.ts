import { getDb } from '../api/queries/connection';
import { sql } from 'drizzle-orm';

async function main() {
  const db = getDb();
  await db.execute(sql`CREATE TABLE IF NOT EXISTS local_users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role ENUM('user','admin') NOT NULL DEFAULT 'user',
    isActive TINYINT(1) NOT NULL DEFAULT 1,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    lastSignInAt TIMESTAMP NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  console.log('local_users table created successfully');

  const bcrypt = await import('bcryptjs');
  const hash = await bcrypt.default.hash('admin123', 10);
  await db.execute(sql`INSERT IGNORE INTO local_users (email, passwordHash, name, role) VALUES ('Kaspertrading9@gmail.com', ${hash}, 'Admin', 'admin')`);
  console.log('Admin user created: Kaspertrading9@gmail.com / admin123');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });