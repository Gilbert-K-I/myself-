import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCheck,
  Copy,
  ExternalLink,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { ThemeTokens } from '../types/settings';
import { buildWhatsAppUrl, generatePortfolioBotReply } from '../utils/whatsappBotResponder';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

interface WhatsAppBotProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tokens: ThemeTokens;
  onCopyContact: (label: string, value: string) => void;
}

const QUICK_PROMPTS = [
  { label: 'Services & Skills', query: 'What services and technical skills does Gilbert offer?' },
  { label: 'Availability', query: 'Is Gilbert available for remote work across time zones?' },
  { label: 'Experience & CV', query: 'Summarize Gilbert’s work experience and education.' },
  { label: 'AI Annotation', query: 'Tell me about Gilbert’s AI data annotation and tools.' },
  { label: 'Contact & Rates', query: 'How can I contact Gilbert on WhatsApp or email?' },
];

function formatNow(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome-1',
    sender: 'bot',
    text: `Hello! I'm Gilbert Kariithi Ihugo's WhatsApp assistant (${PROFILE.phone}).\n\nAsk me about data entry & validation, AI annotation, web/UI/UX development, availability, or tap "Open WhatsApp" anytime to message Gilbert directly.`,
    time: formatNow(),
  };
}

export const WhatsAppBot: React.FC<WhatsAppBotProps> = ({
  isOpen,
  onOpenChange,
  tokens,
  onCopyContact,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isSending, isOpen]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: formatNow(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue('');
    setIsSending(true);

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);

      const response = await fetch('/api/whatsapp-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429 || response.status === 400) {
          const errPayload = (await response.json().catch(() => ({}))) as { error?: string };
          if (errPayload.error) {
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                sender: 'bot',
                text: errPayload.error ?? 'Please try again in a moment.',
                time: formatNow(),
              },
            ]);
            return;
          }
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as { reply?: string };
      const replyText = data.reply?.trim() || generatePortfolioBotReply(trimmed);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          time: formatNow(),
        },
      ]);
    } catch {
      const fallback = generatePortfolioBotReply(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallback,
          time: formatNow(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(inputValue);
  };

  const handleReset = () => {
    setMessages([createWelcomeMessage()]);
    setInputValue('');
  };

  const handleCopyPhone = () => {
    onCopyContact('WhatsApp', PROFILE.phone);
    setCopiedNumber(true);
    window.setTimeout(() => setCopiedNumber(false), 1800);
  };

  const latestUserQuery = [...messages].reverse().find((m) => m.sender === 'user')?.text;
  const directWhatsAppHref = buildWhatsAppUrl(
    latestUserQuery
      ? `Hello Gilbert, I reached out from your portfolio regarding: ${latestUserQuery}`
      : `Hello Gilbert, I visited your portfolio and would like to connect.`
  );

  if (!isOpen) {
    return (
      <div className="fixed right-3 bottom-3 z-40 sm:right-6 sm:bottom-6">
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          aria-label="Open WhatsApp chat bot for +254 746 750 677"
          title="WhatsApp Chat Bot (+254 746 750 677)"
          className="group flex h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4 text-white shadow-[0_10px_28px_rgba(18,140,126,0.45)] ring-1 ring-white/20 transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] sm:h-13 sm:px-5"
        >
          <MessageCircle className="h-5 w-5 shrink-0 fill-white/15" aria-hidden="true" />
          <span className="hidden whitespace-nowrap text-xs font-bold tracking-wide sm:inline">
            WhatsApp Chat
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-2 z-50 flex flex-col sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(600px,calc(100dvh-3rem))] sm:w-[min(410px,calc(100vw-3rem))]"
      role="dialog"
      aria-modal="true"
      aria-label="WhatsApp Chat Bot"
    >
      <div
        className={`flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border shadow-[0_24px_60px_rgba(0,0,0,0.55)] ${
          tokens.isDark
            ? 'border-[#1E3B6B] bg-[#091428]'
            : 'border-[#CBD8EE] bg-[#EFEAE2]'
        }`}
      >
        {/* WhatsApp Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 bg-gradient-to-r from-[#075E54] to-[#0B6E62] px-3.5 py-2.5 text-white sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={PROFILE.avatarUrl}
              alt={PROFILE.fullName}
              referrerPolicy="no-referrer"
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/40"
            />
            <div className="min-w-0">
              <div className="font-display truncate text-xs font-bold sm:text-sm">
                {PROFILE.fullName}
              </div>
              <div className="truncate font-mono-tabular text-[11px] text-[#D1FAE5]">
                WhatsApp · {PROFILE.phone}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <a
              href={directWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/15 px-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              title="Open directly in WhatsApp"
            >
              <span className="hidden sm:inline">WhatsApp</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Reset conversation"
              title="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close WhatsApp chat"
              title="Close"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable Chat History */}
        <div
          ref={listRef}
          className={`flex-1 min-h-0 space-y-2.5 overflow-y-auto overscroll-contain p-3 sm:p-4 ${
            tokens.isDark ? 'bg-[#081224]' : 'bg-[#EFEAE2]'
          }`}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-xs sm:text-sm ${
                    isUser
                      ? tokens.isDark
                        ? 'rounded-br-xs bg-[#005C4B] text-white'
                        : 'rounded-br-xs bg-[#D9FDD3] text-[#111B21]'
                      : tokens.isDark
                      ? 'rounded-bl-xs border border-[#1B335E] bg-[#0F203E] text-[#E6EEF9]'
                      : 'rounded-bl-xs bg-white text-[#111B21]'
                  }`}
                >
                  <p className="whitespace-pre-line break-words">{msg.text}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 font-mono-tabular text-[10px] ${
                      isUser
                        ? tokens.isDark
                          ? 'text-[#A7F3D0]'
                          : 'text-[#4B6358]'
                        : tokens.textMuted
                    }`}
                  >
                    <span>{msg.time}</span>
                    {isUser && (
                      <CheckCheck className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex justify-start">
              <div
                className={`rounded-2xl rounded-bl-xs px-3.5 py-2.5 text-xs font-medium ${
                  tokens.isDark
                    ? 'border border-[#1B335E] bg-[#0F203E] text-[#9EB5D9]'
                    : 'bg-white text-[#54656F]'
                }`}
              >
                Typing reply...
              </div>
            </div>
          )}
        </div>

        {/* Horizontal Quick-Reply Chips (Compact for both Portrait & Landscape) */}
        <div
          className={`shrink-0 border-t px-3 py-2 ${
            tokens.isDark
              ? 'border-[#162B50] bg-[#0A162D]'
              : 'border-[#D9D4CC] bg-[#F7F5F0]'
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {QUICK_PROMPTS.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={isSending}
                onClick={() => void sendMessage(item.query)}
                className={`whitespace-nowrap shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50 ${
                  tokens.isDark
                    ? 'border-[#1F3F75] bg-[#0E1F3D] text-[#CFE1FF] hover:border-[#25D366] hover:text-white'
                    : 'border-[#CBD8EE] bg-white text-[#1B2F52] hover:border-[#128C7E]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Composer */}
        <form
          onSubmit={handleSubmit}
          className={`flex shrink-0 items-center gap-2 border-t px-3 py-2.5 ${
            tokens.isDark
              ? 'border-[#162B50] bg-[#091428]'
              : 'border-[#D9D4CC] bg-[#F0F2F5]'
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            maxLength={600}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message Gilbert's WhatsApp bot..."
            aria-label="Message Gilbert's WhatsApp bot"
            className={`min-h-[44px] min-w-0 flex-1 rounded-full border px-4 text-base focus:border-[#25D366] focus:outline-none sm:text-sm ${tokens.inputBg}`}
          />
          <button
            type="submit"
            disabled={isSending || !inputValue.trim()}
            aria-label="Send message"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#128C7E] text-white transition-colors hover:bg-[#0E7266] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        {/* Direct WhatsApp Number & Live Handoff Footer */}
        <div
          className={`flex shrink-0 flex-wrap items-center justify-between gap-2 border-t px-3.5 py-2 text-[11px] ${
            tokens.isDark
              ? 'border-[#162B50] bg-[#060E1F] text-[#9EB5D9]'
              : 'border-[#D9D4CC] bg-white text-[#54656F]'
          }`}
        >
          <button
            type="button"
            onClick={handleCopyPhone}
            className="inline-flex items-center gap-1.5 font-mono-tabular font-semibold hover:text-[#25D366]"
            title="Copy WhatsApp number"
          >
            {copiedNumber ? (
              <Check className="h-3 w-3 text-[#25D366]" aria-hidden="true" />
            ) : (
              <Copy className="h-3 w-3" aria-hidden="true" />
            )}
            <span>{PROFILE.phone}</span>
          </button>

          <a
            href={directWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#25D366] hover:underline"
          >
            <span>Continue on WhatsApp</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
};
