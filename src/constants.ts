import { HardeningOption } from './types';

export const HARDENING_OPTIONS: HardeningOption[] = [

  // ─── SSH ─────────────────────────────────────────────────────────────────────

  {
    id: 'ssh_root_login',
    label: 'Disable Root SSH Login',
    description: 'Prevents direct root access via SSH. This forces the use of a non-privileged user and sudo, significantly reducing the impact of brute-force attacks on the root account.',
    defaultChecked: true,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*PermitRootLogin.*/PermitRootLogin no/" /etc/ssh/sshd_config'
    }
  },
  {
    id: 'ssh_password_auth',
    label: 'Disable Password Authentication',
    description: 'Disables password-based logins, requiring SSH keys for access. This is one of the most effective ways to prevent brute-force attacks.',
    defaultChecked: true,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*PasswordAuthentication.*/PasswordAuthentication no/" /etc/ssh/sshd_config'
    }
  },
  {
    id: 'ssh_port',
    label: 'Change SSH Port',
    description: 'Moves SSH from the default port 22 to a custom port. This helps avoid automated scanners and bots that target port 22.',
    defaultChecked: false,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*Port 22/Port {{SSH_PORT}}/" /etc/ssh/sshd_config'
    }
  },
  {
    id: 'ssh_dns',
    label: 'Disable SSH DNS Lookup',
    description: 'Disables reverse DNS lookups for SSH connections. This speeds up the login process and prevents potential DNS-based attacks.',
    defaultChecked: true,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*UseDNS.*/UseDNS no/" /etc/ssh/sshd_config'
    }
  },
  {
    id: 'ssh_max_auth_tries',
    label: 'Limit SSH Authentication Attempts',
    description: 'Restricts the number of authentication attempts per connection to 3. Reduces the window for brute-force attacks before the connection is dropped.',
    defaultChecked: true,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*MaxAuthTries.*/MaxAuthTries 3/" /etc/ssh/sshd_config'
    }
  },
  {
    id: 'ssh_login_grace_time',
    label: 'Reduce SSH Login Grace Time',
    description: 'Limits the time allowed for a successful login to 30 seconds. This mitigates slow brute-force and connection-holding attacks.',
    defaultChecked: true,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*LoginGraceTime.*/LoginGraceTime 30/" /etc/ssh/sshd_config'
    }
  },
  {
    id: 'ssh_idle_timeout',
    label: 'Set SSH Idle Session Timeout',
    description: 'Automatically disconnects idle SSH sessions after 5 minutes of inactivity. Reduces the risk of hijacked unattended terminals.',
    defaultChecked: true,
    category: 'ssh',
    scripts: {
      generic: `sed -i "s/^#*ClientAliveInterval.*/ClientAliveInterval 300/" /etc/ssh/sshd_config
sed -i "s/^#*ClientAliveCountMax.*/ClientAliveCountMax 0/" /etc/ssh/sshd_config`
    }
  },
  {
    id: 'ssh_disable_empty_passwords',
    label: 'Disallow Empty Passwords',
    description: 'Blocks login for any account that has an empty password set. A critical safeguard against misconfigured user accounts.',
    defaultChecked: true,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*PermitEmptyPasswords.*/PermitEmptyPasswords no/" /etc/ssh/sshd_config'
    }
  },
  {
    id: 'ssh_disable_x11',
    label: 'Disable X11 Forwarding',
    description: 'Prevents forwarding of graphical (X11) sessions over SSH. X11 forwarding can be abused to intercept keystrokes and clipboard data.',
    defaultChecked: true,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*X11Forwarding.*/X11Forwarding no/" /etc/ssh/sshd_config'
    }
  },
  {
    id: 'ssh_disable_agent_forwarding',
    label: 'Disable SSH Agent Forwarding',
    description: 'Turns off SSH agent forwarding globally. A compromised intermediate server could use a forwarded agent to authenticate as you to other machines.',
    defaultChecked: true,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*AllowAgentForwarding.*/AllowAgentForwarding no/" /etc/ssh/sshd_config'
    }
  },
  {
    id: 'ssh_disable_tcp_forwarding',
    label: 'Disable SSH TCP Forwarding',
    description: 'Disables general TCP port forwarding (tunnelling) via SSH. Prevents SSH from being used as a pivot point to reach internal services.',
    defaultChecked: false,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*AllowTcpForwarding.*/AllowTcpForwarding no/" /etc/ssh/sshd_config'
    }
  },
  {
    id: 'ssh_strong_ciphers',
    label: 'Enforce Strong SSH Ciphers & MACs',
    description: 'Restricts SSH to modern, vetted ciphers, key exchange algorithms, and MACs. Eliminates outdated algorithms such as arcfour, CBC-mode ciphers, and MD5-based MACs.',
    defaultChecked: true,
    category: 'ssh',
    scripts: {
      generic: `cat <<'EOF' >> /etc/ssh/sshd_config

# Strong cryptography — added by hardening script
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
EOF`
    }
  },
  {
    id: 'ssh_max_sessions',
    label: 'Limit SSH Concurrent Sessions',
    description: 'Caps the number of simultaneous open sessions per SSH connection to 2. Reduces resource exhaustion via multiplexed sessions.',
    defaultChecked: false,
    category: 'ssh',
    scripts: {
      generic: 'sed -i "s/^#*MaxSessions.*/MaxSessions 2/" /etc/ssh/sshd_config'
    }
  },

  // ─── FIREWALL ─────────────────────────────────────────────────────────────────

  {
    id: 'ufw_setup',
    label: 'Configure UFW Firewall',
    description: 'Sets up Uncomplicated Firewall (UFW) with a default deny policy, allowing only SSH and other essential traffic.',
    defaultChecked: true,
    category: 'firewall',
    scripts: {
      ubuntu: 'apt-get install -y ufw && ufw default deny incoming && ufw default allow outgoing && ufw allow {{SSH_PORT}}/tcp && ufw --force enable',
      debian: 'apt-get install -y ufw && ufw default deny incoming && ufw default allow outgoing && ufw allow {{SSH_PORT}}/tcp && ufw --force enable'
    }
  },
  {
    id: 'disable_ipv6',
    label: 'Disable IPv6',
    description: 'Disables IPv6 system-wide if your infrastructure does not use it. An unused protocol family increases the attack surface and may bypass IPv4-only firewall rules.',
    defaultChecked: false,
    category: 'firewall',
    scripts: {
      generic: `cat <<'EOF' >> /etc/sysctl.d/99-disable-ipv6.conf
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
EOF
sysctl -p /etc/sysctl.d/99-disable-ipv6.conf`
    }
  },
  {
    id: 'block_uncommon_protocols',
    label: 'Block Uncommon Network Protocols',
    description: 'Blacklists rarely-used kernel network modules (DCCP, SCTP, RDS, TIPC) that are almost never needed on a VPS but can expose kernel vulnerabilities.',
    defaultChecked: true,
    category: 'firewall',
    scripts: {
      generic: `cat <<'EOF' > /etc/modprobe.d/uncommon-protocols.conf
install dccp /bin/true
install sctp /bin/true
install rds /bin/true
install tipc /bin/true
EOF`
    }
  },

  // ─── UPDATES ──────────────────────────────────────────────────────────────────

  {
    id: 'unattended_upgrades',
    label: 'Enable Unattended Security Upgrades',
    description: 'Automatically installs security updates to keep your system patched against known vulnerabilities without manual intervention.',
    defaultChecked: true,
    category: 'updates',
    scripts: {
      ubuntu: 'apt-get install -y unattended-upgrades && dpkg-reconfigure -f noninteractive unattended-upgrades',
      debian: 'apt-get install -y unattended-upgrades && dpkg-reconfigure -f noninteractive unattended-upgrades'
    }
  },

  // ─── KERNEL ───────────────────────────────────────────────────────────────────

  {
    id: 'sysctl_hardening',
    label: 'Hardened Kernel Parameters (sysctl)',
    description: 'Optimizes kernel settings via sysctl to prevent IP spoofing, ignore ICMP redirects, and protect against SYN flood attacks.',
    defaultChecked: true,
    category: 'kernel',
    scripts: {
      generic: `cat <<'EOF' > /etc/sysctl.d/99-hardening.conf
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5
net.ipv4.conf.all.log_martians = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1
EOF
sysctl -p /etc/sysctl.d/99-hardening.conf`
    }
  },
  {
    id: 'disable_core_dumps',
    label: 'Disable Core Dumps',
    description: 'Prevents processes from creating core dump files. Core dumps can expose sensitive in-memory data such as passwords and private keys.',
    defaultChecked: true,
    category: 'kernel',
    scripts: {
      generic: `cat <<'EOF' >> /etc/security/limits.conf
* hard core 0
* soft core 0
EOF
cat <<'EOF' >> /etc/sysctl.d/99-hardening.conf
fs.suid_dumpable = 0
kernel.core_pattern = |/bin/false
EOF
sysctl -p /etc/sysctl.d/99-hardening.conf`
    }
  },
  {
    id: 'disable_usb_storage',
    label: 'Disable USB Storage',
    description: 'Blacklists the USB storage kernel module to prevent unauthorized data exfiltration or introduction of malware via USB drives.',
    defaultChecked: false,
    category: 'kernel',
    scripts: {
      generic: `echo "install usb-storage /bin/true" > /etc/modprobe.d/disable-usb-storage.conf
echo "blacklist usb-storage" >> /etc/modprobe.d/disable-usb-storage.conf`
    }
  },
  {
    id: 'enable_aslr',
    label: 'Enable Address Space Layout Randomization (ASLR)',
    description: 'Ensures ASLR is set to full randomization (value 2). ASLR randomizes memory addresses, making it significantly harder to exploit memory corruption vulnerabilities.',
    defaultChecked: true,
    category: 'kernel',
    scripts: {
      generic: `echo "kernel.randomize_va_space = 2" >> /etc/sysctl.d/99-hardening.conf
sysctl -p /etc/sysctl.d/99-hardening.conf`
    }
  },

  // ─── USERS & AUTHENTICATION ───────────────────────────────────────────────────

  {
    id: 'lock_root_account',
    label: 'Lock Root Account Password',
    description: 'Locks the root account\'s password login (root can still be used via sudo). Combined with disabling root SSH, this fully closes the most targeted account.',
    defaultChecked: true,
    category: 'users',
    scripts: {
      generic: 'passwd -l root'
    }
  },
  {
    id: 'password_policy',
    label: 'Enforce Strong Password Policy (PAM)',
    description: 'Configures PAM\'s pwquality module to require passwords that are at least 14 characters long with mixed complexity. Prevents weak passwords on local accounts.',
    defaultChecked: true,
    category: 'users',
    scripts: {
      ubuntu: `apt-get install -y libpam-pwquality
cat <<'EOF' > /etc/security/pwquality.conf
minlen = 14
dcredit = -1
ucredit = -1
ocredit = -1
lcredit = -1
maxrepeat = 3
EOF`,
      debian: `apt-get install -y libpam-pwquality
cat <<'EOF' > /etc/security/pwquality.conf
minlen = 14
dcredit = -1
ucredit = -1
ocredit = -1
lcredit = -1
maxrepeat = 3
EOF`,
      centos: `yum install -y libpwquality
cat <<'EOF' > /etc/security/pwquality.conf
minlen = 14
dcredit = -1
ucredit = -1
ocredit = -1
lcredit = -1
maxrepeat = 3
EOF`
    }
  },
  {
    id: 'password_aging',
    label: 'Configure Password Aging Policy',
    description: 'Sets a 90-day maximum password age, a 1-day minimum, and 7-day expiry warnings for all new user accounts via /etc/login.defs.',
    defaultChecked: true,
    category: 'users',
    scripts: {
      generic: `sed -i "s/^PASS_MAX_DAYS.*/PASS_MAX_DAYS   90/" /etc/login.defs
sed -i "s/^PASS_MIN_DAYS.*/PASS_MIN_DAYS   1/" /etc/login.defs
sed -i "s/^PASS_WARN_AGE.*/PASS_WARN_AGE   7/" /etc/login.defs`
    }
  },
  {
    id: 'sudo_logging',
    label: 'Enable Sudo Command Logging',
    description: 'Configures sudo to log every command to syslog. Provides a clear audit trail of privilege escalation and administrative actions.',
    defaultChecked: true,
    category: 'users',
    scripts: {
      generic: `echo 'Defaults logfile="/var/log/sudo.log"' >> /etc/sudoers.d/hardening
echo 'Defaults log_input,log_output' >> /etc/sudoers.d/hardening
chmod 440 /etc/sudoers.d/hardening`
    }
  },
  {
    id: 'restrict_su',
    label: 'Restrict su to Wheel Group',
    description: 'Limits the use of "su" to members of the "wheel" (or "sudo") group. Prevents arbitrary users from attempting to switch to root.',
    defaultChecked: true,
    category: 'users',
    scripts: {
      ubuntu: `sed -i "s/^#.*pam_wheel.so.*/auth required pam_wheel.so/" /etc/pam.d/su`,
      debian: `sed -i "s/^#.*pam_wheel.so.*/auth required pam_wheel.so/" /etc/pam.d/su`,
      centos: `sed -i "s/^#.*pam_wheel.so.*/auth required pam_wheel.so/" /etc/pam.d/su`
    }
  },
  {
    id: 'disable_ctrl_alt_del',
    label: 'Disable Ctrl+Alt+Del Reboot',
    description: 'Masks the systemd target triggered by Ctrl+Alt+Del. Prevents accidental or malicious reboots from a local or serial console session.',
    defaultChecked: true,
    category: 'users',
    scripts: {
      generic: 'systemctl mask ctrl-alt-del.target && systemctl daemon-reload'
    }
  },

  // ─── FILESYSTEM ───────────────────────────────────────────────────────────────

  {
    id: 'tmp_noexec',
    label: 'Mount /tmp with noexec, nosuid, nodev',
    description: 'Remounts /tmp so that binaries cannot be executed from it and setuid bits are ignored. A very common technique is to drop malware in /tmp and run it directly.',
    defaultChecked: true,
    category: 'filesystem',
    scripts: {
      generic: `echo "tmpfs /tmp tmpfs defaults,noexec,nosuid,nodev 0 0" >> /etc/fstab
mount -o remount,noexec,nosuid,nodev /tmp`
    }
  },
  {
    id: 'secure_sensitive_files',
    label: 'Harden Permissions on Sensitive Files',
    description: 'Tightens permissions on /etc/passwd, /etc/shadow, /etc/group, and /etc/gshadow to their recommended values, preventing unauthorized reads or modifications.',
    defaultChecked: true,
    category: 'filesystem',
    scripts: {
      generic: `chmod 644 /etc/passwd
chmod 600 /etc/shadow
chmod 644 /etc/group
chmod 600 /etc/gshadow
chown root:root /etc/passwd /etc/shadow /etc/group /etc/gshadow`
    }
  },
  {
    id: 'sticky_bit_tmp',
    label: 'Ensure Sticky Bit on World-Writable Directories',
    description: 'Finds all world-writable directories and sets the sticky bit on them. The sticky bit prevents a user from deleting or renaming files owned by other users.',
    defaultChecked: true,
    category: 'filesystem',
    scripts: {
      generic: `find / -xdev -type d -perm -0002 -exec chmod +t {} \\; 2>/dev/null`
    }
  },
  {
    id: 'find_suid_sgid',
    label: 'Audit SUID/SGID Binaries',
    description: 'Lists all SUID and SGID binaries on the system to a log file for review. SUID/SGID binaries run with elevated privileges and are a common privilege escalation vector.',
    defaultChecked: false,
    category: 'filesystem',
    scripts: {
      generic: `find / -xdev \\( -perm -4000 -o -perm -2000 \\) -type f 2>/dev/null | tee /root/suid_sgid_audit.log
echo "SUID/SGID audit saved to /root/suid_sgid_audit.log"`
    }
  },
  {
    id: 'umask_hardening',
    label: 'Set Restrictive Default umask',
    description: 'Changes the default umask to 027, so new files are not world-readable by default. Applies system-wide via /etc/profile and /etc/bash.bashrc.',
    defaultChecked: true,
    category: 'filesystem',
    scripts: {
      generic: `sed -i "s/^UMASK.*/UMASK           027/" /etc/login.defs
echo "umask 027" >> /etc/profile
echo "umask 027" >> /etc/bash.bashrc`
    }
  },

  // ─── SERVICES ─────────────────────────────────────────────────────────────────

  {
    id: 'disable_avahi',
    label: 'Disable Avahi (mDNS) Daemon',
    description: 'Stops and disables the Avahi zero-configuration networking daemon. Avahi is rarely needed on a server and has a history of exploitable vulnerabilities.',
    defaultChecked: true,
    category: 'services',
    scripts: {
      ubuntu: 'systemctl stop avahi-daemon 2>/dev/null; systemctl disable avahi-daemon 2>/dev/null; systemctl mask avahi-daemon 2>/dev/null || true',
      debian: 'systemctl stop avahi-daemon 2>/dev/null; systemctl disable avahi-daemon 2>/dev/null; systemctl mask avahi-daemon 2>/dev/null || true',
      centos: 'systemctl stop avahi-daemon 2>/dev/null; systemctl disable avahi-daemon 2>/dev/null || true'
    }
  },
  {
    id: 'disable_cups',
    label: 'Disable CUPS (Printing) Service',
    description: 'Stops and masks the CUPS printing daemon. No VPS needs a print server and CUPS has been the source of multiple critical remote code execution vulnerabilities.',
    defaultChecked: true,
    category: 'services',
    scripts: {
      ubuntu: 'systemctl stop cups 2>/dev/null; systemctl disable cups 2>/dev/null; systemctl mask cups 2>/dev/null || true',
      debian: 'systemctl stop cups 2>/dev/null; systemctl disable cups 2>/dev/null; systemctl mask cups 2>/dev/null || true',
      centos: 'systemctl stop cups 2>/dev/null; systemctl disable cups 2>/dev/null || true'
    }
  },
  {
    id: 'disable_telnet',
    label: 'Remove Telnet Client & Server',
    description: 'Uninstalls Telnet, which transmits all data (including credentials) in plaintext. Should never be present on a hardened server.',
    defaultChecked: true,
    category: 'services',
    scripts: {
      ubuntu: 'apt-get remove -y telnet telnetd 2>/dev/null || true',
      debian: 'apt-get remove -y telnet telnetd 2>/dev/null || true',
      centos: 'yum remove -y telnet telnet-server 2>/dev/null || true'
    }
  },
  {
    id: 'disable_rsh',
    label: 'Remove rsh / rlogin / rcp Tools',
    description: 'Removes legacy r-commands (rsh, rlogin, rcp) that perform no encryption and rely on IP-based trust. Replaced by SSH in all modern use cases.',
    defaultChecked: true,
    category: 'services',
    scripts: {
      ubuntu: 'apt-get remove -y rsh-client rsh-redone-client 2>/dev/null || true',
      debian: 'apt-get remove -y rsh-client rsh-redone-client 2>/dev/null || true',
      centos: 'yum remove -y rsh rlogin rcp 2>/dev/null || true'
    }
  },
  {
    id: 'restrict_compiler_access',
    label: 'Restrict Compiler Access',
    description: 'Removes execute permissions on gcc/cc compilers for non-root users. Attackers who gain access often compile exploits locally — removing compiler access slows this down.',
    defaultChecked: false,
    category: 'services',
    scripts: {
      generic: `for compiler in gcc cc g++ make; do
  path=$(which $compiler 2>/dev/null)
  [ -n "$path" ] && chmod o-x "$path" && echo "Restricted: $path"
done`
    }
  },

  // ─── LOGGING ──────────────────────────────────────────────────────────────────

  {
    id: 'fail2ban',
    label: 'Install Fail2Ban',
    description: 'Monitors log files for suspicious activity (like repeated failed login attempts) and temporarily bans the offending IP addresses.',
    defaultChecked: true,
    category: 'logging',
    scripts: {
      ubuntu: 'apt-get install -y fail2ban && systemctl enable fail2ban && systemctl start fail2ban',
      debian: 'apt-get install -y fail2ban && systemctl enable fail2ban && systemctl start fail2ban',
      centos: 'yum install -y epel-release && yum install -y fail2ban && systemctl enable fail2ban && systemctl start fail2ban'
    }
  },
  {
    id: 'auditd',
    label: 'Install & Configure Auditd',
    description: 'Installs the Linux Auditing System (auditd) and adds rules to track file access, privilege escalation, and suspicious system calls. Essential for forensic investigation.',
    defaultChecked: false,
    category: 'logging',
    scripts: {
      ubuntu: `apt-get install -y auditd audispd-plugins
systemctl enable auditd && systemctl start auditd
cat <<'EOF' > /etc/audit/rules.d/hardening.rules
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /var/log/auth.log -p wa -k auth_log
-a always,exit -F arch=b64 -S execve -k exec_commands
EOF
augenrules --load`,
      debian: `apt-get install -y auditd audispd-plugins
systemctl enable auditd && systemctl start auditd
cat <<'EOF' > /etc/audit/rules.d/hardening.rules
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /var/log/auth.log -p wa -k auth_log
-a always,exit -F arch=b64 -S execve -k exec_commands
EOF
augenrules --load`,
      centos: `yum install -y audit
systemctl enable auditd && systemctl start auditd
cat <<'EOF' > /etc/audit/rules.d/hardening.rules
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /var/log/secure -p wa -k auth_log
-a always,exit -F arch=b64 -S execve -k exec_commands
EOF
augenrules --load`
    }
  },
  {
    id: 'rsyslog_remote',
    label: 'Configure Remote Syslog Forwarding',
    description: 'Forwards all system logs to a remote syslog server. Centralised logging ensures logs survive even if the server is compromised and wiped.',
    defaultChecked: false,
    category: 'logging',
    scripts: {
      generic: `cat <<'EOF' >> /etc/rsyslog.conf
# Remote log forwarding — added by hardening script
*.* @@{{SYSLOG_SERVER}}:514
EOF
systemctl restart rsyslog`
    }
  },
  {
    id: 'logrotate_ssh',
    label: 'Ensure Auth Log Rotation',
    description: 'Verifies that auth/secure logs are rotated and compressed weekly, with 4 weeks of retention. Prevents logs from filling the disk and ensures older entries are archived.',
    defaultChecked: true,
    category: 'logging',
    scripts: {
      ubuntu: `cat <<'EOF' > /etc/logrotate.d/auth-hardening
/var/log/auth.log {
    weekly
    rotate 4
    compress
    missingok
    notifempty
    sharedscripts
    postrotate
        systemctl reload rsyslog > /dev/null 2>&1 || true
    endscript
}
EOF`,
      centos: `cat <<'EOF' > /etc/logrotate.d/auth-hardening
/var/log/secure {
    weekly
    rotate 4
    compress
    missingok
    notifempty
    sharedscripts
    postrotate
        systemctl reload rsyslog > /dev/null 2>&1 || true
    endscript
}
EOF`
    }
  },

  // ─── SECURITY MODULES ─────────────────────────────────────────────────────────

  {
    id: 'apparmor',
    label: 'Enable AppArmor',
    description: 'Installs and enables AppArmor, a mandatory access control framework that confines programs to a limited set of resources. A critical defence-in-depth layer on Debian/Ubuntu.',
    defaultChecked: true,
    category: 'security_modules',
    scripts: {
      ubuntu: 'apt-get install -y apparmor apparmor-utils && systemctl enable apparmor && systemctl start apparmor && aa-enforce /etc/apparmor.d/* 2>/dev/null || true',
      debian: 'apt-get install -y apparmor apparmor-utils && systemctl enable apparmor && systemctl start apparmor && aa-enforce /etc/apparmor.d/* 2>/dev/null || true'
    }
  },
  {
    id: 'selinux_enforcing',
    label: 'Set SELinux to Enforcing Mode',
    description: 'Switches SELinux from permissive to enforcing mode. SELinux enforces mandatory access control policies that limit what processes can read, write, or execute.',
    defaultChecked: false,
    category: 'security_modules',
    scripts: {
      centos: `sed -i "s/^SELINUX=.*/SELINUX=enforcing/" /etc/selinux/config
setenforce 1 || echo "SELinux enforcing mode set — reboot may be required"`
    }
  },
  {
    id: 'rkhunter',
    label: 'Install rkhunter (Rootkit Hunter)',
    description: 'Installs rkhunter, a tool that scans for rootkits, backdoors, and local exploits. Schedules a daily check and sends the report to the system log.',
    defaultChecked: false,
    category: 'security_modules',
    scripts: {
      ubuntu: `apt-get install -y rkhunter
rkhunter --update
rkhunter --propupd
echo '0 3 * * * root rkhunter --check --skip-keypress --report-warnings-only >> /var/log/rkhunter.log 2>&1' > /etc/cron.d/rkhunter`,
      debian: `apt-get install -y rkhunter
rkhunter --update
rkhunter --propupd
echo '0 3 * * * root rkhunter --check --skip-keypress --report-warnings-only >> /var/log/rkhunter.log 2>&1' > /etc/cron.d/rkhunter`,
      centos: `yum install -y rkhunter
rkhunter --update
rkhunter --propupd
echo '0 3 * * * root rkhunter --check --skip-keypress --report-warnings-only >> /var/log/rkhunter.log 2>&1' > /etc/cron.d/rkhunter`
    }
  },
  {
    id: 'aide',
    label: 'Install AIDE (File Integrity Monitoring)',
    description: 'Installs AIDE (Advanced Intrusion Detection Environment), which builds a database of file checksums and alerts when critical system files are changed.',
    defaultChecked: false,
    category: 'security_modules',
    scripts: {
      ubuntu: `apt-get install -y aide
aideinit
mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db
echo '0 4 * * * root aide --check >> /var/log/aide.log 2>&1' > /etc/cron.d/aide`,
      debian: `apt-get install -y aide
aideinit
mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db
echo '0 4 * * * root aide --check >> /var/log/aide.log 2>&1' > /etc/cron.d/aide`,
      centos: `yum install -y aide
aide --init
mv /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
echo '0 4 * * * root aide --check >> /var/log/aide.log 2>&1' > /etc/cron.d/aide`
    }
  },

  // ─── TOOLS ────────────────────────────────────────────────────────────────────

  {
    id: 'remove_unused_packages',
    label: 'Remove Unused Packages',
    description: 'Cleans up the system by removing packages that are no longer needed, reducing the attack surface.',
    defaultChecked: true,
    category: 'tools',
    scripts: {
      ubuntu: 'apt-get autoremove -y && apt-get autoclean -y',
      debian: 'apt-get autoremove -y && apt-get autoclean -y',
      centos: 'yum autoremove -y'
    }
  },
  {
    id: 'timezone_utc',
    label: 'Set Timezone to UTC',
    description: 'Sets the system timezone to UTC. Consistent timekeeping is crucial for log analysis and synchronization across distributed systems.',
    defaultChecked: true,
    category: 'tools',
    scripts: {
      generic: 'timedatectl set-timezone UTC'
    }
  },
  {
    id: 'ntp_sync',
    label: 'Enable NTP Time Synchronisation',
    description: 'Installs and enables an NTP client (chrony or systemd-timesyncd) to keep the clock accurate. Accurate time is required for log integrity, TLS certificates, and authentication protocols.',
    defaultChecked: true,
    category: 'tools',
    scripts: {
      ubuntu: 'apt-get install -y chrony && systemctl enable chrony && systemctl start chrony',
      debian: 'apt-get install -y chrony && systemctl enable chrony && systemctl start chrony',
      centos: 'yum install -y chrony && systemctl enable chronyd && systemctl start chronyd'
    }
  },
  {
    id: 'install_lynis',
    label: 'Install Lynis Security Auditing Tool',
    description: 'Installs Lynis, an open-source security auditing tool. After hardening you can run "lynis audit system" to get a scored report of remaining issues.',
    defaultChecked: false,
    category: 'tools',
    scripts: {
      ubuntu: 'apt-get install -y lynis',
      debian: 'apt-get install -y lynis',
      centos: 'yum install -y lynis'
    }
  }
];