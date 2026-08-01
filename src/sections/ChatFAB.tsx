import { useState } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

export default function ChatFAB() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hello! Welcome to Axi. How can I help you today?' }])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { from: 'user', text: input }])
    setInput('')
    setTimeout(() => setMessages(prev => [...prev, { from: 'bot', text: 'Thank you for your message. A support agent will be with you shortly.' }]), 1000)
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#D31C2B] rounded-full shadow-lg flex items-center justify-center hover:bg-[#B91623] transition-colors">
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-[#D31C2B] p-4 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Bot className="w-4 h-4" /></div>
              <div><div className="font-semibold text-sm">Axi Support</div><div className="flex items-center gap-1 text-xs text-white/80"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />Online</div></div>
            </div>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.from==='user'?'flex-row-reverse':''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.from==='bot'?'bg-[#D31C2B]/10':'bg-gray-100'}`}>
                  {msg.from==='bot'?<Bot className="w-3 h-3 text-[#D31C2B]" />:<User className="w-3 h-3 text-gray-600" />}
                </div>
                <div className={`rounded-xl px-3 py-2 text-sm max-w-[200px] ${msg.from==='bot'?'bg-gray-100 text-gray-700':'bg-[#D31C2B] text-white'}`}>{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key==='Enter'&&handleSend()} placeholder="Type a message..." className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#D31C2B]" />
            <button onClick={handleSend} className="p-2 bg-[#D31C2B] rounded-lg hover:bg-[#B91623] transition-colors"><Send className="w-4 h-4 text-white" /></button>
          </div>
        </div>
      )}
    </>
  )
}