# Security Specification: Attribute-Based Access Control & Hardened Rules

This document specifies the Data Invariants, the "Dirty Dozen" attack payloads, and the validation tests for the Axi Trading Platform Firestore database structure.

## 1. Data Invariants
- **Identity Integrity**: A user can only read, write, or query their own profile, positions, and transactions. Any cross-user document access is strictly prohibited.
- **Role Isolation**: Only trusted administrator credentials can modify user roles, approve transactions, or query multi-user lists. Users are strictly forbidden from self-assigning the `admin` role or updating critical system fields.
- **Financial Immutability**: Critical fields like `createdAt`, `userId`, `symbol`, and `type` are immutable once created.
- **Value Constraints**: Number fields like `volume`, `balance`, and `equity` must be valid, positive, or within safe architectural boundaries.

---

## 2. The "Dirty Dozen" Payloads (Malicious Attacks)

### 1. Self-Assigning Admin Role (Privilege Escalation)
- **Path**: `/users/user_123`
- **Method**: `create` or `update`
- **Payload**: `{ "id": "user_123", "email": "attacker@gmail.com", "role": "admin" }`
- **Expected Outcome**: `PERMISSION_DENIED` (Cannot set role to admin unless existing record authorizes or requested via secure admin verification).

### 2. Identity Spoofing (Writing to another user's profile)
- **Path**: `/users/victim_uid`
- **Method**: `create` or `update`
- **Payload**: `{ "id": "victim_uid", "name": "Fake Victim", "email": "victim@gmail.com", "role": "user", "balance": 10000 }` (Executed by `attacker_uid`)
- **Expected Outcome**: `PERMISSION_DENIED` (Document ID must match `request.auth.uid`).

### 3. Blanket Read / Query Scraping (Reading all user profiles)
- **Path**: `/users`
- **Method**: `list`
- **Expected Outcome**: `PERMISSION_DENIED` (No blanket reads on the entire users collection).

### 4. Cross-User Position Poisoning (Creating position for another user)
- **Path**: `/users/victim_uid/positions/pos_999`
- **Method**: `create`
- **Payload**: `{ "id": "pos_999", "userId": "victim_uid", "symbol": "EURUSD", "direction": "Buy", "volume": 1.0, "openPrice": 1.1000, "currentPrice": 1.1000, "pnl": 0, "status": "open", "time": "2026-07-16T15:00:00Z" }`
- **Expected Outcome**: `PERMISSION_DENIED` (Must be the owner of the parent resource `/users/victim_uid`).

### 5. ID Poisoning (Creating position with junk-character ID)
- **Path**: `/users/user_123/positions/pos_$$$MALICIOUS$$$`
- **Method**: `create`
- **Expected Outcome**: `PERMISSION_DENIED` (Position ID must match strict alphanumeric pattern).

### 6. Balance Modification Hijack (Directly rewriting user balance)
- **Path**: `/users/user_123`
- **Method**: `update`
- **Payload**: `{ "balance": 9999999.00 }` (By user themselves, bypassing normal transaction deposits)
- **Expected Outcome**: `PERMISSION_DENIED` (Standard users cannot increase their own balance directly).

### 7. Transaction State Shortcutting (Approving own withdrawal)
- **Path**: `/users/user_123/transactions/tx_777`
- **Method**: `update`
- **Payload**: `{ "status": "approved" }` (By user `user_123`, who is not an admin)
- **Expected Outcome**: `PERMISSION_DENIED` (Only admins can approve/reject transactions; user cannot update transaction status).

### 8. Negative Lot Volume (Resource Exhaustion)
- **Path**: `/users/user_123/positions/pos_1`
- **Method**: `create`
- **Payload**: `{ "volume": -5.0 }`
- **Expected Outcome**: `PERMISSION_DENIED` (Volume must be greater than 0).

### 9. Position Immutability Violation (Updating symbol/direction after creation)
- **Path**: `/users/user_123/positions/pos_1`
- **Method**: `update`
- **Payload**: Changing `symbol` from `EURUSD` to `BTCUSD`
- **Expected Outcome**: `PERMISSION_DENIED` (Trading instrument symbol is immutable once created).

### 10. Unauthenticated Access (Reading any path without signing in)
- **Path**: `/users/user_123`
- **Method**: `get` (By non-logged in user)
- **Expected Outcome**: `PERMISSION_DENIED` (Requires active authenticated session).

### 11. Excessively Large String Attack (Denial of Wallet)
- **Path**: `/users/user_123`
- **Method**: `update`
- **Payload**: `{ "name": "<100KB string...>" }`
- **Expected Outcome**: `PERMISSION_DENIED` (String length of name must be strictly bounded, e.g., <= 100 characters).

### 12. Orphaned Transaction Creation (Reference failure)
- **Path**: `/users/non_existent_user/transactions/tx_1`
- **Method**: `create`
- **Expected Outcome**: `PERMISSION_DENIED` (Cannot create transactions under a user that does not exist in `/users`).

---

## 3. Test Runner Definition
These tests can be fully validated via standard Firebase Firestore Emulator suites. The security rules drafted below will explicitly block all 12 of these attack patterns.
