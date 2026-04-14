# HardenBox: VPS Security Hardening Generator

HardenBox is a web-based utility designed to generate comprehensive security hardening scripts for Linux Virtual Private Servers (VPS). It provides a centralized interface to configure and deploy industry-standard security practices across various distributions, including Ubuntu, Debian, and CentOS.

## The Risks of Unhardened Servers

Deploying a VPS with default configurations often leaves the system vulnerable to a wide range of automated and targeted attacks. The principal problems associated with unhardened servers include:

1. **Brute-Force Attacks**: Default SSH configurations often allow root login and password-based authentication, making them primary targets for automated bots attempting to guess credentials.
2. **Exploitation of Unused Services**: Many distributions ship with non-essential services active by default. Each active service increases the attack surface and provides potential entry points for attackers.
3. **Privilege Escalation**: Without restricted sudo access and hardened kernel parameters, a compromise of a low-privileged user or service can quickly lead to full system control.
4. **Outdated Software**: Systems that do not have automated security updates are susceptible to known vulnerabilities that have already been patched by upstream maintainers.
5. **Information Leakage**: Default settings often provide excessive system information in banners or logs, assisting attackers in reconnaissance and exploit selection.
6. **Network Vulnerabilities**: Lack of a properly configured firewall allows unauthorized access to internal ports and services that should not be exposed to the public internet.

## Project Overview

HardenBox addresses these risks by allowing users to generate a customized Bash script (`harden.sh`) that automates the security configuration process. The project focuses on:

- **SSH Hardening**: Disabling root login, changing default ports, and enforcing strong cryptographic ciphers.
- **Firewall Management**: Setting up UFW or firewalld with a default-deny policy.
- **System Auditing**: Installing tools like Auditd, Lynis, and rkhunter for ongoing monitoring.
- **Kernel Optimization**: Tuning sysctl parameters to protect against network-based attacks like SYN floods.
- **User Security**: Enforcing strong password policies and restricting administrative privileges.

## How to Contribute

Contributions to HardenBox are welcome and encouraged. To contribute to the project, please follow these guidelines:

### Adding New Hardening Options
If you wish to add a new security configuration:
1. Define the option in `src/constants.ts`.
2. Provide the corresponding shell commands for supported distributions (Ubuntu, Debian, CentOS).
3. Include a clear, technical description of the security implication for the user documentation.

### Improving Existing Scripts
Security standards evolve. If you find a more secure way to implement an existing feature or a bug in the current script generation logic:
1. Update the relevant script snippets in `src/constants.ts`.
2. Ensure compatibility across all supported distributions.

### Technical Requirements
- Ensure all code is written in TypeScript.
- Maintain a clean and minimalistic design for UI contributions.

### Submission Process
1. Fork the repository.
2. Create a feature branch for your changes.
3. Submit a pull request with a detailed explanation of the security benefits or technical improvements provided by your contribution.
