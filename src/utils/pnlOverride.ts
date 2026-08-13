/**
 * P&L override utilities — DISABLED in production.
 * Artificial P&L injection is blocked. All methods are no-ops that return null / do nothing.
 */

export interface PnlOverrideConfig {
  enabled: boolean;
  unrealizedPnl: number;
  realizedPnl?: number;
  pnlPercentage?: number;
  trendPattern?: 'bullish' | 'growth' | 'volatile' | 'bearish';
  customAccountNotes?: string;
  updatedAt?: string;
}

/** Always returns null — overrides are disabled. */
export const getPnlOverrideForUser = (_userKey?: string): PnlOverrideConfig | null => {
  return null;
};

/** No-op — overrides cannot be set. */
export const setPnlOverrideForUser = (_userKey: string, _config: PnlOverrideConfig): void => {
  if (import.meta.env.DEV) {
    console.warn('[pnlOverride] Artificial P&L injection is disabled in production builds.');
  }
};

/** No-op — nothing to clear. */
export const clearPnlOverrideForUser = (_userKey: string): void => {
  // intentionally empty
};
