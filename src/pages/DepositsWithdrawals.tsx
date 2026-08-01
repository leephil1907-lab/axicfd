import { useState } from 'react'
import { Link } from 'react-router'
import Navbar from '@/sections/Navbar'

const depositMethods = [
  { name: 'Credit/Debit Card', currencies: 'AED, CAD, CHF, EUR, GBP, HKD, PLN, SGD, USD, ZAR', min: 'USD 5', max: 'USD 100,000', time: 'Instant*', fee: 'Free' },
  { name: 'PayPal', currencies: 'AUD, USD, SGD, CAD, HKD, EUR, GBP', min: 'USD 10', max: 'US 10,000', time: 'Instant', fee: 'Free' },
  { name: 'International Bank Transfer', currencies: 'CAD, CHF, EUR, GBP, HKD, SGD, USD', min: 'USD 10', max: 'USD 1,000,000', time: '1-3 days', fee: 'Free' },
  { name: 'Skrill', currencies: 'AED, CAD, EUR, GBP, INR, USD', min: 'EUR 5', max: 'EUR 100,000', time: 'Instant', fee: 'Free' },
  { name: 'Neteller', currencies: 'CAD, EUR, GBP, PLN, USD', min: 'USD 5', max: 'USD 10,000', time: 'Instant', fee: 'Free' },
  { name: 'Crypto', currencies: 'BTC, ETH, LTC, XRP, XLM, USDT (TRC20), USDT (ERC20)', min: 'USD 30', max: 'USD 250,000', time: 'Up to 15mins', fee: 'Free' },
]

const faqs = [
  { q: 'Are there any fees and commissions?', a: 'No, Axi does not charge any fees or commissions on deposits or withdrawals. However, your payment provider may charge their own fees.' },
  { q: 'How fast is instant deposit and withdrawal?', a: 'Most deposits are processed instantly. Withdrawals are processed within 24 hours on business days. Bank transfers may take 1-3 business days.' },
  { q: 'What accounts can I use to deposit and withdraw funds?', a: 'You can deposit and withdraw using your live trading account. Funds must go to/from accounts in your own name for security reasons.' },
  { q: 'Do you accept third party deposits and withdrawals?', a: 'No, for security and regulatory compliance, all deposits and withdrawals must be made from accounts in the trading account holder\'s name.' },
]

export default function DepositsWithdrawals() {
  const [tab, setTab] = useState<'deposits' | 'withdrawals'>('deposits')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-14">
        <div className="bg-[#C5A059] py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Local payment methods in<br />North America</h1>
          <p className="text-gray-700">Enjoy hassle-free and commission-free<br />deposits & withdrawals in your region</p>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-gray-500">Home / Deposits and Withdrawals / North America</div>
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="flex justify-center gap-0 border-b border-gray-200">
            <button onClick={() => setTab('deposits')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab==='deposits'?'border-[#D31C2B] text-[#D31C2B]':'border-transparent text-gray-500'}`}>Deposits</button>
            <button onClick={() => setTab('withdrawals')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab==='withdrawals'?'border-[#D31C2B] text-[#D31C2B]':'border-transparent text-gray-500'}`}>Withdrawals</button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mb-10">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="text-left px-4 py-3">Payment Method</th><th className="text-left px-4 py-3">Currencies</th>
                  <th className="text-right px-4 py-3">{tab==='deposits'?'Min Deposit':'Min Withdrawal'}</th>
                  <th className="text-right px-4 py-3">{tab==='deposits'?'Max Deposit':'Max Withdrawal'}</th>
                  <th className="text-right px-4 py-3">{tab==='deposits'?'Time to Account':'Withdrawal Time'}</th>
                  {tab==='deposits' && <th className="text-right px-4 py-3">Fees</th>}
                </tr></thead>
                <tbody>{depositMethods.map((m,i) => <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px]">{m.currencies}</td>
                  <td className="px-4 py-3 text-right font-mono">{m.min}</td>
                  <td className="px-4 py-3 text-right font-mono">{m.max}</td>
                  <td className="px-4 py-3 text-right">{m.time}</td>
                  {tab==='deposits' && <td className="px-4 py-3 text-right text-green-600">{m.fee}</td>}
                </tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <p className="text-xs text-gray-500 leading-relaxed">* At Axi, all transactions, whether they are deposits or withdrawals, are processed instantly on our end. These transactions are then forwarded to our card processors and your bank. The entire process can take anywhere from 1 to 7 business days for the funds to be reflected in the respective account (trading or bank account), depending on your bank and the country you are located in. Please note that this timeline is an estimate and actual times may vary.</p>
        </div>
        <div className="text-center mb-10"><Link to="/funds" className="inline-block bg-[#C5A059] hover:bg-[#B08C4A] text-gray-900 px-8 py-3 rounded text-sm font-bold transition-colors">MAKE A DEPOSIT</Link></div>
        <div className="max-w-6xl mx-auto px-4 mb-12">
          <h3 className="text-xl font-bold text-center mb-6">Important information about payments</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq===i?null:i)} className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50">
                  <span>{faq.q}</span><span className="text-lg text-gray-400">{openFaq===i?'\u2212':'+'}</span>
                </button>
                {openFaq===i && <div className="px-4 pb-3 text-sm text-gray-600">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 py-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to make a deposit?</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">Log in to the Client Portal, choose your preferred deposit method, and enjoy hassle-free and commission-free payments.</p>
          <div className="flex justify-center gap-3">
            <Link to="/signup" className="bg-[#C5A059] hover:bg-[#B08C4A] text-gray-900 px-6 py-2.5 rounded text-xs font-bold transition-colors">OPEN A LIVE ACCOUNT</Link>
          </div>
        </div>
      </div>
    </div>
  )
}