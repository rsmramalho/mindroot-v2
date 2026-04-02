// companion/CompanionSheet.tsx — AI Companion bottom sheet
// Wireframe: mindroot-wireframe-ai-companion.html
// Bottom sheet with avatar, contextual header, chat bubbles, quick replies, input

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { getCurrentPeriod } from '@/types/ui';

interface Message {
  id: string;
  role: 'user' | 'companion';
  content: string;
}

interface CompanionSheetProps {
  open: boolean;
  onClose: () => void;
}

export function CompanionSheet({ open, onClose }: CompanionSheetProps) {
  const currentPage = useAppStore((s) => s.currentPage);
  const period = getCurrentPeriod();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'companion', content: 'oi. em que posso ajudar?' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Placeholder companion response
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'companion',
        content: 'entendi. deixa eu pensar...',
      };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  const handleQuickReply = (text: string) => {
    const msg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg rounded-t-2xl max-h-[80dvh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-8 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-2 border-b border-border">
              {/* Avatar */}
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-ai-purple via-ai-blue to-ai-green flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-light">○</span>
                <div className="absolute inset-0 rounded-full border border-ai-purple/30 animate-pulse" style={{ animationDuration: '3s' }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">companion</div>
                <div className="text-[11px] text-text-muted">{currentPage} · {period.key}</div>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-text-muted text-xs">
                ✕
              </button>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2.5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : ''}`}
                >
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-text text-bg rounded-br-md'
                        : 'bg-accent-hover text-text-heading rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Quick replies */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['o que eu faco agora?', 'como estou hoje?', 'resumo do dia'].map((qr) => (
                  <button
                    key={qr}
                    onClick={() => handleQuickReply(qr)}
                    className="text-xs px-3 py-1.5 rounded-xl border border-accent-light/30 text-accent bg-card hover:bg-accent-hover transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-border flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="digitar..."
                className="flex-1 bg-surface text-text rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-text-muted"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center text-sm disabled:opacity-30 shrink-0"
              >
                ↑
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
