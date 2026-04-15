import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Shield, Terminal, Github, Info } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoDialog({ isOpen, onClose }: InfoDialogProps) {
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] bg-card-bg border border-border-main rounded-2xl shadow-2xl z-[61] flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-border-main flex items-center justify-between bg-bg-main/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-main">About HardenBox</h2>
                  <p className="text-xs text-text-sub">Information & Documentation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-bg-main rounded-full transition-colors text-text-sub hover:text-text-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6 space-y-8">
                {/* Warning */}
                <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500">
                  <AlertTriangle className="w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Fresh Installs Only</h4>
                    <p className="text-sm opacity-90 leading-relaxed">
                      The generated script is designed to be run on <strong>fresh, newly provisioned Linux servers</strong>. Running this on an existing production server with configured services may cause unexpected downtime, lockouts, or compatibility issues.
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-text-main">
                    <Shield className="w-5 h-5 text-accent" />
                    <h3 className="font-bold text-lg">Security Features</h3>
                  </div>
                  <p className="text-sm text-text-sub">HardenBox handles multiple categories of system security:</p>
                  <ul className="space-y-2 text-sm text-text-sub list-disc pl-5">
                    <li><strong>SSH Hardening:</strong> Disables root login, enforces key-based auth, changes default port, limits auth tries.</li>
                    <li><strong>Kernel (sysctl):</strong> Prevents IP spoofing, ignores ICMP redirects, protects against SYN floods.</li>
                    <li><strong>Filesystem:</strong> Secures shared memory, hardens permissions on sensitive files (/etc/shadow), sets sticky bits.</li>
                    <li><strong>Firewall:</strong> Configures UFW/iptables to drop all incoming traffic by default except SSH.</li>
                    <li><strong>Logging & Auditing:</strong> Installs auditd, configures remote syslog forwarding, ensures log rotation.</li>
                  </ul>
                </div>

                {/* Helper Functions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-text-main">
                    <Terminal className="w-5 h-5 text-accent" />
                    <h3 className="font-bold text-lg">Script Helper Functions</h3>
                  </div>
                  <p className="text-sm text-text-sub">The generated script includes built-in functions to ensure safety and idempotency:</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-4 rounded-xl bg-bg-main border border-border-main">
                      <code className="text-xs font-bold text-accent mb-2 block">backup_file()</code>
                      <p className="text-xs text-text-sub">Automatically creates timestamped backups of critical configuration files (like sshd_config) before any modifications are made.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-bg-main border border-border-main">
                      <code className="text-xs font-bold text-accent mb-2 block">set_config()</code>
                      <p className="text-xs text-text-sub">Safely updates configuration keys inline without duplicating entries. If a key exists, it updates the value; otherwise, it appends it.</p>
                    </div>
                  </div>
                </div>

                {/* GitHub */}
                <div className="pt-4 border-t border-border-main flex flex-col items-center justify-center gap-3">
                  <p className="text-sm text-text-sub">Open source and community driven.</p>
                  <a
                    href="https://github.com/rk-7474/hardenbox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-zinc-900 transition-colors font-medium text-sm"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
