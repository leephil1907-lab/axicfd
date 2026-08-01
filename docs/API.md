# API Documentation

This document describes the tRPC API endpoints available in Axi Trader.

## Overview

The API is built with [tRPC](https://trpc.io/) for type-safe client-server communication. All endpoints use the `/api/trpc` base path.

## Authentication

Most endpoints require authentication via JWT stored in HTTP-only cookies. The authentication is handled automatically by the `useAuth` hook on the frontend.

### Authentication Flow

1. User initiates OAuth with Kimi platform
2. Authorization code exchanged for access token
3. Session JWT created and stored in cookie
4. Subsequent requests include cookie automatically
5. Server validates session token from cookie

## Endpoint Structure

All endpoints follow the tRPC pattern:

```typescript
// Query (GET-like)
const data = await trpc.routeName.queryName.useQuery(input);

// Mutation (POST-like)
const mutation = trpc.routeName.mutationName.useMutation();
mutation.mutate(input);
```

## Routes

### Authentication (`auth`)

#### `auth.me`

Get current authenticated user.

**Type:** Query  
**Authentication:** Required  
**Input:** None  
**Output:**
```typescript
{
  id: number;
  unionId: string;
  name?: string;
  email?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastSignInAt: Date;
}
```

**Example:**
```typescript
const { data: user } = trpc.auth.me.useQuery();

if (user?.role === 'admin') {
  // Show admin panel
}
```

**Error Responses:**
- `403` - Not authenticated or invalid session

---

#### `auth.logout`

Logout current user and clear session.

**Type:** Mutation  
**Authentication:** Required  
**Input:** None  
**Output:**
```typescript
{
  success: boolean;
}
```

**Example:**
```typescript
const logoutMutation = trpc.auth.logout.useMutation({
  onSuccess: () => {
    // Redirect to login
    navigate('/login');
  },
  onError: (error) => {
    console.error('Logout failed:', error);
  }
});

// Trigger logout
logoutMutation.mutate();
```

---

### Admin (`admin`)

All admin endpoints require authentication with `admin` role.

#### `admin.users.list`

Get all users with pagination and filtering.

**Type:** Query  
**Authentication:** Required (Admin only)  
**Input:**
```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 20, Max: 100
  search?: string;      // Search by name or email
  role?: 'user' | 'admin';  // Filter by role
}
```

**Output:**
```typescript
{
  users: Array<{
    id: number;
    unionId: string;
    name?: string;
    email?: string;
    role: 'user' | 'admin';
    createdAt: Date;
    lastSignInAt: Date;
  }>;
  total: number;
  page: number;
  totalPages: number;
}
```

**Example:**
```typescript
const { data } = trpc.admin.users.list.useQuery({
  page: 1,
  limit: 20,
  role: 'user'
});
```

---

#### `admin.users.updateRole`

Update user role.

**Type:** Mutation  
**Authentication:** Required (Admin only)  
**Input:**
```typescript
{
  userId: number;
  role: 'user' | 'admin';
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Example:**
```typescript
const updateRoleMutation = trpc.admin.users.updateRole.useMutation();

updateRoleMutation.mutate({
  userId: 123,
  role: 'admin'
});
```

---

#### `admin.trading.accounts`

Get all trading accounts.

**Type:** Query  
**Authentication:** Required (Admin only)  
**Input:**
```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 20
  status?: 'active' | 'suspended' | 'closed';
  isLive?: boolean;     // Filter by live/demo
}
```

**Output:**
```typescript
{
  accounts: Array<{
    id: number;
    userId: number;
    accountNumber: string;
    accountType: 'standard' | 'pro' | 'usdcent';
    platform: 'mt4' | 'mt5';
    currency: string;
    leverage: string;
    balance: string;
    equity: string;
    status: 'active' | 'suspended' | 'closed';
    isLive: 'live' | 'demo';
    createdAt: Date;
  }>;
  total: number;
}
```

---

#### `admin.trading.updateAccountStatus`

Update trading account status.

**Type:** Mutation  
**Authentication:** Required (Admin only)  
**Input:**
```typescript
{
  accountId: number;
  status: 'active' | 'suspended' | 'closed';
  reason?: string;
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

#### `admin.activities.log`

Get activity logs.

**Type:** Query  
**Authentication:** Required (Admin only)  
**Input:**
```typescript
{
  page?: number;
  limit?: number;
  type?: string;              // Filter by activity type
  startDate?: Date;
  endDate?: Date;
  userId?: number;
}
```

**Output:**
```typescript
{
  logs: Array<{
    id: number;
    type: string;
    description: string;
    userName?: string;
    userEmail?: string;
    ipAddress?: string;
    metadata?: string;
    createdAt: Date;
  }>;
  total: number;
}
```

---

## Error Handling

All endpoints return standardized errors:

```typescript
{
  code: string;           // UNAUTHORIZED, NOT_FOUND, BAD_REQUEST, etc.
  message: string;        // Human-readable error message
  data?: Record<string, any>;  // Additional error details
}
```

**Common Error Codes:**
- `UNAUTHORIZED` - Authentication required or invalid
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid input
- `INTERNAL_SERVER_ERROR` - Server error

## Rate Limiting

The API implements rate limiting:
- **Authentication endpoints:** 10 requests/minute per IP
- **User endpoints:** 100 requests/minute per user
- **Admin endpoints:** 50 requests/minute per admin

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Usage Examples

### React Component Example

```typescript
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/hooks/useAuth';

export function UserProfile() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const { data: allUsers } = trpc.admin.users.list.useQuery(
    { page: 1, limit: 20 },
    { enabled: user?.role === 'admin' }
  );

  if (!user?.role === 'admin') {
    return <div>Admin access required</div>;
  }

  return (
    <div>
      <h1>Users</h1>
      {allUsers?.users.map(u => (
        <div key={u.id}>{u.name} ({u.role})</div>
      ))}
    </div>
  );
}
```

### Backend Implementation

```typescript
// api/admin-router.ts
import { createRouter, adminQuery } from './middleware';

export const adminRouter = createRouter({
  users: {
    list: adminQuery
      .input(z.object({
        page: z.number().default(1),
        limit: z.number().default(20).max(100),
        role: z.enum(['user', 'admin']).optional(),
      }))
      .query(async ({ input }) => {
        const users = await db
          .select()
          .from(schema.users)
          .limit(input.limit)
          .offset((input.page - 1) * input.limit);
        
        const total = await db
          .select({ count: sql`count(*)` })
          .from(schema.users);
        
        return {
          users,
          total: total[0].count,
          page: input.page,
          totalPages: Math.ceil(total[0].count / input.limit),
        };
      }),
  },
});
```

## Webhook Events

The API does not currently support webhooks, but this is planned for a future release.

## Versioning

The API uses tRPC which provides automatic versioning through TypeScript types. Breaking changes will be communicated through release notes and may result in major version bumps.

## Support

For API issues or questions:
- Open an [issue on GitHub](https://github.com/leephil1907-lab/Axi-Trader/issues)
- Check [documentation](./docs/)
- Review [source code](../api/)
