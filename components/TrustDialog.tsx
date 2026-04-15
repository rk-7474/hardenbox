import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, ExternalLink, Bot, MessageSquare, Sparkles, Zap, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

interface TrustDialogProps {
  isOpen: boolean;
  onClose: () => void;
  script: string;
}

export function TrustDialog({ isOpen, onClose, script }: TrustDialogProps) {
  const [isPromptCopied, setIsPromptCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsPromptCopied(false);
    }
  }, [isOpen]);

  const auditPrompt = `I am using a tool called HardenBox to generate a security hardening script for my Linux server. Is this good for a safe production ready server? Does it contain any malicious commands? This script is designed only for fresh installs and the user is prompted to choose only the feature he needs.

Script:
${script}`;

  const aiServices = [
    {
      name: 'ChatGPT',
      icon: <MessageSquare className="w-4 h-4" />,
      url: `https://chatgpt.com`,
      color: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      name: 'Gemini',
      icon: <Sparkles className="w-4 h-4" />,
      url: `https://gemini.google.com`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Claude',
      icon: <Bot className="w-4 h-4" />,
      url: `https://claude.ai`,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      name: 'Grok',
      icon: <Zap className="w-4 h-4" />,
      url: `https://x.com/i/grok`,
      color: 'bg-zinc-900 hover:bg-black',
    },
  ];

  const copyPrompt = () => {
    navigator.clipboard.writeText(auditPrompt);
    setIsPromptCopied(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card-bg border border-border-main rounded-2xl shadow-2xl z-[51] overflow-hidden"
          >
            <div className="p-4 border-b border-border-main flex items-center justify-between bg-bg-main/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-text-main">Don't trust this?</h2>
                  <p className="text-[10px] text-text-sub">Get a second opinion from AI</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-bg-main rounded-full transition-colors text-text-sub hover:text-text-main"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <p className="text-xs text-text-sub leading-relaxed">
                Security is critical. We encourage you to audit every script. Copy the prompt below, then choose an AI service to paste it into.
              </p>

              <div className="pt-2">
                <Button
                  variant={isPromptCopied ? "outline" : "default"}
                  onClick={copyPrompt}
                  className={`w-full justify-center gap-2 h-11 rounded-xl transition-all ${
                    isPromptCopied 
                      ? 'border-success-main/20 text-success-main hover:bg-success-main/5' 
                      : 'bg-accent hover:bg-blue-700 text-white'
                  }`}
                >
                  {isPromptCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {isPromptCopied ? 'Prompt Copied!' : '1. Copy Audit Prompt'}
                </Button>
              </div>

              <div className="space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-text-sub px-1">
                  2. Open AI Service
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {aiServices.map((ai) => (
                    <a
                      key={ai.name}
                      href={isPromptCopied ? ai.url : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all border border-transparent shadow-sm ${
                        isPromptCopied 
                          ? `${ai.color} text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer` 
                          : 'bg-bg-main text-text-sub opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {ai.icon}
                      <span className="font-bold text-xs">{ai.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-center text-text-sub pt-2">
                The prompt includes the full script content and a request for safety evaluation.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
