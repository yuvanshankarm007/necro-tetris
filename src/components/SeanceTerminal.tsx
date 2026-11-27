import React, { useState, useRef, useEffect } from 'react';
import { AgentChatMessage, DisplayTheme } from '../core/types';
import { THEME_CONFIG } from '../core/constants';
import { MessageSquare, Send, Sparkles, Flame, BookOpen, Terminal, Copy, Check, MessageCircleCode } from 'lucide-react';

interface SeanceTerminalProps {
  messages: AgentChatMessage[];
  onSendMessage: (text: string) => void;
  onTriggerDebate?: () => void;
  theme: DisplayTheme;
}

export const SeanceTerminal: React.FC<SeanceTerminalProps> = ({
  messages,
  onSendMessage,
  onTriggerDebate,
  theme,
}) => {
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'strategic' | 'taunt' | 'lore'>('all');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const config = THEME_CONFIG[theme];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopyLogs = () => {
    const text = messages.map((m) => `[${m.timestamp}] ${m.name}: ${m.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.sentiment === filter;
  });

  const getSenderBadge = (sender: string) => {
    switch (sender) {
      case 'pajitnov':
      case 'gc-optimizer':
        return {
          icon: <Sparkles className="w-3 h-3 text-emerald-400" />,
          color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40',
        };
      case 'poltergeist':
      case 'chaos-monkey':
        return {
          icon: <Flame className="w-3 h-3 text-red-400" />,
          color: 'text-red-400 border-red-800 bg-red-950/40',
        };
      case 'gravedigger':
      case 'memory-profiler':
        return {
          icon: <BookOpen className="w-3 h-3 text-purple-400" />,
          color: 'text-purple-400 border-purple-800 bg-purple-950/40',
        };
      default:
        return {
          icon: <Terminal className="w-3 h-3 text-cyan-400" />,
          color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40',
        };
    }
  };

  return (
    <div
      className="p-3.5 rounded-xl border bg-black/80 backdrop-blur-md shadow-2xl flex flex-col h-84 w-full"
      style={{ borderColor: config.gridLine }}
    >
      {/* Header & Filter Tabs */}
      <div
        className="flex flex-wrap items-center justify-between border-b pb-2 mb-2 gap-2"
        style={{ borderColor: config.gridLine }}
      >
        <div
          className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
          style={{ color: config.primaryText }}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Kiro Crew Daemon Feed (MCP + A2A + AG-UI)</span>
        </div>

        <div className="flex items-center gap-2">
          {onTriggerDebate && (
            <button
              onClick={onTriggerDebate}
              className="px-2 py-0.5 rounded bg-purple-950/60 hover:bg-purple-900 border border-purple-700 text-purple-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
              title="Trigger autonomous inter-daemon debate (A2A Protocol)"
            >
              <MessageCircleCode className="w-3 h-3" />
              <span>A2A Debate</span>
            </button>
          )}

          <button
            onClick={handleCopyLogs}
            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
            title="Copy terminal session dialogue"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <div className="flex items-center gap-1">
            {(['all', 'strategic', 'taunt', 'lore'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase cursor-pointer transition-colors ${
                  filter === tab
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs font-mono scrollbar-thin scrollbar-thumb-zinc-800">
        {filteredMessages.map((msg) => {
          const badge = getSenderBadge(msg.sender);
          return (
            <div key={msg.id} className="flex flex-col gap-0.5 bg-black/40 p-2 rounded border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}
                  >
                    {badge.icon}
                    {msg.name}
                  </span>
                </div>
                <span className="text-[9px] text-zinc-500">{msg.timestamp}</span>
              </div>
              <p className="text-zinc-200 text-[11px] leading-relaxed pl-1 mt-0.5">
                {msg.text}
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Input Form */}
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Query Kiro Crew (e.g. 'Evaluate KV_CACHE placement', 'Audit memory fragmentation')..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
        />
        <button
          type="submit"
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors font-bold"
        >
          <Send className="w-3.5 h-3.5 text-emerald-400" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
