import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeDialog({ isOpen, onClose }: WelcomeDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card-bg border border-border-main rounded-2xl shadow-2xl z-[61] overflow-hidden"
          >
            <div className="p-6 border-b border-border-main flex items-center justify-between bg-accent/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-main">Welcome to HardenBox</h2>
                  <p className="text-xs text-text-sub">Your Linux hardening companion</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-bg-main rounded-full transition-colors text-text-sub hover:text-text-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-text-main">Understand your choices</h4>
                    <p className="text-xs text-text-sub leading-relaxed">
                      Every security option has a description. We strongly recommend reading what each command does before enabling it to avoid unexpected system behavior.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-text-main">Verify before you run</h4>
                    <p className="text-xs text-text-sub leading-relaxed">
                      Security is a shared responsibility. Use the <span className="font-bold text-amber-600 dark:text-amber-500">"Don't trust this?"</span> button in the footer to get an AI audit of your final script.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={onClose}
                  className="w-full justify-center gap-2 h-12 rounded-xl bg-accent hover:bg-blue-700 text-white font-bold"
                >
                  I understand, let's go
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
