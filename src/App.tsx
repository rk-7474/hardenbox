import { useState, useMemo } from 'react';
import { 
  Shield, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Server, 
  Settings,
  AlertTriangle,
  HelpCircle,
  Code,
  Sun,
  Moon
} from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HARDENING_OPTIONS } from './constants';
import { generateHardeningScript } from './lib/script-generator';
import { Distro } from './types';

export default function App() {
  const [distro, setDistro] = useState<Distro>('ubuntu');
  const [options, setOptions] = useState<Record<string, boolean>>(
    HARDENING_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.id]: opt.defaultChecked }), {})
  );
  const [customPort, setCustomPort] = useState(22);
  const [newUsername, setNewUsername] = useState('');
  const [isSudo, setIsSudo] = useState(true);
  const [syslogServer, setSyslogServer] = useState('logs.example.com');
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const script = useMemo(() => {
    return generateHardeningScript({ distro, options, customPort, newUsername, isSudo, syslogServer });
  }, [distro, options, customPort, newUsername, isSudo, syslogServer]);

  const handleToggleOption = (id: string) => {
    setOptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([script], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harden-${distro}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const categories = Array.from(new Set(HARDENING_OPTIONS.map(opt => opt.category)));
  const activeCount = Object.values(options).filter(Boolean).length;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
        <div className="w-[960px] h-[680px] bg-card-bg border border-border-main rounded-xl shadow-lg overflow-hidden grid grid-rows-[80px_1fr_100px]">
          {/* Header */}
          <header className="border-b border-border-main px-10 flex items-center justify-between bg-card-bg">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <img src="/hardenbox.png" alt="HardenBox Logo" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                <h1 className="font-extrabold text-xl tracking-tight uppercase">
                  HARDEN<span className="text-accent">BOX</span>
                </h1>
              </div>
              
              <div className="h-6 w-px bg-border-main" />

              <div className="flex gap-1 bg-bg-main p-1 rounded-lg border border-border-main">
                {(['ubuntu', 'debian', 'centos'] as Distro[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDistro(d)}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none ${
                      distro === d
                        ? 'bg-card-bg text-text-main shadow-sm border border-border-main'
                        : 'text-text-sub hover:text-text-main border border-transparent'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="rounded-full border-border-main bg-card-bg hover:bg-bg-main"
              >
                {isDark ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-text-sub" />}
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <div className="min-h-0 h-full overflow-hidden">
            <ScrollArea className="h-full border-none">
              <main className="p-10 grid grid-cols-3 gap-x-8 gap-y-12">
              {categories.map(category => (
                <div key={category} className="flex flex-col gap-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-sub mb-1 flex items-center gap-2">
                    <span className="w-1 h-1 bg-accent rounded-full" />
                    {category.replace('_', ' ')}
                  </h3>
                  <div className="flex flex-col gap-4">
                    {HARDENING_OPTIONS.filter(opt => opt.category === category).map(option => (
                      <div key={option.id} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5 relative group">
                          <Checkbox 
                            id={option.id} 
                            checked={options[option.id]} 
                            onCheckedChange={() => handleToggleOption(option.id)}
                            className="w-[18px] h-[18px] border-2 border-border-main rounded data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                          />
                          <Label 
                            htmlFor={option.id} 
                            className="text-[14px] font-medium cursor-pointer text-text-main leading-tight"
                          >
                            {option.label}
                          </Label>
                          <div className="flex items-center gap-1.5 ml-auto shrink-0">
                            <Tooltip>
                              <TooltipTrigger className="w-3.5 h-3.5 bg-bg-main border border-border-main rounded-full flex items-center justify-center text-[10px] text-text-sub cursor-help">
                                ?
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[200px] bg-text-main text-card-bg text-xs p-3 rounded-md shadow-xl border-none">
                                {option.description}
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger className="w-3.5 h-3.5 bg-bg-main border border-border-main rounded-full flex items-center justify-center text-text-sub cursor-help">
                                <Code className="w-2 h-2" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[500px] bg-zinc-900 text-zinc-300 text-[10px] p-3 rounded-md shadow-xl border border-zinc-800 font-mono whitespace-pre-wrap break-all">
                                <div className="text-zinc-500 mb-1 uppercase text-[8px] font-bold tracking-wider">Command:</div>
                                {option.scripts[distro] || option.scripts.generic || '# No script available'}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>

                        {/* Conditional Inputs */}
                        {option.id === 'ssh_port' && options['ssh_port'] && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="ml-7 flex flex-col gap-1.5"
                          >
                            <Label className="text-[10px] font-bold uppercase text-text-sub">Custom Port</Label>
                            <input 
                              type="number" 
                              value={customPort}
                              onChange={(e) => setCustomPort(parseInt(e.target.value) || 22)}
                              className="bg-card-bg border border-border-main rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-accent shadow-sm transition-all text-text-main"
                              placeholder="e.g. 2222"
                            />
                          </motion.div>
                        )}

                        {option.id === 'ssh_root_login' && options['ssh_root_login'] && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="ml-7 flex flex-col gap-3 p-3 bg-bg-main rounded-lg border border-border-main"
                          >
                            <div className="flex flex-col gap-1.5">
                              <Label className="text-[10px] font-bold uppercase text-text-sub">New Main User</Label>
                              <input 
                                type="text" 
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="bg-card-bg border border-border-main rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-accent shadow-sm transition-all text-text-main"
                                placeholder="Username"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id="isSudo" 
                                checked={isSudo} 
                                onCheckedChange={(v) => setIsSudo(!!v)}
                                className="w-4 h-4 border-2 border-border-main rounded data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                              />
                              <Label htmlFor="isSudo" className="text-xs font-medium text-text-main">
                                Grant Sudo Privileges
                              </Label>
                            </div>
                          </motion.div>
                        )}

                        {option.id === 'rsyslog_remote' && options['rsyslog_remote'] && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="ml-7 flex flex-col gap-1.5"
                          >
                            <Label className="text-[10px] font-bold uppercase text-text-sub">Syslog Server</Label>
                            <input 
                              type="text" 
                              value={syslogServer}
                              onChange={(e) => setSyslogServer(e.target.value)}
                              className="bg-card-bg border border-border-main rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-accent shadow-sm transition-all text-text-main"
                              placeholder="logs.example.com"
                            />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </main>
          </ScrollArea>
        </div>

          {/* Footer */}
          <footer className="border-t border-border-main px-10 flex items-center justify-between bg-card-bg">
            <div className="text-sm text-text-sub">
              <span className="font-bold text-text-main">{activeCount}</span> security modules selected for <span className="font-bold text-text-main uppercase">{distro}</span>.
            </div>
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger 
                  className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-card-bg border-border-main size-10 transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px hover:bg-bg-main cursor-pointer"
                  onClick={() => {
                    const win = window.open('', '_blank');
                    if (win) {
                      win.document.write(`<pre style="padding: 20px; font-family: monospace; background: #030712; color: #F9FAFB; margin: 0; min-height: 100vh;">${script}</pre>`);
                      win.document.close();
                    }
                  }}
                >
                  <Terminal className="w-4 h-4 text-text-sub" />
                </TooltipTrigger>
                <TooltipContent side="top">View Script Source</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger 
                  className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-card-bg border-border-main size-10 transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px hover:bg-bg-main cursor-pointer"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-4 h-4 text-success-main" /> : <Copy className="w-4 h-4 text-text-sub" />}
                </TooltipTrigger>
                <TooltipContent side="top">{copied ? 'Copied!' : 'Copy Snippet'}</TooltipContent>
              </Tooltip>

              <Button 
                onClick={handleDownload}
                className="px-6 py-2.5 h-10 rounded-lg bg-accent hover:bg-blue-700 text-white font-semibold text-sm border-none cursor-pointer"
              >
                Generate hardening.sh
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}
