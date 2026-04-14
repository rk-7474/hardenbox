export type Distro = 'ubuntu' | 'debian' | 'centos' | 'rhel' | 'fedora';

export interface HardeningOption {
  id: string;
  label: string;
  description: string;
  defaultChecked: boolean;
  category: 'ssh' | 'firewall' | 'updates' | 'users' | 'kernel' | 'logging' | 'tools' | 'filesystem' | 'services' | 'security_modules';
  scripts: Record<string, string>; // distro-specific scripts or generic
}

export interface HardeningConfig {
  distro: Distro;
  options: Record<string, boolean>;
  customPort?: number;
  newUsername?: string;
  isSudo?: boolean;
  syslogServer?: string;
}
