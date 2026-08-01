import { useState, useEffect } from 'react'
import { AlertTriangle, ShieldCheck, TrendingUp, TrendingDown, Info, X } from 'lucide-react'

interface TradeConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  symbol: string
  direction: 'buy' | 'sell'
  volume: number
  price?: number
  orderType?: 'market' | 'limit' | 'stop'
  stopLoss?: string | number
  takeProfit?: string | number
  actionType: 'open' | 'close'
  oneClickTrading: boolean
  onToggleOneClickTrading: (enabled: boolean) => void
  currentPnL?: number
}

export default function TradeConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  symbol,
  direction,
  volume,
  price,
  orderType = 'market',
  stopLoss,
  takeProfit,
  actionType,
  oneClickTrading,
  onToggleOneClickTrading,
  currentPnL
}: TradeConfirmationModalProps) {
  // 2-Step Verification state
  const [isChecked, setIsChecked] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Reset verification checkbox when modal opens/closes or targets change
  useEffect(() => {
    setIsChecked(false)
  }, [isOpen, symbol, direction, volume, actionType])

  if (!isOpen) return null

  const isBuy = direction === 'buy'

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 text-left animate-fade-in duration-200">
      <div className="bg-gray-950 w-full max-w-md rounded-lg border border-gray-800 shadow-2xl p-6 space-y-5 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h4 className="text-base font-space font-semibold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className={`w-5 h-5 ${isBuy ? 'text-green-500' : 'text-red-500'}`} />
            {actionType === 'open' ? 'Step 1: Verify Order Details' : 'Step 1: Verify Close Position'}
          </h4>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold text-lg w-8 h-8 flex items-center justify-center hover:bg-gray-900 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Trade Details Breakdown Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div>
              <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Trading Asset</span>
              <span className="font-space font-bold text-lg text-white tracking-tight">{symbol}</span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Direction</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 font-black rounded-md text-xs uppercase ${
                isBuy ? 'bg-green-950/85 text-green-400 border border-green-800' : 'bg-red-950/85 text-red-400 border border-red-800'
              }`}>
                {isBuy ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {direction.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-800 p-3 rounded-lg bg-gray-900/40">
              <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Volume (Lots)</span>
              <span className="font-space font-extrabold text-sm text-white font-mono tracking-tight">{volume}</span>
            </div>
            
            {actionType === 'open' ? (
              <div className="border border-gray-800 p-3 rounded-lg bg-gray-900/40">
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Order Type</span>
                <span className="font-space font-extrabold text-sm text-white uppercase tracking-tight">{orderType}</span>
              </div>
            ) : (
              <div className="border border-gray-800 p-3 rounded-lg bg-gray-900/40">
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Current P&L</span>
                <span className={`font-space font-extrabold text-sm font-mono tracking-tight ${
                  (currentPnL ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(currentPnL ?? 0) >= 0 ? '+' : ''}${(currentPnL ?? 0).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* SL/TP Details or Price Details */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-3 text-xs space-y-2">
            <div className="flex justify-between items-center text-gray-400">
              <span>Estimated Execution Price:</span>
              <span className="font-mono text-white font-bold">{price ? price.toFixed(5) : 'Market Price'}</span>
            </div>
            
            {actionType === 'open' && (
              <>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Stop Loss (SL):</span>
                  <span className="font-mono text-red-400 font-semibold">{stopLoss ? Number(stopLoss).toFixed(5) : 'None'}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Take Profit (TP):</span>
                  <span className="font-mono text-green-400 font-semibold">{takeProfit ? Number(takeProfit).toFixed(5) : 'None'}</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center text-gray-400">
              <span>Estimated Contract Size:</span>
              <span className="font-mono text-white font-bold">${(volume * 1000).toFixed(2)}</span>
            </div>
          </div>

          {/* 2-Step Verification Panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <input 
                type="checkbox" 
                id="verificationCheckbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#FFC800] focus:ring-[#FFC800] bg-gray-950 border-gray-800 cursor-pointer"
              />
              <label htmlFor="verificationCheckbox" className="text-xs font-medium text-gray-300 leading-normal cursor-pointer select-none">
                <span className="font-bold text-white block mb-0.5">Step 2: Confirm & Validate Transaction</span>
                I acknowledge the current market volatility and authorize execution at the next available quote.
              </label>
            </div>
          </div>

          {/* One-Click Trading Toggle */}
          <div className="flex items-center gap-2 bg-gray-950/50 border border-gray-800 rounded-lg p-3">
            <input 
              type="checkbox" 
              id="enableOneClickCheckboxInModal"
              checked={oneClickTrading}
              onChange={(e) => onToggleOneClickTrading(e.target.checked)}
              className="w-4 h-4 rounded text-[#FFC800] focus:ring-[#FFC800] bg-gray-900 border-gray-800 cursor-pointer"
            />
            <label htmlFor="enableOneClickCheckboxInModal" className="text-[11px] font-semibold text-gray-400 cursor-pointer select-none flex items-center gap-1">
              Enable One-Click Trading (Skip verification next time)
              <button 
                type="button"
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-gray-500 hover:text-gray-300 focus:outline-none"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </label>
          </div>

          {showTooltip && (
            <div className="text-[10px] bg-gray-900 text-gray-400 border border-gray-800 p-2.5 rounded-lg leading-relaxed animate-fade-in">
              One-click trading allows you to bypass confirmations and place/close transactions instantly. Use with caution.
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="bg-gray-900 text-gray-300 border border-gray-800 hover:bg-gray-800 hover:text-white py-3 rounded-lg font-space font-bold text-xs tracking-tight transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button 
              type="button"
              disabled={!isChecked}
              onClick={() => {
                if (isChecked) {
                  onConfirm()
                  onClose()
                }
              }}
              className={`py-3 rounded-lg font-space font-bold text-xs tracking-tight transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                isChecked 
                  ? 'bg-[#FFC800] text-black hover:bg-yellow-400 shadow-lg shadow-yellow-950/30 cursor-pointer' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50'
              }`}
            >
              Confirm & Execute
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
