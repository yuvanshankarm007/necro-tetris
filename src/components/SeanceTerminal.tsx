import React, { useState, useRef, useEffect } from 'react';
import { AgentChatMessage, DisplayTheme } from '../core/types';
import { THEME_CONFIG } from '../core/constants';
import { MessageSquare, Send, Sparkles, Flame, BookOpen, Terminal } from 'lucide-react';

interface SeanceTerminalProps {
  messages: AgentChatMessage[];
  onSendMessage: (text: string) => void;
  theme: DisplayTheme;
}

export const SeanceTerminal: React.FC<SeanceTerminalProps> = ({
  messages,
  onSendMessage,
  theme,
}) => {
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'strategic' | 'taunt' | 'lore'>('all');
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

  const filteredMessages = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.sentiment === filter;
  });

  const getSenderBadge = (sender: string) => {
    switch (sender) {
      case 'pajitnov':
        return {
          icon: <Sparkles className="w-3 h-3 text-emerald-400" />,
          color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40',
        };
      case 'poltergeist':
        return {
          icon: <Flame className="w-3 h-3 text-red-400" />,
          color: 'text-red-400 border-red-800 bg-red-950/40',
        };
      case 'gravedigger':
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
      className="p-3 rounded border bg-black/75 backdrop-blur-md shadow-2xl flex flex-col h-80 w-full"
      style={{ borderColor: config.gridLine }}
    >
      {/* Header & Filter Tabs */}
      <div
        className="flex items-center justify-between border-b pb-2 mb-2"
        style={{ borderColor: config.gridLine }}
      >
        <div
          className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
          style={{ color: config.primaryText }}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Séance Terminal (Kiro Crew Feed)</span>
        </div>

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
          placeholder="Whisper to the Ghostly Council..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Send className="w-3 h-3" />
          <span>Summon</span>
        </button>
      </form>
    </div>
  );
};
