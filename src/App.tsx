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
      <div className="h-screen bg-bg-main overflow-hidden">
        <div className="w-full h-full bg-card-bg flex flex-col">
          {/* Header */}
          <header className="border-b border-border-main px-4 md:px-12 py-4 md:py-0 md:h-[96px] flex flex-col md:flex-row items-center justify-between bg-card-bg shrink-0 gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
              <div className="flex items-center gap-4 justify-between w-full md:w-auto">
                <div className="flex items-center gap-4">
                  <img src="/hardenbox.png" alt="HardenBox Logo" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                  <h1 className="font-extrabold text-2xl tracking-tight uppercase">
                    HARDEN<span className="text-accent">BOX</span>
                  </h1>
                </div>
                <div className="md:hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsDark(!isDark)}
                    className="rounded-full border-border-main bg-card-bg hover:bg-bg-main w-10 h-10"
                  >
                    {isDark ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-text-sub" />}
                  </Button>
                </div>
              </div>
              
              <div className="hidden md:block h-8 w-px bg-border-main" />

              <div className="flex gap-1.5 bg-bg-main p-1.5 rounded-xl border border-border-main w-full md:w-auto overflow-x-auto">
                {(['ubuntu', 'debian', 'centos'] as Distro[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDistro(d)}
                    className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap ${
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
            
            <div className="hidden md:flex items-center gap-5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="rounded-full border-border-main bg-card-bg hover:bg-bg-main w-12 h-12"
              >
                {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-text-sub" />}
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full border-none">
              <main className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-10 md:gap-y-14">
              {categories.map(category => (
                <div key={category} className="flex flex-col gap-5">
                  <h3 className="text-[12px] font-bold uppercase tracking-widest text-text-sub mb-1 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    {category.replace('_', ' ')}
                  </h3>
                  <div className="flex flex-col gap-5">
                    {HARDENING_OPTIONS.filter(opt => opt.category === category).map(option => (
                      <div key={option.id} className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-3 relative group">
                          <Checkbox 
                            id={option.id} 
                            checked={options[option.id]} 
                            onCheckedChange={() => handleToggleOption(option.id)}
                            className="w-[22px] h-[22px] border-2 border-border-main rounded-md data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                          />
                          <Label 
                            htmlFor={option.id} 
                            className="text-[17px] font-medium cursor-pointer text-text-main leading-tight"
                          >
                            {option.label}
                          </Label>
                          <div className="flex items-center gap-2 ml-auto shrink-0">
                            <Tooltip>
                              <TooltipTrigger className="w-4.5 h-4.5 bg-bg-main border border-border-main rounded-full flex items-center justify-center text-[12px] text-text-sub cursor-help">
                                ?
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[240px] bg-text-main text-card-bg text-sm p-4 rounded-lg shadow-xl border-none">
                                {option.description}
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger className="w-4.5 h-4.5 bg-bg-main border border-border-main rounded-full flex items-center justify-center text-text-sub cursor-help">
                                <Code className="w-2.5 h-2.5" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[600px] bg-zinc-900 text-zinc-300 text-[12px] p-4 rounded-lg shadow-xl border border-zinc-800 font-mono whitespace-pre-wrap break-all">
                                <div className="text-zinc-500 mb-1.5 uppercase text-[10px] font-bold tracking-wider">Command:</div>
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
                            className="ml-9 flex flex-col gap-2"
                          >
                            <Label className="text-[12px] font-bold uppercase text-text-sub">Custom Port</Label>
                            <input 
                              type="number" 
                              value={customPort}
                              onChange={(e) => setCustomPort(parseInt(e.target.value) || 22)}
                              className="bg-card-bg border border-border-main rounded-xl px-4 py-2.5 text-base w-full focus:outline-none focus:border-accent shadow-sm transition-all text-text-main"
                              placeholder="e.g. 2222"
                            />
                          </motion.div>
                        )}

                        {option.id === 'ssh_root_login' && options['ssh_root_login'] && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="ml-9 flex flex-col gap-4 p-4 bg-bg-main rounded-xl border border-border-main"
                          >
                            <div className="flex flex-col gap-2">
                              <Label className="text-[12px] font-bold uppercase text-text-sub">New Main User</Label>
                              <input 
                                type="text" 
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="bg-card-bg border border-border-main rounded-xl px-4 py-2.5 text-base w-full focus:outline-none focus:border-accent shadow-sm transition-all text-text-main"
                                placeholder="Username"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <Checkbox 
                                id="isSudo" 
                                checked={isSudo} 
                                onCheckedChange={(v) => setIsSudo(!!v)}
                                className="w-5 h-5 border-2 border-border-main rounded-md data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                              />
                              <Label htmlFor="isSudo" className="text-sm font-medium text-text-main">
                                Grant Sudo Privileges
                              </Label>
                            </div>
                          </motion.div>
                        )}

                        {option.id === 'rsyslog_remote' && options['rsyslog_remote'] && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="ml-9 flex flex-col gap-2"
                          >
                            <Label className="text-[12px] font-bold uppercase text-text-sub">Syslog Server</Label>
                            <input 
                              type="text" 
                              value={syslogServer}
                              onChange={(e) => setSyslogServer(e.target.value)}
                              className="bg-card-bg border border-border-main rounded-xl px-4 py-2.5 text-base w-full focus:outline-none focus:border-accent shadow-sm transition-all text-text-main"
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
          <footer className="border-t border-border-main px-4 md:px-12 py-6 md:py-0 md:h-[120px] flex flex-col md:flex-row items-center justify-between bg-card-bg shrink-0 gap-6 md:gap-4">
            <div className="text-base text-text-sub text-center md:text-left">
              <span className="font-bold text-text-main">{activeCount}</span> security modules selected for <span className="font-bold text-text-main uppercase">{distro}</span>.
            </div>
            <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto justify-center">
              <Tooltip>
                <TooltipTrigger 
                  className="group/button inline-flex shrink-0 items-center justify-center rounded-xl border bg-card-bg border-border-main size-12 transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px hover:bg-bg-main cursor-pointer"
                  onClick={() => {
                    const win = window.open('', '_blank');
                    if (win) {
                      win.document.write(`<pre style="padding: 24px; font-family: monospace; background: #030712; color: #F9FAFB; margin: 0; min-height: 100vh; font-size: 16px;">${script}</pre>`);
                      win.document.close();
                    }
                  }}
                >
                  <Terminal className="w-5 h-5 text-text-sub" />
                </TooltipTrigger>
                <TooltipContent side="top">View Script Source</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger 
                  className="group/button inline-flex shrink-0 items-center justify-center rounded-xl border bg-card-bg border-border-main size-12 transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px hover:bg-bg-main cursor-pointer"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-5 h-5 text-success-main" /> : <Copy className="w-5 h-5 text-text-sub" />}
                </TooltipTrigger>
                <TooltipContent side="top">{copied ? 'Copied!' : 'Copy Snippet'}</TooltipContent>
              </Tooltip>

              <Button 
                onClick={handleDownload}
                className="flex-1 md:flex-none px-4 md:px-8 py-3 h-12 rounded-xl bg-accent hover:bg-blue-700 text-white font-bold text-sm md:text-base border-none cursor-pointer"
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
