export interface Command {
  name: string;
  description: string;
  syntax: string;
  examples: string[];
}

export interface Category {
  category: string;
  commands: Command[];
}

export const cheatsheetCategories: Category[] = [
  {
    category: "File Operations",
    commands: [
      {
        name: "ls",
        description: "List directory contents",
        syntax: "ls [options] [directory]",
        examples: [
          "ls -la: List all files with details",
          "ls -R: List recursively",
          "ls *.txt: List all text files",
          "ls -lh: List with human-readable sizes",
          "ls -lt: Sort by modification time",
        ],
      },
      {
        name: "cd",
        description: "Change directory",
        syntax: "cd [directory]",
        examples: [
          "cd ..: Go up one level",
          "cd ~: Go to home directory",
          "cd -: Go to previous directory",
          "cd /: Go to root directory",
          "cd ~/Documents: Go to Documents folder",
        ],
      },
      {
        name: "cp",
        description: "Copy files and directories",
        syntax: "cp [options] source destination",
        examples: [
          "cp file.txt backup.txt: Copy file",
          "cp -r dir1 dir2: Copy directory recursively",
          "cp -p file.txt backup.txt: Preserve attributes",
          "cp -i file.txt backup.txt: Interactive mode",
          "cp *.txt directory/: Copy all text files",
        ],
      },
      {
        name: "mv",
        description: "Move/rename files and directories",
        syntax: "mv [options] source destination",
        examples: [
          "mv file.txt newname.txt: Rename file",
          "mv file.txt ~/Documents/: Move file",
          "mv -i file.txt dest.txt: Interactive mode",
          "mv -u file.txt dest.txt: Update only if newer",
          "mv dir1/* dir2/: Move all contents",
        ],
      },
      {
        name: "rm",
        description: "Remove files or directories",
        syntax: "rm [options] file(s)",
        examples: [
          "rm file.txt: Remove file",
          "rm -r directory/: Remove directory recursively",
          "rm -f file.txt: Force remove",
          "rm -i file.txt: Interactive mode",
          "rm -rf directory/: Force remove directory",
        ],
      },
      {
        name: "mkdir",
        description: "Make directories",
        syntax: "mkdir [options] directory",
        examples: [
          "mkdir test: Create directory",
          "mkdir -p a/b/c: Create nested directories",
          "mkdir -m 755 test: Create with permissions",
          "mkdir dir1 dir2: Create multiple directories",
          "mkdir -v test: Verbose output",
        ],
      },
      {
        name: "chmod",
        description: "Change file permissions",
        syntax: "chmod [options] mode file(s)",
        examples: [
          "chmod 755 file.txt: Set specific permissions",
          "chmod u+x script.sh: Add execute permission",
          "chmod -R 644 directory/: Recursive change",
          "chmod a-w file.txt: Remove write permission",
          "chmod g+rw file.txt: Add group permissions",
        ],
      },
      {
        name: "chown",
        description: "Change file owner and group",
        syntax: "chown [options] owner[:group] file(s)",
        examples: [
          "chown user file.txt: Change owner",
          "chown user:group file.txt: Change owner and group",
          "chown -R user directory/: Recursive change",
          "chown :group file.txt: Change group only",
          "chown --reference=file1 file2: Copy ownership",
        ],
      },
      {
        name: "ln",
        description: "Create links between files",
        syntax: "ln [options] target link_name",
        examples: [
          "ln -s file.txt link.txt: Create symbolic link",
          "ln file.txt hard.txt: Create hard link",
          "ln -r file.txt dir/link.txt: Create relative link",
          "ln -sf new.txt link.txt: Force create/update link",
          "ln -T file.txt link.txt: Treat destination as file",
        ],
      },
      {
        name: "find",
        description: "Search for files in directory hierarchy",
        syntax: "find [path] [expression]",
        examples: [
          "find . -name '*.txt': Find by name",
          "find . -type f -size +100M: Find large files",
          "find . -mtime -7: Files modified in last 7 days",
          "find . -exec chmod 644 {} \\;: Execute command",
          "find . -empty: Find empty files/directories",
        ],
      },
      {
        name: "touch",
        description: "Create empty files or update timestamps",
        syntax: "touch [options] file(s)",
        examples: [
          "touch file.txt: Create empty file",
          "touch -t 202401010000 file.txt: Set specific timestamp",
          "touch -a file.txt: Update access time only",
          "touch -m file.txt: Update modification time",
          "touch -c nonexistent: Avoid creating new files",
        ],
      },
      {
        name: "stat",
        description: "Display file status information",
        syntax: "stat [options] file(s)",
        examples: [
          "stat file.txt: Basic file info",
          "stat -c %A file.txt: Show permissions",
          "stat -t file.txt: Terse output",
          "stat -f /: Display filesystem status",
          "stat -L link.txt: Follow symbolic links",
        ],
      },
      {
        name: "mount",
        description: "Mount filesystems",
        syntax: "mount [options] [device] [directory]",
        examples: [
          "mount /dev/sdb1 /mnt: Basic mount",
          "mount -t ext4: Specify filesystem type",
          "mount -o ro /dev/cdrom: Read-only mount",
          "mount -a: Mount all from fstab",
          "mount --bind olddir newdir: Bind mount",
        ],
      },
    ],
  },
  {
    category: "Text Processing",
    commands: [
      {
        name: "cat",
        description: "Concatenate and display files",
        syntax: "cat [options] file(s)",
        examples: [
          "cat file.txt: Display file contents",
          "cat -n file.txt: Show line numbers",
          "cat file1 file2 > file3: Combine files",
          "cat -s file.txt: Squeeze blank lines",
          "cat >> file.txt: Append to file",
        ],
      },
      {
        name: "grep",
        description: "Search text using patterns",
        syntax: "grep [options] pattern [file(s)]",
        examples: [
          "grep 'pattern' file.txt: Search in file",
          "grep -r 'text' directory/: Recursive search",
          "grep -i 'case' file.txt: Case-insensitive",
          "grep -v 'exclude' file.txt: Invert match",
          "grep -c 'count' file.txt: Count matches",
        ],
      },
      {
        name: "sed",
        description: "Stream editor for filtering and transforming text",
        syntax: "sed [options] 'command' [file(s)]",
        examples: [
          "sed 's/old/new/' file.txt: Replace first match",
          "sed 's/old/new/g' file.txt: Replace all matches",
          "sed -i 's/old/new/g' file.txt: Edit file in place",
          "sed '1d' file.txt: Delete first line",
          "sed '/pattern/d' file.txt: Delete matching lines",
        ],
      },
      {
        name: "awk",
        description: "Pattern scanning and text processing",
        syntax: "awk [options] 'program' [file(s)]",
        examples: [
          "awk '{print $1}' file.txt: Print first field",
          "awk -F: '{print $1}' /etc/passwd: Change delimiter",
          "awk 'NR==1{print}' file.txt: Print first line",
          "awk '{sum+=$1} END{print sum}': Calculate sum",
          "awk 'length($0)>80': Lines longer than 80 chars",
        ],
      },
      {
        name: "sort",
        description: "Sort lines of text files",
        syntax: "sort [options] [file(s)]",
        examples: [
          "sort file.txt: Sort lines",
          "sort -r file.txt: Reverse sort",
          "sort -n file.txt: Numeric sort",
          "sort -k2 file.txt: Sort by second field",
          "sort -u file.txt: Sort and remove duplicates",
        ],
      },
      {
        name: "cut",
        description: "Remove sections from lines of files",
        syntax: "cut [options] [file]",
        examples: [
          "cut -d: -f1 /etc/passwd: Extract first field",
          "cut -c1-5 file.txt: First 5 characters",
          "cut -f2 --complement: Exclude field",
          "cut -s -d',' -f3: Suppress lines without delimiter",
          "cut --output-delimiter='|' -f1-3",
        ],
      },
      {
        name: "tr",
        description: "Translate or delete characters",
        syntax: "tr [options] set1 set2",
        examples: [
          "tr a-z A-Z: Convert to uppercase",
          "tr -d '\r': Delete carriage returns",
          "tr -s ' ': Squeeze repeated spaces",
          "tr -cd '[:alnum:]': Delete non-alphanumerics",
          "tr '{}' '()': Replace braces with parentheses",
        ],
      },
      {
        name: "wc",
        description: "Count lines, words, and bytes",
        syntax: "wc [options] [file(s)]",
        examples: [
          "wc file.txt: Basic counts",
          "wc -l: Line count only",
          "wc -w: Word count",
          "wc -c: Byte count",
          "wc -L: Longest line length",
        ],
      },
    ],
  },
  {
    category: "Process Management",
    commands: [
      {
        name: "ps",
        description: "Report process status",
        syntax: "ps [options]",
        examples: [
          "ps aux: Show all processes",
          "ps -ef: Full format listing",
          "ps -u username: Show user's processes",
          "ps -p pid: Show specific process",
          "ps --sort=-%cpu: Sort by CPU usage",
        ],
      },
      {
        name: "top",
        description: "Display system processes",
        syntax: "top [options]",
        examples: [
          "top: Show real-time processes",
          "top -u user: Show user processes",
          "top -p pid: Monitor specific process",
          "top -b: Batch mode output",
          "top -n 1: Single iteration",
        ],
      },
      {
        name: "kill",
        description: "Terminate processes",
        syntax: "kill [options] pid(s)",
        examples: [
          "kill -9 1234: Force kill process",
          "kill -l: List signal names",
          "kill -SIGTERM 1234: Send SIGTERM",
          "killall firefox: Kill all Firefox processes",
          "pkill -u username: Kill user processes",
        ],
      },
      {
        name: "nice",
        description: "Run program with modified scheduling priority",
        syntax: "nice [option] command",
        examples: [
          "nice -n 10 command: Run with lower priority",
          "nice -n -10 command: Run with higher priority",
          "nice command: Run with default nice value",
          "renice -n 5 -p pid: Change running process priority",
          "nice -n 19 bash: Start shell with lowest priority",
        ],
      },
      {
        name: "nohup",
        description: "Run command immune to hangups",
        syntax: "nohup command [args]",
        examples: [
          "nohup command &: Run in background",
          "nohup ./script.sh > output.log &",
          "nohup command > /dev/null 2>&1 &",
          "nohup command </dev/null &",
          "nohup command & disown",
        ],
      },
    ],
  },
  {
    category: "Network Operations",
    commands: [
      {
        name: "ping",
        description: "Send ICMP ECHO_REQUEST to network hosts",
        syntax: "ping [options] destination",
        examples: [
          "ping google.com: Basic ping",
          "ping -c 4 1.1.1.1: Ping 4 times",
          "ping -i 2 host: Ping every 2 seconds",
          "ping -s 1000 host: Set packet size",
          "ping -f host: Flood ping",
        ],
      },
      {
        name: "ssh",
        description: "OpenSSH SSH client",
        syntax: "ssh [options] [user@]hostname [command]",
        examples: [
          "ssh user@server.com: Connect to server",
          "ssh -p 2222 user@host: Connect to specific port",
          "ssh -i key.pem user@host: Use identity file",
          "ssh -X user@host: Enable X11 forwarding",
          "ssh -L 8080:host:80 user@server: Port forwarding",
        ],
      },
      {
        name: "scp",
        description: "Secure copy (remote file copy program)",
        syntax: "scp [options] source destination",
        examples: [
          "scp file.txt user@host:/path/: Copy to remote",
          "scp user@host:/path/file.txt .: Copy from remote",
          "scp -r directory/ user@host:/path/: Copy directory",
          "scp -P 2222 file.txt user@host:/path/: Specific port",
          "scp -i key.pem file.txt user@host:/path/",
        ],
      },
      {
        name: "netstat",
        description: "Network statistics",
        syntax: "netstat [options]",
        examples: [
          "netstat -tulpn: Show active connections",
          "netstat -rn: Show routing table",
          "netstat -an: Show all connections",
          "netstat -s: Show statistics",
          "netstat -i: Show interfaces",
        ],
      },
      {
        name: "curl",
        description: "Transfer data from or to a server",
        syntax: "curl [options] url",
        examples: [
          "curl http://example.com: Get webpage",
          "curl -o file.txt url: Save output to file",
          "curl -X POST url -d data: POST request",
          "curl -H 'Header: Value' url: Custom header",
          "curl -u user:pass url: Basic auth",
        ],
      },
      {
        name: "wget",
        description: "Non-interactive network downloader",
        syntax: "wget [options] url",
        examples: [
          "wget url: Download file",
          "wget -O filename.txt url: Specify output name",
          "wget -c url: Continue interrupted download",
          "wget -r url: Recursive download",
          "wget --mirror url: Mirror website",
        ],
      },
      {
        name: "dig",
        description: "DNS lookup utility",
        syntax: "dig [@server] [name] [type]",
        examples: [
          "dig example.com: Basic lookup",
          "dig +short example.com: Concise output",
          "dig MX example.com: Mail server records",
          "dig -x 1.1.1.1: Reverse lookup",
          "dig +trace example.com: Trace DNS path",
        ],
      },
      {
        name: "traceroute",
        description: "Print network path to host",
        syntax: "traceroute [options] host",
        examples: [
          "traceroute google.com: Basic trace",
          "traceroute -I: Use ICMP",
          "traceroute -q 2: Two queries per hop",
          "traceroute -m 30: Max 30 hops",
          "traceroute -w 1: Wait 1 second",
        ],
      },
    ],
  },
  {
    category: "System Administration",
    commands: [
      {
        name: "systemctl",
        description: "Control the systemd system and service manager",
        syntax: "systemctl [options] command [name]",
        examples: [
          "systemctl start service: Start service",
          "systemctl status service: Check service status",
          "systemctl enable service: Enable on boot",
          "systemctl restart service: Restart service",
          "systemctl list-units: List all units",
        ],
      },
      {
        name: "journalctl",
        description: "Query the systemd journal",
        syntax: "journalctl [options]",
        examples: [
          "journalctl -u service: Show service logs",
          "journalctl -f: Follow new messages",
          "journalctl --since today: Today's logs",
          "journalctl -p err: Show error messages",
          "journalctl --disk-usage: Show log size",
        ],
      },
      {
        name: "useradd",
        description: "Create a new user",
        syntax: "useradd [options] username",
        examples: [
          "useradd -m username: Create home directory",
          "useradd -s /bin/bash user: Specify shell",
          "useradd -G group1,group2 user: Add to groups",
          "useradd -u 1500 user: Specify UID",
          "useradd -e 2024-12-31 user: Set expiry date",
        ],
      },
      {
        name: "crontab",
        description: "Schedule periodic jobs",
        syntax: "crontab [options] [file]",
        examples: [
          "crontab -e: Edit user's jobs",
          "crontab -l: List current jobs",
          "crontab -r: Remove all jobs",
          "crontab /path/to/file: Load from file",
          "echo '0 3 * * * backup' | crontab -: Pipe entry",
        ],
      },
      {
        name: "passwd",
        description: "Change user password",
        syntax: "passwd [options] [username]",
        examples: [
          "passwd: Change own password",
          "passwd username: Change another user's password",
          "passwd -S: Show password status",
          "passwd -l username: Lock account",
          "passwd -e username: Expire password",
        ],
      },
    ],
  },
  {
    category: "Package Management",
    commands: [
      {
        name: "apt",
        description: "Advanced Package Tool (Debian/Ubuntu)",
        syntax: "apt [options] command",
        examples: [
          "apt update: Update package list",
          "apt install package: Install package",
          "apt upgrade: Upgrade all packages",
          "apt remove package: Remove package",
          "apt autoremove: Remove unused dependencies",
        ],
      },
      {
        name: "yum",
        description: "Yellowdog Updater Modified (RHEL/CentOS)",
        syntax: "yum [options] command",
        examples: [
          "yum install package: Install package",
          "yum update: Update all packages",
          "yum search keyword: Search packages",
          "yum remove package: Remove package",
          "yum clean all: Clean cache",
        ],
      },
      {
        name: "dpkg",
        description: "Debian Package Management System",
        syntax: "dpkg [options] action",
        examples: [
          "dpkg -i package.deb: Install package",
          "dpkg -l: List installed packages",
          "dpkg -r package: Remove package",
          "dpkg -S filename: Find package owning file",
          "dpkg -L package: List package contents",
        ],
      },
    ],
  },
  {
    category: "Disk Operations",
    commands: [
      {
        name: "df",
        description: "Report file system disk space usage",
        syntax: "df [options]",
        examples: [
          "df -h: Human readable sizes",
          "df -i: Show inode information",
          "df -T: Show filesystem type",
          "df -x tmpfs: Exclude filesystem type",
          "df --total: Show total",
        ],
      },
      {
        name: "du",
        description: "Estimate file space usage",
        syntax: "du [options] [file(s)]",
        examples: [
          "du -sh *: Summarize sizes in current directory",
          "du -h --max-depth=1: Show directory sizes one level deep",
          "du -sch .: Total size including subdirectories",
          "du -h --apparent-size: Show apparent size",
          "du --exclude='*.txt' directory",
        ],
      },
      {
        name: "fdisk",
        description: "Manipulate disk partition table",
        syntax: "fdisk [options] device",
        examples: [
          "fdisk -l: List partitions",
          "fdisk /dev/sda: Manipulate specific disk",
          "fdisk -l /dev/sda: Show specific disk partitions",
          "fdisk -w: Write table to disk",
          "fdisk -u: Change display units",
        ],
      },
      {
        name: "lsblk",
        description: "List block devices",
        syntax: "lsblk [options]",
        examples: [
          "lsblk: Basic device list",
          "lsblk -o NAME,SIZE,TYPE: Custom columns",
          "lsblk -d: Exclude slaves",
          "lsblk -f: Filesystem information",
          "lsblk -m: Show permissions",
        ],
      },
      {
        name: "mkfs",
        description: "Create filesystem",
        syntax: "mkfs [options] device",
        examples: [
          "mkfs.ext4 /dev/sdb1: Create ext4",
          "mkfs.vfat -F 32 /dev/sdc1: FAT32 format",
          "mkfs -t xfs /dev/sdd1: XFS filesystem",
          "mkfs -L DATA /dev/sde1: Set label",
          "mkfs.ntfs --quick /dev/sdf1: Fast NTFS",
        ],
      },
    ],
  },
  {
    category: "Security & Permissions",
    commands: [
      {
        name: "sudo",
        description: "Execute command as another user",
        syntax: "sudo [options] command",
        examples: [
          "sudo command: Run as root",
          "sudo -u user command: Run as specific user",
          "sudo -l: List allowed commands",
          "sudo -i: Start root shell",
          "sudo -v: Validate timestamp",
        ],
      },
      {
        name: "openssl",
        description: "OpenSSL command line tool",
        syntax: "openssl command [options]",
        examples: [
          "openssl genrsa: Generate RSA key",
          "openssl req -new -key: Generate CSR",
          "openssl x509: Work with certificates",
          "openssl enc -aes-256-cbc: Encrypt file",
          "openssl dgst -sha256: Generate hash",
        ],
      },
      {
        name: "fail2ban",
        description: "Ban hosts that cause multiple authentication errors",
        syntax: "fail2ban-client [options] command",
        examples: [
          "fail2ban-client status: Show status",
          "fail2ban-client status sshd: Check specific jail",
          "fail2ban-client set sshd unbanip: Unban IP",
          "fail2ban-client reload: Reload configuration",
          "fail2ban-client start: Start service",
        ],
      },
      {
        name: "ufw",
        description: "Uncomplicated Firewall",
        syntax: "ufw [options] command",
        examples: [
          "ufw enable: Activate firewall",
          "ufw allow 22/tcp: Permit SSH",
          "ufw deny from 192.168.1.100",
          "ufw status verbose: Current rules",
          "ufw delete allow 22: Remove rule",
        ],
      },
      {
        name: "getenforce",
        description: "SELinux enforcement status",
        syntax: "getenforce",
        examples: [
          "getenforce: Check current mode",
          "setenforce Enforcing: Change mode",
          "setenforce 1: Enable enforcement",
          "setenforce 0: Disable temporarily",
          "sestatus: Detailed SELinux info",
        ],
      },
    ],
  },
  {
    category: "Container Operations",
    commands: [
      {
        name: "docker",
        description: "Docker container operations",
        syntax: "docker [options] command",
        examples: [
          "docker run image: Run container",
          "docker ps: List containers",
          "docker build -t name .: Build image",
          "docker exec -it container command: Execute in container",
          "docker-compose up: Start services",
        ],
      },
      {
        name: "podman",
        description: "Pod Manager tool",
        syntax: "podman [options] command",
        examples: [
          "podman run image: Run container",
          "podman pod create: Create pod",
          "podman build: Build container image",
          "podman generate kube: Generate Kubernetes YAML",
          "podman system reset: Reset podman storage",
        ],
      },
    ],
  },
  {
    category: "System Monitoring",
    commands: [
      {
        name: "htop",
        description: "Interactive process viewer",
        syntax: "htop [options]",
        examples: [
          "htop: Launch interactive viewer",
          "htop -u username: Show user processes",
          "htop -p PID,PID...: Show specific PIDs",
          "htop -s COLUMN: Sort by column",
          "htop -d DELAY: Set delay between updates",
        ],
      },
      {
        name: "iotop",
        description: "Simple top-like I/O monitor",
        syntax: "iotop [options]",
        examples: [
          "iotop: Show I/O usage",
          "iotop -o: Show only processes with I/O",
          "iotop -b: Non-interactive mode",
          "iotop -n NUM: Number of iterations",
          "iotop -P: Only show processes (not threads)",
        ],
      },
      {
        name: "vmstat",
        description: "Report virtual memory statistics",
        syntax: "vmstat [options] [delay [count]]",
        examples: [
          "vmstat: Display VM stats",
          "vmstat 1: Update every second",
          "vmstat -s: Show stats in table",
          "vmstat -d: Show disk statistics",
          "vmstat -a: Show active/inactive memory",
        ],
      },
      {
        name: "lsof",
        description: "List open files",
        syntax: "lsof [options]",
        examples: [
          "lsof: All open files",
          "lsof -u username: User's files",
          "lsof -i :80: Network connections on port 80",
          "lsof /var/log: Files in directory",
          "lsof -c sshd: Processes named sshd",
        ],
      },
      {
        name: "free",
        description: "Display memory usage",
        syntax: "free [options]",
        examples: [
          "free -h: Human-readable",
          "free -s 5: Update every 5 seconds",
          "free -t: Show totals",
          "free -g: Output in GB",
          "free --si: Use power of 1000",
        ],
      },
    ],
  },
  {
    category: "Backup & Recovery",
    commands: [
      {
        name: "rsync",
        description: "Fast, versatile file copying tool",
        syntax: "rsync [options] source destination",
        examples: [
          "rsync -av source/ dest/: Archive and verbose mode",
          "rsync -z --progress src dest: Compress with progress",
          "rsync -aP --delete src/ dest/: Sync directories",
          "rsync -e ssh src user@host:dest: Remote sync",
          "rsync --exclude='*.tmp' src/ dest/: Exclude files",
        ],
      },
      {
        name: "tar",
        description: "Tape archiving utility",
        syntax: "tar [options] [archive] [file(s)]",
        examples: [
          "tar -czf archive.tar.gz files/: Create gzipped tar",
          "tar -xzf archive.tar.gz: Extract gzipped tar",
          "tar -tvf archive.tar: List contents",
          "tar --exclude='*.log' -czf arch.tar.gz dir/",
          "tar -C /dest -xzf archive.tar.gz: Extract to path",
        ],
      },
      {
        name: "dd",
        description: "Convert and copy a file",
        syntax: "dd [operands]",
        examples: [
          "dd if=/dev/sda of=disk.img: Create disk image",
          "dd if=image.iso of=/dev/sdb bs=4M: Write ISO",
          "dd if=/dev/zero of=file bs=1M count=100",
          "dd if=/dev/sda | gzip > disk.img.gz",
          "dd status=progress if=/dev/sda of=/dev/sdb",
        ],
      },
    ],
  },
  {
    category: "System Boot",
    commands: [
      {
        name: "grub2-mkconfig",
        description: "Generate GRUB configuration",
        syntax: "grub2-mkconfig [options]",
        examples: [
          "grub2-mkconfig -o /boot/grub2/grub.cfg",
          "grub2-mkconfig > /boot/grub2/grub.cfg",
          "grub2-mkconfig --output=/boot/grub2/grub.cfg",
          "GRUB_TIMEOUT=5 grub2-mkconfig -o /boot/grub2/grub.cfg",
          "grub2-mkconfig -o /boot/grub2/grub.cfg --verbose",
        ],
      },
      {
        name: "systemd-analyze",
        description: "Analyze system boot-up performance",
        syntax: "systemd-analyze [options] command",
        examples: [
          "systemd-analyze: Show boot time",
          "systemd-analyze blame: List unit times",
          "systemd-analyze critical-chain: Show chain",
          "systemd-analyze plot > boot.svg: Create graph",
          "systemd-analyze verify unit.service",
        ],
      },
    ],
  },
  {
    category: "Media Processing",
    commands: [
      {
        name: "ffmpeg",
        description: "Multimedia framework for handling video/audio",
        syntax: "ffmpeg [options] input output",
        examples: [
          "ffmpeg -i input.mp4 output.avi: Convert format",
          "ffmpeg -i in.mp4 -vf scale=1280:720 out.mp4",
          "ffmpeg -i in.mp4 -ss 00:00:10 -t 00:00:30 out.mp4",
          "ffmpeg -i in.mp4 -an out.mp4: Remove audio",
          "ffmpeg -i video.mp4 -vn -acodec copy audio.aac",
        ],
      },
      {
        name: "imagemagick",
        description: "Image manipulation tools",
        syntax: "convert [options] input output",
        examples: [
          "convert image.jpg image.png: Convert format",
          "convert -resize 50% image.jpg small.jpg",
          "convert -quality 75 image.jpg compressed.jpg",
          "convert image.jpg -rotate 90 rotated.jpg",
          "convert *.jpg images.pdf: Combine to PDF",
        ],
      },
    ],
  },
  {
    category: "Version Control",
    commands: [
      {
        name: "git",
        description: "Distributed version control system",
        syntax: "git [options] command",
        examples: [
          "git clone repo-url: Clone repository",
          "git commit -m 'message': Create commit",
          "git push origin branch: Push changes",
          "git pull origin branch: Fetch and merge",
          "git checkout -b branch: Create branch",
        ],
      },
      {
        name: "svn",
        description: "Subversion version control",
        syntax: "svn [options] command",
        examples: [
          "svn checkout url: Check out repository",
          "svn update: Update working copy",
          "svn commit -m 'msg': Commit changes",
          "svn add file: Schedule for addition",
          "svn status: Show working copy status",
        ],
      },
    ],
  },
  {
    category: "Performance Analysis",
    commands: [
      {
        name: "strace",
        description: "Trace system calls and signals",
        syntax: "strace [options] command",
        examples: [
          "strace command: Trace system calls",
          "strace -p pid: Attach to process",
          "strace -c command: Count time, calls",
          "strace -e trace=network command",
          "strace -f command: Track child processes",
        ],
      },
      {
        name: "perf",
        description: "Performance analysis tools",
        syntax: "perf [options] command",
        examples: [
          "perf stat command: Basic statistics",
          "perf record command: Record events",
          "perf report: Display report",
          "perf top: System profiling UI",
          "perf list: List available events",
        ],
      },
    ],
  },
  {
    category: "Database Management",
    commands: [
      {
        name: "mysql",
        description: "MySQL database client",
        syntax: "mysql [options] [database]",
        examples: [
          "mysql -u root -p: Login as root",
          "mysql -e 'SELECT * FROM table' db",
          "mysqldump -u user -p database > backup.sql",
          "mysql database < file.sql",
          "mysqlcheck -o database: Optimize tables",
        ],
      },
      {
        name: "postgresql",
        description: "PostgreSQL database management",
        syntax: "psql [options] [dbname]",
        examples: [
          "psql -U username database",
          "pg_dump dbname > backup.sql",
          "createdb dbname",
          "dropdb dbname",
          "pg_restore -d dbname backup.sql",
        ],
      },
    ],
  },
  {
    category: "Virtualization",
    commands: [
      {
        name: "virsh",
        description: "Manage virtual machines",
        syntax: "virsh [options] command domain",
        examples: [
          "virsh list --all: List all VMs",
          "virsh start domain: Start VM",
          "virsh shutdown domain: Graceful shutdown",
          "virsh snapshot-create-as domain snap1",
          "virsh edit domain: Edit VM config",
        ],
      },
      {
        name: "virt-install",
        description: "Provision new virtual machines",
        syntax: "virt-install [options]",
        examples: [
          "virt-install --name vm --memory 2048",
          "virt-install --import --disk path=image.qcow2",
          "virt-install --location URL --os-variant=name",
          "virt-install --network bridge=br0",
          "virt-install --graphics vnc",
        ],
      },
    ],
  },
  {
    category: "Log Analysis",
    commands: [
      {
        name: "logrotate",
        description: "Rotate and compress log files",
        syntax: "logrotate [options] config",
        examples: [
          "logrotate /etc/logrotate.conf",
          "logrotate -d config: Debug mode",
          "logrotate -f config: Force rotation",
          "logrotate -s state config",
          "logrotate --usage",
        ],
      },
      {
        name: "goaccess",
        description: "Real-time web log analyzer",
        syntax: "goaccess [options] log_file",
        examples: [
          "goaccess access.log",
          "goaccess access.log -o report.html",
          "goaccess access.log --real-time-html",
          "goaccess access.log -a -o report.html",
          "goaccess --log-format=COMBINED",
        ],
      },
    ],
  },
  {
    category: "Service Discovery",
    commands: [
      {
        name: "consul",
        description: "Service networking platform",
        syntax: "consul [command]",
        examples: [
          "consul agent -dev",
          "consul members",
          "consul kv put",
          "consul services register",
          "consul connect proxy",
        ],
      },
      {
        name: "eureka",
        description: "Service registry",
        syntax: "eureka [options]",
        examples: [
          "eureka-client register",
          "eureka-client fetch-registry",
          "eureka-client renew",
          "eureka-client cancel",
          "eureka-client status",
        ],
      },
    ],
  },
  {
    category: "Networking Advanced",
    commands: [
      {
        name: "tcpdump",
        description: "Network packet analyzer",
        syntax: "tcpdump [options] [expression]",
        examples: [
          "tcpdump -i eth0: Capture on interface",
          "tcpdump port 80: Capture HTTP traffic",
          "tcpdump -w capture.pcap",
          "tcpdump host 192.168.1.1",
          "tcpdump -v -n tcp",
        ],
      },
      {
        name: "iptables",
        description: "Administration tool for IPv4 packet filtering",
        syntax: "iptables [options] command chain rule",
        examples: [
          "iptables -L: List all rules",
          "iptables -A INPUT -p tcp --dport 80 -j ACCEPT",
          "iptables -P INPUT DROP",
          "iptables-save > rules.v4",
          "iptables -F: Flush all rules",
        ],
      },
      {
        name: "ip",
        description: "Network configuration tool",
        syntax: "ip [options] object command",
        examples: [
          "ip addr show: Display addresses",
          "ip route add default via 192.168.1.1",
          "ip link set eth0 up: Enable interface",
          "ip neigh show: ARP table",
          "ip -s link: Statistics",
        ],
      },
      {
        name: "nftables",
        description: "Modern packet filtering",
        syntax: "nft [options]",
        examples: [
          "nft list ruleset: Current rules",
          "nft add table inet filter",
          "nft add chain inet filter input { type filter hook input priority 0 ; }",
          "nft add rule inet filter input tcp dport 22 accept",
          "nft -f rules.nft: Load from file",
        ],
      },
    ],
  },
  {
    category: "Load Balancing",
    commands: [
      {
        name: "haproxy",
        description: "High availability load balancer",
        syntax: "haproxy [options]",
        examples: [
          "haproxy -f config.cfg",
          "haproxy -c -f config.cfg: Check config",
          "haproxy -D -f config.cfg: Daemon mode",
          "haproxy -sf $(cat pid): Soft reload",
          "haproxy -st $(cat pid): Hard stop",
        ],
      },
      {
        name: "nginx",
        description: "HTTP and reverse proxy server",
        syntax: "nginx [options]",
        examples: [
          "nginx -t: Test configuration",
          "nginx -s reload: Reload config",
          "nginx -s stop: Stop server",
          "nginx -c file.conf: Use config file",
          "nginx -V: Show version and config",
        ],
      },
    ],
  },
  {
    category: "Archive & Compression",
    commands: [
      {
        name: "zip",
        description: "Package and compress files",
        syntax: "zip [options] archive files",
        examples: [
          "zip archive.zip file1 file2",
          "zip -r archive.zip directory/",
          "zip -e archive.zip file: Encrypt archive",
          "zip -9 archive.zip file: Maximum compression",
          "zip -u archive.zip file: Update existing archive",
        ],
      },
      {
        name: "gzip",
        description: "Compress or expand files",
        syntax: "gzip [options] file(s)",
        examples: [
          "gzip file: Compress file",
          "gzip -d file.gz: Decompress file",
          "gzip -k file: Keep original file",
          "gzip -l file.gz: List compression info",
          "gzip -9 file: Best compression",
        ],
      },
      {
        name: "7z",
        description: "7-Zip file archiver",
        syntax: "7z [options] command archive files",
        examples: [
          "7z a archive.7z files/: Create archive",
          "7z x archive.7z: Extract with full paths",
          "7z l archive.7z: List contents",
          "7z -p archive.7z: Password protect",
          "7z -mx=9 a archive.7z: Maximum compression",
        ],
      },
    ],
  },
  {
    category: "Hardware Information",
    commands: [
      {
        name: "lscpu",
        description: "Display CPU information",
        syntax: "lscpu [options]",
        examples: [
          "lscpu: Show CPU info",
          "lscpu -e: Extended view",
          "lscpu -J: JSON output",
          "lscpu -p: Parsable output",
          "lscpu --extended=CPU,CORE,SOCKET",
        ],
      },
      {
        name: "lsusb",
        description: "List USB devices",
        syntax: "lsusb [options]",
        examples: [
          "lsusb: List devices",
          "lsusb -v: Verbose info",
          "lsusb -t: Tree view",
          "lsusb -d vendor:product",
          "lsusb -s bus:device",
        ],
      },
      {
        name: "dmidecode",
        description: "DMI table decoder",
        syntax: "dmidecode [options]",
        examples: [
          "dmidecode: Show all info",
          "dmidecode -t system",
          "dmidecode -t memory",
          "dmidecode -t bios",
          "dmidecode -s system-serial-number",
        ],
      },
    ],
  },
  {
    category: "Scheduling & Jobs",
    commands: [
      {
        name: "cron",
        description: "Schedule periodic tasks",
        syntax: "crontab [options]",
        examples: [
          "crontab -l: List jobs",
          "crontab -e: Edit crontab",
          "crontab -r: Remove crontab",
          "crontab file: Install crontab",
          "crontab -u user -l: List user's crontab",
        ],
      },
      {
        name: "at",
        description: "Execute commands at specified time",
        syntax: "at [options] time",
        examples: [
          "at now + 1 hour",
          "at 2:30pm tomorrow",
          "atq: List pending jobs",
          "atrm 1: Remove job #1",
          "at -f script.sh midnight",
        ],
      },
    ],
  },
  {
    category: "Performance Tuning",
    commands: [
      {
        name: "sysctl",
        description: "Configure kernel parameters",
        syntax: "sysctl [options] [variable[=value]]",
        examples: [
          "sysctl -a: Show all parameters",
          "sysctl vm.swappiness=60",
          "sysctl -p: Load settings",
          "sysctl net.ipv4.ip_forward=1",
          "sysctl -w kernel.hostname=name",
        ],
      },
      {
        name: "nice",
        description: "Run with modified scheduling priority",
        syntax: "nice [options] command",
        examples: [
          "nice -n 10 command",
          "nice -n -10 command",
          "renice +1 -u user",
          "renice -n 5 -p pid",
          "nice -n 19 ./script.sh",
        ],
      },
    ],
  },
  {
    category: "User Environment",
    commands: [
      {
        name: "env",
        description: "Display environment variables",
        syntax: "env [options] [name=value] [command]",
        examples: [
          "env: Show all variables",
          "env -i command: Clean environment",
          "env VAR=value command",
          "env --unset=VAR",
          "env -u VAR command",
        ],
      },
      {
        name: "locale",
        description: "Get locale-specific information",
        syntax: "locale [options]",
        examples: [
          "locale: Show current locale",
          "locale -a: List available locales",
          "locale -k LC_TIME",
          "locale -v",
          "locale charmap",
        ],
      },
    ],
  },
  {
    category: "Authentication & Access",
    commands: [
      {
        name: "pam",
        description: "Pluggable Authentication Modules",
        syntax: "pam [module] [type] [control] [arguments]",
        examples: [
          "pam_tally2 --user=username",
          "pam_faillock --user username --reset",
          "pam_unix password requisite nullok",
          "pam_limits.so conf=/etc/limits.conf",
          "pam_access.so accessfile=/etc/access.conf",
        ],
      },
      {
        name: "auth",
        description: "Authentication key management",
        syntax: "auth [options] command",
        examples: [
          "auth add username",
          "auth remove username",
          "auth list",
          "auth update username",
          "auth check username",
        ],
      },
    ],
  },
  {
    category: "SSL/TLS Management",
    commands: [
      {
        name: "certbot",
        description: "Automated SSL/TLS certificate management",
        syntax: "certbot [options] command",
        examples: [
          "certbot certonly --nginx",
          "certbot renew",
          "certbot certificates",
          "certbot delete --cert-name example.com",
          "certbot revoke --cert-path /path/to/cert",
        ],
      },
      {
        name: "keytool",
        description: "Key and certificate management tool",
        syntax: "keytool [options]",
        examples: [
          "keytool -genkey -keystore keystore.jks",
          "keytool -import -trustcacerts",
          "keytool -list -v -keystore keystore.jks",
          "keytool -delete -alias alias_name",
          "keytool -exportcert -file cert.cer",
        ],
      },
    ],
  },
  {
    category: "File System Management",
    commands: [
      {
        name: "mkfs",
        description: "Build a Linux filesystem",
        syntax: "mkfs [options] device",
        examples: [
          "mkfs.ext4 /dev/sdb1",
          "mkfs.xfs /dev/sdc1",
          "mkfs -t ext4 /dev/sdb1",
          "mkfs.fat -F 32 /dev/sdd1",
          "mkfs.btrfs /dev/sde1",
        ],
      },
      {
        name: "tune2fs",
        description: "Adjust tunable filesystem parameters",
        syntax: "tune2fs [options] device",
        examples: [
          "tune2fs -l /dev/sda1: List parameters",
          "tune2fs -j /dev/sdb1: Add journal",
          "tune2fs -L label /dev/sdc1",
          "tune2fs -c 30 /dev/sdd1",
          "tune2fs -i 1m /dev/sde1",
        ],
      },
      {
        name: "lvm",
        description: "Logical Volume Management",
        syntax: "lvm [command]",
        examples: [
          "pvcreate /dev/sdb1",
          "vgcreate vg0 /dev/sdb1",
          "lvcreate -L 10G -n lv0 vg0",
          "lvextend -L +5G /dev/vg0/lv0",
          "pvdisplay",
        ],
      },
    ],
  },
  {
    category: "SELinux Management",
    commands: [
      {
        name: "semanage",
        description: "SELinux policy management tool",
        syntax: "semanage [options] command",
        examples: [
          "semanage port -a -t http_port_t -p tcp 8080",
          "semanage fcontext -a -t httpd_sys_content_t",
          "semanage user -l",
          "semanage boolean -l",
          "semanage login -l",
        ],
      },
      {
        name: "sestatus",
        description: "SELinux status tool",
        syntax: "sestatus [options]",
        examples: [
          "sestatus: Show status",
          "sestatus -v: Verbose output",
          "sestatus -b: List booleans",
          "sestatus -v | grep ssh",
          "sestatus -b | grep httpd",
        ],
      },
    ],
  },
  {
    category: "Network Diagnostics",
    commands: [
      {
        name: "mtr",
        description: "Network diagnostic tool",
        syntax: "mtr [options] host",
        examples: [
          "mtr google.com",
          "mtr -n 8.8.8.8",
          "mtr --report host",
          "mtr -TCP host",
          "mtr -w host",
        ],
      },
      {
        name: "dig",
        description: "DNS lookup utility",
        syntax: "dig [options] name type",
        examples: [
          "dig example.com",
          "dig +short example.com",
          "dig example.com MX",
          "dig @8.8.8.8 example.com",
          "dig -x 8.8.8.8",
        ],
      },
    ],
  },
  {
    category: "Container Orchestration",
    commands: [
      {
        name: "kubectl",
        description: "Kubernetes command-line tool",
        syntax: "kubectl [command] [type] [name] [flags]",
        examples: [
          "kubectl get pods",
          "kubectl create deployment name --image=image",
          "kubectl apply -f file.yaml",
          "kubectl delete pod name",
          "kubectl logs pod-name",
        ],
      },
      {
        name: "helm",
        description: "Kubernetes package manager",
        syntax: "helm [command] [chart]",
        examples: [
          "helm install release chart",
          "helm upgrade release chart",
          "helm rollback release 1",
          "helm list",
          "helm repo update",
        ],
      },
    ],
  },
  {
    category: "System Audit",
    commands: [
      {
        name: "auditd",
        description: "Linux Audit daemon",
        syntax: "auditd [options]",
        examples: [
          "auditctl -w /etc/passwd -p wa",
          "ausearch -f /etc/passwd",
          "aureport --summary",
          "auditctl -l",
          "autrace program",
        ],
      },
      {
        name: "acct",
        description: "Process accounting",
        syntax: "acct [options]",
        examples: [
          "accton /var/log/pacct",
          "sa -a: Show all users",
          "lastcomm username",
          "ac -d: Daily report",
          "ac -p: Per-user report",
        ],
      },
    ],
  },
  {
    category: "Cloud Tools",
    commands: [
      {
        name: "aws",
        description: "AWS Command Line Interface",
        syntax: "aws [options] command",
        examples: [
          "aws s3 cp file s3://bucket/",
          "aws ec2 describe-instances",
          "aws lambda invoke --function-name",
          "aws rds describe-db-instances",
          "aws iam list-users",
        ],
      },
      {
        name: "gcloud",
        description: "Google Cloud Platform CLI",
        syntax: "gcloud [group] [command]",
        examples: [
          "gcloud compute instances list",
          "gcloud storage cp file gs://bucket",
          "gcloud run deploy service",
          "gcloud container clusters get-credentials",
          "gcloud auth login",
        ],
      },
      {
        name: "az",
        description: "Azure Command Line Interface",
        syntax: "az [group] [command]",
        examples: [
          "az vm list",
          "az storage blob upload",
          "az webapp up",
          "az aks get-credentials",
          "az login",
        ],
      },
    ],
  },
  {
    category: "Debugging Tools",
    commands: [
      {
        name: "gdb",
        description: "GNU Debugger",
        syntax: "gdb [options] [program]",
        examples: [
          "gdb program",
          "gdb attach pid",
          "gdb --args program arg1 arg2",
          "gdb -p pid",
          "gdb core-file",
        ],
      },
      {
        name: "valgrind",
        description: "Memory debugging tool",
        syntax: "valgrind [options] program",
        examples: [
          "valgrind --leak-check=full",
          "valgrind --tool=memcheck",
          "valgrind --track-origins=yes",
          "valgrind --show-reachable=yes",
          "valgrind --log-file=valgrind.log",
        ],
      },
    ],
  },
  {
    category: "Service Management",
    commands: [
      {
        name: "supervisord",
        description: "Process control system",
        syntax: "supervisord [options]",
        examples: [
          "supervisorctl status",
          "supervisorctl start program",
          "supervisorctl reload",
          "supervisorctl update",
          "supervisorctl tail program stderr",
        ],
      },
      {
        name: "pm2",
        description: "Process Manager for Node.js",
        syntax: "pm2 [options] command",
        examples: [
          "pm2 start app.js",
          "pm2 list",
          "pm2 monit",
          "pm2 reload all",
          "pm2 logs",
        ],
      },
    ],
  },
  {
    category: "Storage Management",
    commands: [
      {
        name: "ceph",
        description: "Distributed storage system",
        syntax: "ceph [options] command",
        examples: [
          "ceph status",
          "ceph osd tree",
          "ceph df",
          "ceph auth list",
          "ceph mon dump",
        ],
      },
      {
        name: "gluster",
        description: "Scale-out filesystem",
        syntax: "gluster [command]",
        examples: [
          "gluster volume create",
          "gluster peer status",
          "gluster volume info",
          "gluster snapshot create",
          "gluster volume start",
        ],
      },
    ],
  },
  {
    category: "Certificate Management",
    commands: [
      {
        name: "openssl",
        description: "OpenSSL certificate toolkit",
        syntax: "openssl command [options]",
        examples: [
          "openssl req -new -key private.key -out csr.pem",
          "openssl x509 -in cert.pem -text",
          "openssl verify -CAfile ca.crt cert.pem",
          "openssl pkcs12 -export -out cert.pfx",
          "openssl s_client -connect host:port",
        ],
      },
    ],
  },
  {
    category: "DNS Management",
    commands: [
      {
        name: "nslookup",
        description: "Query DNS servers",
        syntax: "nslookup [options] name [server]",
        examples: [
          "nslookup domain.com",
          "nslookup -type=mx domain.com",
          "nslookup -debug domain.com",
          "nslookup -type=any domain.com",
          "nslookup -query=ptr ip-address",
        ],
      },
      {
        name: "host",
        description: "DNS lookup utility",
        syntax: "host [options] name [server]",
        examples: [
          "host domain.com",
          "host -t mx domain.com",
          "host -C domain.com",
          "host -a domain.com",
          "host -v domain.com",
        ],
      },
    ],
  },
  {
    category: "Mail & Messaging",
    commands: [
      {
        name: "postfix",
        description: "Mail server configuration",
        syntax: "postfix [options] command",
        examples: [
          "postfix start",
          "postfix check",
          "postfix flush",
          "postqueue -p",
          "postsuper -d ALL",
        ],
      },
      {
        name: "mutt",
        description: "Text-based mail client",
        syntax: "mutt [options]",
        examples: [
          "mutt -f mailbox",
          "mutt -s subject recipient",
          "mutt -a attachment",
          "mutt -i include_file",
          "mutt -b bcc_address",
        ],
      },
    ],
  },
  {
    category: "Time Management",
    commands: [
      {
        name: "timedatectl",
        description: "Control system time and date",
        syntax: "timedatectl [options] command",
        examples: [
          "timedatectl status",
          "timedatectl set-time yyyy-mm-dd",
          "timedatectl list-timezones",
          "timedatectl set-timezone Zone/City",
          "timedatectl set-ntp true",
        ],
      },
      {
        name: "chronyd",
        description: "NTP client/server",
        syntax: "chronyd [options]",
        examples: [
          "chronyc tracking",
          "chronyc sources",
          "chronyc makestep",
          "chronyc ntpdata",
          "chronyc activity",
        ],
      },
    ],
  },
  {
    category: "Code Analysis",
    commands: [
      {
        name: "splint",
        description: "C program verifier",
        syntax: "splint [options] files",
        examples: [
          "splint program.c",
          "splint +checks program.c",
          "splint -strict program.c",
          "splint -weak program.c",
          "splint -showfunc program.c",
        ],
      },
      {
        name: "clang-tidy",
        description: "C/C++ linter",
        syntax: "clang-tidy [options] files",
        examples: [
          "clang-tidy file.cpp",
          "clang-tidy -checks=* file.cpp",
          "clang-tidy -fix file.cpp",
          "clang-tidy -list-checks",
          "clang-tidy -export-fixes=fixes.yaml",
        ],
      },
    ],
  },
  {
    category: "Build Tools",
    commands: [
      {
        name: "make",
        description: "Build automation tool",
        syntax: "make [options] [target]",
        examples: [
          "make",
          "make install",
          "make clean",
          "make -j4",
          "make VERBOSE=1",
        ],
      },
      {
        name: "cmake",
        description: "Cross-platform build system",
        syntax: "cmake [options] source-dir",
        examples: [
          "cmake .",
          "cmake --build .",
          "cmake -DCMAKE_BUILD_TYPE=Release",
          "cmake --install .",
          "cmake -G 'Generator'",
        ],
      },
    ],
  },
  {
    category: "Security Scanning",
    commands: [
      {
        name: "nmap",
        description: "Network security scanner",
        syntax: "nmap [options] target",
        examples: [
          "nmap -sS target",
          "nmap -p 1-1000 target",
          "nmap -A target",
          "nmap -sV target",
          "nmap --script=vuln target",
        ],
      },
      {
        name: "nikto",
        description: "Web server scanner",
        syntax: "nikto [options] -h target",
        examples: [
          "nikto -h target",
          "nikto -Display V -h target",
          "nikto -Tuning 1 -h target",
          "nikto -ssl -h target",
          "nikto -output report.txt -h target",
        ],
      },
    ],
  },
  {
    category: "Remote Management",
    commands: [
      {
        name: "ansible",
        description: "IT automation system",
        syntax: "ansible [options] pattern",
        examples: [
          "ansible all -m ping",
          "ansible-playbook playbook.yml",
          "ansible-vault create file",
          "ansible-galaxy install role",
          "ansible-inventory --list",
        ],
      },
      {
        name: "salt",
        description: "Configuration management",
        syntax: "salt [options] target command",
        examples: [
          "salt '*' test.ping",
          "salt-key -L",
          "salt '*' state.apply",
          "salt '*' pkg.install nginx",
          "salt '*' service.restart httpd",
        ],
      },
    ],
  },
  {
    category: "Memory Management",
    commands: [
      {
        name: "vmstat",
        description: "Virtual memory statistics",
        syntax: "vmstat [options] [delay [count]]",
        examples: [
          "vmstat 1: Updates every second",
          "vmstat -s: Memory statistics",
          "vmstat -d: Disk statistics",
          "vmstat -p sda1: Partition statistics",
          "vmstat -w: Wide output",
        ],
      },
      {
        name: "swapon",
        description: "Swap space management",
        syntax: "swapon [options] [device]",
        examples: [
          "swapon -s: Show swap usage",
          "swapon /dev/sda2",
          "swapon -a: Enable all swaps",
          "swapon -p 1 /dev/sdb1",
          "swapon --show",
        ],
      },
    ],
  },
  {
    category: "Kernel Management",
    commands: [
      {
        name: "modprobe",
        description: "Add/remove kernel modules",
        syntax: "modprobe [options] module",
        examples: [
          "modprobe module_name",
          "modprobe -r module_name",
          "modprobe -l | grep module",
          "modprobe -v module_name",
          "modprobe --show-depends module",
        ],
      },
      {
        name: "sysctl",
        description: "Kernel parameter management",
        syntax: "sysctl [options] [parameter]",
        examples: [
          "sysctl -a",
          "sysctl net.ipv4.ip_forward=1",
          "sysctl -p",
          "sysctl -w kernel.hostname=host",
          "sysctl --system",
        ],
      },
    ],
  },
  {
    category: "High Availability",
    commands: [
      {
        name: "pacemaker",
        description: "Cluster resource manager",
        syntax: "pcs [options] command",
        examples: [
          "pcs status",
          "pcs cluster start",
          "pcs resource create",
          "pcs constraint location",
          "pcs stonith create",
        ],
      },
      {
        name: "corosync",
        description: "Cluster engine",
        syntax: "corosync [options]",
        examples: [
          "corosync-cfgtool -s",
          "corosync-quorumtool -l",
          "corosync-keygen",
          "corosync -f",
          "corosync-notifyd",
        ],
      },
    ],
  },
  {
    category: "Monitoring & Metrics",
    commands: [
      {
        name: "prometheus",
        description: "Monitoring system",
        syntax: "prometheus [flags]",
        examples: [
          "prometheus --config.file=config.yml",
          "prometheus --storage.tsdb.path=/data",
          "prometheus --web.listen-address=:9090",
          "prometheus --enable-feature=expand-external-labels",
          "prometheus --log.level=debug",
        ],
      },
      {
        name: "collectd",
        description: "System statistics collection",
        syntax: "collectd [options]",
        examples: [
          "collectd -t",
          "collectd -C config-file",
          "collectd -P pid-file",
          "collectd -f",
          "collectd -h",
        ],
      },
    ],
  },
  {
    category: "Network Tunneling",
    commands: [
      {
        name: "wireguard",
        description: "VPN tunnel configuration",
        syntax: "wg [options] command",
        examples: [
          "wg show",
          "wg showconf wg0",
          "wg setconf wg0 config.conf",
          "wg genkey",
          "wg pubkey",
        ],
      },
      {
        name: "openvpn",
        description: "VPN tunnel daemon",
        syntax: "openvpn [options] [config]",
        examples: [
          "openvpn --config client.ovpn",
          "openvpn --genkey",
          "openvpn --status status.log",
          "openvpn --server 10.8.0.0",
          "openvpn --auth-nocache",
        ],
      },
    ],
  },
  {
    category: "Identity Management",
    commands: [
      {
        name: "freeipa",
        description: "Identity management system",
        syntax: "ipa [command]",
        examples: [
          "ipa user-add username",
          "ipa group-add groupname",
          "ipa host-add hostname",
          "ipa service-add service/host",
          "ipa cert-request",
        ],
      },
      {
        name: "sssd",
        description: "System Security Services Daemon",
        syntax: "sssd [options]",
        examples: [
          "sssd -i",
          "sssd -c /etc/sssd/sssd.conf",
          "sssd -d 9",
          "sssd --logger=files",
          "sssd --debug-level=9",
        ],
      },
    ],
  },
  {
    category: "Load Testing",
    commands: [
      {
        name: "ab",
        description: "Apache HTTP server benchmarking",
        syntax: "ab [options] URL",
        examples: [
          "ab -n 1000 -c 10 http://url/",
          "ab -k -n 100 url",
          "ab -p post.txt -T 'application/json'",
          "ab -r -n 1000 url",
          "ab -s 30 url",
        ],
      },
      {
        name: "siege",
        description: "HTTP load testing",
        syntax: "siege [options] [url]",
        examples: [
          "siege -c10 -t1M url",
          "siege -b -t60S url",
          "siege -i -f urls.txt",
          "siege --internet",
          "siege -g url",
        ],
      },
    ],
  },
  {
    category: "Configuration Management",
    commands: [
      {
        name: "puppet",
        description: "Infrastructure automation",
        syntax: "puppet [options] action",
        examples: [
          "puppet agent --test",
          "puppet apply manifest.pp",
          "puppet cert list",
          "puppet module install",
          "puppet resource service",
        ],
      },
      {
        name: "chef",
        description: "Configuration management",
        syntax: "chef [options] command",
        examples: [
          "chef-client",
          "chef generate cookbook",
          "chef exec command",
          "chef shell-init",
          "chef gem install",
        ],
      },
    ],
  },
  {
    category: "Container Runtime",
    commands: [
      {
        name: "containerd",
        description: "Container runtime",
        syntax: "ctr [options] command",
        examples: [
          "ctr containers list",
          "ctr images pull",
          "ctr run --rm image",
          "ctr tasks kill",
          "ctr snapshots list",
        ],
      },
      {
        name: "cri-o",
        description: "Kubernetes container runtime",
        syntax: "crictl [options] command",
        examples: [
          "crictl ps",
          "crictl images",
          "crictl pull image",
          "crictl logs container",
          "crictl exec -it container",
        ],
      },
    ],
  },
  {
    category: "Database Optimization",
    commands: [
      {
        name: "mysqltuner",
        description: "MySQL performance advisor",
        syntax: "mysqltuner [options]",
        examples: [
          "mysqltuner",
          "mysqltuner --host hostname",
          "mysqltuner --user username --pass password",
          "mysqltuner --forcemem 8192",
          "mysqltuner --json",
        ],
      },
      {
        name: "pgbench",
        description: "PostgreSQL benchmark tool",
        syntax: "pgbench [options] [dbname]",
        examples: [
          "pgbench -i dbname",
          "pgbench -c 10 -T 60 dbname",
          "pgbench -f custom.sql",
          "pgbench -S --time 300",
          "pgbench -r --client=10",
        ],
      },
    ],
  },
  {
    category: "Message Queues",
    commands: [
      {
        name: "rabbitmqctl",
        description: "RabbitMQ management tool",
        syntax: "rabbitmqctl [options] command",
        examples: [
          "rabbitmqctl list_queues",
          "rabbitmqctl add_user username password",
          "rabbitmqctl set_permissions",
          "rabbitmqctl status",
          "rabbitmqctl cluster_status",
        ],
      },
      {
        name: "kafka",
        description: "Apache Kafka management",
        syntax: "kafka-topics [options]",
        examples: [
          "kafka-topics --create --topic name",
          "kafka-topics --list",
          "kafka-consumer-groups --list",
          "kafka-console-producer --topic name",
          "kafka-console-consumer --topic name",
        ],
      },
    ],
  },
  {
    category: "Search & Indexing",
    commands: [
      {
        name: "elasticsearch",
        description: "Elasticsearch operations",
        syntax: "curl [options] endpoint",
        examples: [
          "curl -X GET 'localhost:9200/_cat/indices'",
          "curl -X PUT 'localhost:9200/index'",
          "curl -X POST 'localhost:9200/_bulk'",
          "curl -X DELETE 'localhost:9200/index'",
          "curl -X GET 'localhost:9200/_cluster/health'",
        ],
      },
      {
        name: "solr",
        description: "Apache Solr management",
        syntax: "solr [command]",
        examples: [
          "solr start",
          "solr create -c core_name",
          "solr delete -c core_name",
          "solr healthcheck -c core_name",
          "solr auth enable",
        ],
      },
    ],
  },
  {
    category: "Machine Learning Tools",
    commands: [
      {
        name: "conda",
        description: "Package management for ML",
        syntax: "conda [options] command",
        examples: [
          "conda create -n env python=3.8",
          "conda install tensorflow",
          "conda activate env_name",
          "conda list",
          "conda env export > environment.yml",
        ],
      },
      {
        name: "jupyter",
        description: "Interactive computing",
        syntax: "jupyter [options] command",
        examples: [
          "jupyter notebook",
          "jupyter lab",
          "jupyter kernelspec list",
          "jupyter nbconvert notebook.ipynb",
          "jupyter trust notebook.ipynb",
        ],
      },
    ],
  },
  {
    category: "Network QoS",
    commands: [
      {
        name: "tc",
        description: "Traffic control",
        syntax: "tc [options] command",
        examples: [
          "tc qdisc add dev eth0 root tbf",
          "tc class add dev eth0",
          "tc filter add dev eth0",
          "tc -s qdisc show dev eth0",
          "tc filter show dev eth0",
        ],
      },
      {
        name: "wondershaper",
        description: "Traffic shaping tool",
        syntax: "wondershaper [options] interface",
        examples: [
          "wondershaper eth0 1024 512",
          "wondershaper clear eth0",
          "wondershaper status eth0",
          "wondershaper -a eth0 -d 1024 -u 512",
          "wondershaper -c eth0",
        ],
      },
    ],
  },
  {
    category: "Storage Replication",
    commands: [
      {
        name: "drbd",
        description: "Distributed storage replication",
        syntax: "drbdadm [options] command",
        examples: [
          "drbdadm status",
          "drbdadm up resource",
          "drbdadm primary resource",
          "drbdadm secondary resource",
          "drbdadm disconnect resource",
        ],
      },
      {
        name: "rsnapshot",
        description: "Filesystem snapshot utility",
        syntax: "rsnapshot [options] command",
        examples: [
          "rsnapshot hourly",
          "rsnapshot daily",
          "rsnapshot sync",
          "rsnapshot configtest",
          "rsnapshot -t backup",
        ],
      },
    ],
  },
  
  {
    category: "API Management",
    commands: [
      {
        name: "kong",
        description: "API Gateway management",
        syntax: "kong [options] command",
        examples: [
          "kong start",
          "kong reload",
          "kong migrations up",
          "kong health",
          "kong prepare",
        ],
      },
      {
        name: "swagger",
        description: "API documentation tool",
        syntax: "swagger [command]",
        examples: [
          "swagger generate server",
          "swagger validate spec.yaml",
          "swagger generate client",
          "swagger serve spec.yaml",
          "swagger flatten spec.yaml",
        ],
      },
    ],
  },
  {
    category: "Backup Verification",
    commands: [
      {
        name: "bacula",
        description: "Backup verification system",
        syntax: "bconsole [options]",
        examples: [
          "bconsole -n -c verify",
          "bconsole run job=verify",
          "bconsole status dir",
          "bconsole list jobs",
          "bconsole restore select",
        ],
      },
      {
        name: "restic",
        description: "Backup program verification",
        syntax: "restic [options] command",
        examples: [
          "restic check",
          "restic verify",
          "restic snapshots",
          "restic diff snap1 snap2",
          "restic restore latest",
        ],
      },
    ],
  },
  {
    category: "System Recovery",
    commands: [
      {
        name: "systemrescue",
        description: "System rescue toolkit",
        syntax: "sysresccd [options]",
        examples: [
          "sysresccd --list-devices",
          "sysresccd --mount /dev/sda1",
          "sysresccd --copy-ram-root",
          "sysresccd --loadsrc",
          "sysresccd --help",
        ],
      },
      {
        name: "fsck",
        description: "Filesystem check",
        syntax: "fsck [options] device",
        examples: [
          "fsck -f /dev/sda1",
          "fsck -y /dev/sdb1",
          "fsck.ext4 -v /dev/sdc1",
          "fsck -A -y",
          "fsck -M -R",
        ],
      },
    ],
  },
  {
    category: "Compliance Tools",
    commands: [
      {
        name: "openscap",
        description: "Security compliance checker",
        syntax: "oscap [module] command",
        examples: [
          "oscap xccdf eval",
          "oscap oval eval",
          "oscap info file.xml",
          "oscap ds sds-validate",
          "oscap cvss score",
        ],
      },
      {
        name: "lynis",
        description: "Security auditing tool",
        syntax: "lynis [options] command",
        examples: [
          "lynis audit system",
          "lynis update info",
          "lynis show categories",
          "lynis show groups",
          "lynis generate report",
        ],
      },
    ],
  },
  {
    category: "Network Automation",
    commands: [
      {
        name: "ansible",
        description: "Network automation platform",
        syntax: "ansible-network [options]",
        examples: [
          "ansible-network cisco.ios.config",
          "ansible-network arista.eos.facts",
          "ansible-network juniper.junos.command",
          "ansible-network cisco.nxos.bgp",
          "ansible-network facts",
        ],
      },
      {
        name: "nornir",
        description: "Network automation framework",
        syntax: "nornir [options]",
        examples: [
          "nornir inventory",
          "nornir tasks run",
          "nornir config show",
          "nornir devices list",
          "nornir template render",
        ],
      },
    ],
  },
  {
    category: "Storage Encryption",
    commands: [
      {
        name: "cryptsetup",
        description: "Disk encryption tool",
        syntax: "cryptsetup [options] command",
        examples: [
          "cryptsetup luksFormat device",
          "cryptsetup open device name",
          "cryptsetup status device",
          "cryptsetup luksDump device",
          "cryptsetup luksAddKey device",
        ],
      },
      {
        name: "veracrypt",
        description: "Disk encryption utility",
        syntax: "veracrypt [options]",
        examples: [
          "veracrypt --create",
          "veracrypt --mount",
          "veracrypt --dismount",
          "veracrypt --volume-properties",
          "veracrypt --change-password",
        ],
      },
    ],
  },
  {
    category: "Service Mesh",
    commands: [
      {
        name: "istio",
        description: "Service mesh platform",
        syntax: "istioctl [command]",
        examples: [
          "istioctl install",
          "istioctl proxy-status",
          "istioctl analyze",
          "istioctl dashboard kiali",
          "istioctl verify-install",
        ],
      },
      {
        name: "linkerd",
        description: "Ultralight service mesh",
        syntax: "linkerd [command]",
        examples: [
          "linkerd check",
          "linkerd install",
          "linkerd dashboard",
          "linkerd viz",
          "linkerd profile",
        ],
      },
    ],
  },
  {
    category: "Log Management",
    commands: [
      {
        name: "logstash",
        description: "Log processing pipeline",
        syntax: "logstash [options]",
        examples: [
          "logstash -f config.conf",
          "logstash --config.test_and_exit",
          "logstash -e 'input { stdin { } }'",
          "logstash --pipeline.workers 4",
          "logstash --log.level debug",
        ],
      },
      {
        name: "fluentd",
        description: "Data collector",
        syntax: "fluentd [options]",
        examples: [
          "fluentd -c config.conf",
          "fluentd --dry-run",
          "fluentd --daemon /var/run/fluent",
          "fluentd --setup path/to/dir",
          "fluentd -q",
        ],
      },
    ],
  },
  {
    category: "Infrastructure Testing",
    commands: [
      {
        name: "terraform",
        description: "Infrastructure testing",
        syntax: "terraform [command]",
        examples: [
          "terraform init",
          "terraform plan",
          "terraform apply",
          "terraform test",
          "terraform validate",
        ],
      },
      {
        name: "inspec",
        description: "Infrastructure spec testing",
        syntax: "inspec [command]",
        examples: [
          "inspec exec profile",
          "inspec check profile",
          "inspec shell",
          "inspec detect",
          "inspec compliance login",
        ],
      },
    ],
  },
  {
    category: "Cloud Native Tools",
    commands: [
      {
        name: "helm",
        description: "Kubernetes package manager",
        syntax: "helm [command]",
        examples: [
          "helm install release chart",
          "helm upgrade release chart",
          "helm rollback release 1",
          "helm template chart",
          "helm dependency update",
        ],
      },
      {
        name: "argocd",
        description: "GitOps continuous delivery",
        syntax: "argocd [command]",
        examples: [
          "argocd app create",
          "argocd app sync",
          "argocd repo add",
          "argocd login",
          "argocd cluster add",
        ],
      },
    ],
  },
  {
    category: "Access Control",
    commands: [
      {
        name: "keycloak",
        description: "Identity and access management",
        syntax: "kcadm.sh [command]",
        examples: [
          "kcadm.sh config",
          "kcadm.sh create users",
          "kcadm.sh get realms",
          "kcadm.sh update realms",
          "kcadm.sh set-password",
        ],
      },
      {
        name: "authelia",
        description: "Authentication server",
        syntax: "authelia [command]",
        examples: [
          "authelia --config config.yml",
          "authelia hash-password",
          "authelia crypto cert generate",
          "authelia validate-config",
          "authelia storage migrate",
        ],
      },
    ],
  },
  {
    category: "Performance Profiling",
    commands: [
      {
        name: "perf",
        description: "Performance analysis tool",
        syntax: "perf [command]",
        examples: [
          "perf record -F 99 -a -g",
          "perf report",
          "perf top",
          "perf stat command",
          "perf list",
        ],
      },
      {
        name: "flame",
        description: "Flamegraph generator",
        syntax: "flamegraph.pl [options]",
        examples: [
          "perf script | stackcollapse-perf.pl | flamegraph.pl",
          "flamegraph.pl --width 1800",
          "flamegraph.pl --colors java",
          "flamegraph.pl --countname samples",
          "flamegraph.pl --reverse",
        ],
      },
    ],
  },
  {
    category: "Distributed Systems",
    commands: [
      {
        name: "zookeeper",
        description: "Distributed coordination",
        syntax: "zkCli.sh [options]",
        examples: [
          "zkCli.sh -server host:port",
          "zkCli.sh get /path",
          "zkCli.sh create /path data",
          "zkCli.sh ls /",
          "zkCli.sh delete /path",
        ],
      },
      {
        name: "etcd",
        description: "Key-value store",
        syntax: "etcdctl [command]",
        examples: [
          "etcdctl put key value",
          "etcdctl get key",
          "etcdctl watch prefix",
          "etcdctl member list",
          "etcdctl snapshot save",
        ],
      },
    ],
  },
  {
    category: "Monitoring Tools",
    commands: [
      {
        name: "grafana",
        description: "Metrics visualization",
        syntax: "grafana-cli [command]",
        examples: [
          "grafana-cli plugins install",
          "grafana-cli admin reset-admin-password",
          "grafana-cli plugins ls",
          "grafana-cli server",
          "grafana-cli upgrade",
        ],
      },
      {
        name: "prometheus",
        description: "Metrics collection",
        syntax: "promtool [command]",
        examples: [
          "promtool check config",
          "promtool query instant",
          "promtool tsdb bench",
          "promtool debug pprof",
          "promtool check rules",
        ],
      },
    ],
  },
  {
    category: "GitOps Tools",
    commands: [
      {
        name: "flux",
        description: "GitOps toolkit",
        syntax: "flux [command]",
        examples: [
          "flux bootstrap github",
          "flux create source git",
          "flux reconcile source git",
          "flux suspend kustomization",
          "flux get helmreleases",
        ],
      },
      {
        name: "jenkinsx",
        description: "Cloud native CI/CD",
        syntax: "jx [command]",
        examples: [
          "jx create cluster",
          "jx preview",
          "jx promote",
          "jx pipeline",
          "jx git setup",
        ],
      },
    ],
  },
  {
    category: "Serverless Tools",
    commands: [
      {
        name: "serverless",
        description: "Serverless framework",
        syntax: "serverless [options]",
        examples: [
          "serverless deploy",
          "serverless invoke",
          "serverless logs",
          "serverless remove",
          "serverless package",
        ],
      },
      {
        name: "openfaas",
        description: "Functions as a service",
        syntax: "faas-cli [command]",
        examples: [
          "faas-cli up",
          "faas-cli deploy",
          "faas-cli list",
          "faas-cli store list",
          "faas-cli invoke function",
        ],
      },
    ],
  },
  {
    category: "Network Security",
    commands: [
      {
        name: "snort",
        description: "Network intrusion detection",
        syntax: "snort [options]",
        examples: [
          "snort -c snort.conf",
          "snort -v",
          "snort -T",
          "snort -N",
          "snort -A console",
        ],
      },
      {
        name: "suricata",
        description: "Network security monitor",
        syntax: "suricata [options]",
        examples: [
          "suricata -c config.yaml",
          "suricata -i eth0",
          "suricata -v",
          "suricata --list-runmodes",
          "suricata -T",
        ],
      },
    ],
  },
  {
    category: "Application Performance",
    commands: [
      {
        name: "arthas",
        description: "Java diagnostics tool",
        syntax: "arthas [command]",
        examples: [
          "arthas-boot.jar",
          "arthas thread",
          "arthas dashboard",
          "arthas profiler",
          "arthas watch",
        ],
      },
      {
        name: "jmeter",
        description: "Load testing tool",
        syntax: "jmeter [options]",
        examples: [
          "jmeter -n -t test.jmx",
          "jmeter -g results.jtl",
          "jmeter -j logfile",
          "jmeter -l results.log",
          "jmeter -r",
        ],
      },
    ],
  },
  {
    category: "Container Security",
    commands: [
      {
        name: "trivy",
        description: "Container vulnerability scanner",
        syntax: "trivy [options] target",
        examples: [
          "trivy image alpine:3.15",
          "trivy fs directory",
          "trivy repo repo-url",
          "trivy kubernetes cluster",
          "trivy config terraform/",
        ],
      },
      {
        name: "falco",
        description: "Runtime security",
        syntax: "falco [options]",
        examples: [
          "falco -r rules.yaml",
          "falco -c falco.yaml",
          "falco -A",
          "falco -L debug",
          "falco -k key.pem",
        ],
      },
    ],
  },
  {
    category: "Infrastructure Automation",
    commands: [
      {
        name: "terraform",
        description: "Infrastructure as code",
        syntax: "terraform [command]",
        examples: [
          "terraform init",
          "terraform plan",
          "terraform apply",
          "terraform destroy",
          "terraform import",
        ],
      },
      {
        name: "pulumi",
        description: "Modern infrastructure as code",
        syntax: "pulumi [command]",
        examples: [
          "pulumi up",
          "pulumi preview",
          "pulumi destroy",
          "pulumi stack",
          "pulumi config",
        ],
      },
    ],
  },
  {
    category: "Site Reliability",
    commands: [
      {
        name: "chaos-mesh",
        description: "Chaos engineering platform",
        syntax: "chaos-mesh [command]",
        examples: [
          "chaos-mesh create",
          "chaos-mesh pause",
          "chaos-mesh resume",
          "chaos-mesh delete",
          "chaos-mesh events",
        ],
      },
      {
        name: "litmus",
        description: "Chaos engineering toolkit",
        syntax: "litmusctl [command]",
        examples: [
          "litmusctl create experiment",
          "litmusctl run",
          "litmusctl status",
          "litmusctl describe",
          "litmusctl delete",
        ],
      },
    ],
  },
  {
    category: "Data Pipeline Tools",
    commands: [
      {
        name: "airflow",
        description: "Workflow orchestration",
        syntax: "airflow [command]",
        examples: [
          "airflow db init",
          "airflow dags list",
          "airflow tasks test",
          "airflow scheduler",
          "airflow webserver",
        ],
      },
      {
        name: "nifi",
        description: "Data flow automation",
        syntax: "nifi [command]",
        examples: [
          "nifi.sh start",
          "nifi.sh status",
          "nifi.sh stop",
          "nifi.sh run",
          "nifi.sh set-sensitive-properties",
        ],
      },
    ],
  },
  {
    category: "Edge Computing",
    commands: [
      {
        name: "k3s",
        description: "Lightweight Kubernetes",
        syntax: "k3s [command]",
        examples: [
          "k3s server",
          "k3s agent",
          "k3s kubectl",
          "k3s secrets",
          "k3s certificate",
        ],
      },
      {
        name: "edgex",
        description: "Edge computing framework",
        syntax: "edgex [command]",
        examples: [
          "edgex start",
          "edgex stop",
          "edgex status",
          "edgex logs",
          "edgex help",
        ],
      },
    ],
  },
  {
    category: "Observability Tools",
    commands: [
      {
        name: "jaeger",
        description: "Distributed tracing",
        syntax: "jaeger [command]",
        examples: [
          "jaeger-all-in-one",
          "jaeger-collector",
          "jaeger-agent",
          "jaeger-ingester",
          "jaeger-query",
        ],
      },
      {
        name: "datadog",
        description: "Monitoring and analytics",
        syntax: "datadog-agent [command]",
        examples: [
          "datadog-agent start",
          "datadog-agent status",
          "datadog-agent check",
          "datadog-agent configcheck",
          "datadog-agent diagnose",
        ],
      },
    ],
  },
  {
    category: "Pipeline Security",
    commands: [
      {
        name: "snyk",
        description: "Security scanning",
        syntax: "snyk [command]",
        examples: [
          "snyk test",
          "snyk monitor",
          "snyk container",
          "snyk code",
          "snyk iac",
        ],
      },
      {
        name: "anchore",
        description: "Container security",
        syntax: "anchore-cli [command]",
        examples: [
          "anchore-cli image add",
          "anchore-cli image vuln",
          "anchore-cli evaluate check",
          "anchore-cli registry add",
          "anchore-cli policy add",
        ],
      },
    ],
  },
  {
    category: "Low-Level System Tools",
    commands: [
      {
        name: "strace",
        description: "System call tracer",
        syntax: "strace [options] command",
        examples: [
          "strace -f command",
          "strace -p pid",
          "strace -c -p pid",
          "strace -e trace=network",
          "strace -o output.txt",
        ],
      },
      {
        name: "ltrace",
        description: "Library call tracer",
        syntax: "ltrace [options] command",
        examples: [
          "ltrace ./program",
          "ltrace -p pid",
          "ltrace -c command",
          "ltrace -S command",
          "ltrace -f command",
        ],
      },
      {
        name: "sysdig",
        description: "System exploration and troubleshooting",
        syntax: "sysdig [options]",
        examples: [
          "sysdig -c spy_users",
          "sysdig -cl",
          "sysdig proc.name=nginx",
          "sysdig -w trace.scap",
          "sysdig -r trace.scap",
        ],
      },
    ],
  },
  {
    category: "High Availability Tools",
    commands: [
      {
        name: "heartbeat",
        description: "Node availability monitoring",
        syntax: "heartbeat [options]",
        examples: [
          "heartbeat -R",
          "heartbeat status",
          "heartbeat restart",
          "heartbeat -d",
          "heartbeat reload",
        ],
      },
      {
        name: "keepalived",
        description: "Load balancing and high-availability",
        syntax: "keepalived [options]",
        examples: [
          "keepalived -f config",
          "keepalived -P",
          "keepalived -D",
          "keepalived -n",
          "keepalived -l",
        ],
      },
    ],
  },
  {
    category: "Caching Systems",
    commands: [
      {
        name: "redis-cli",
        description: "Redis command line interface",
        syntax: "redis-cli [options] [command]",
        examples: [
          "redis-cli ping",
          "redis-cli set key value",
          "redis-cli get key",
          "redis-cli info",
          "redis-cli monitor",
        ],
      },
      {
        name: "memcached",
        description: "Memory caching system",
        syntax: "memcached [options]",
        examples: [
          "memcached -d",
          "memcached -m 64",
          "memcached -p 11211",
          "memcached -vv",
          "memcached -u memcached",
        ],
      },
    ],
  },
  {
    category: "Event Streaming",
    commands: [
      {
        name: "kafka",
        description: "Distributed streaming platform",
        syntax: "kafka-topics.sh [options]",
        examples: [
          "kafka-topics.sh --create",
          "kafka-topics.sh --list",
          "kafka-topics.sh --describe",
          "kafka-topics.sh --alter",
          "kafka-topics.sh --delete",
        ],
      },
      {
        name: "rabbitmq",
        description: "Message broker",
        syntax: "rabbitmqctl [command]",
        examples: [
          "rabbitmqctl status",
          "rabbitmqctl list_queues",
          "rabbitmqctl list_exchanges",
          "rabbitmqctl add_user",
          "rabbitmqctl set_permissions",
        ],
      },
    ],
  },
  {
    category: "AI/ML Operations",
    commands: [
      {
        name: "kubeflow",
        description: "Machine learning toolkit for Kubernetes",
        syntax: "kfctl [command]",
        examples: [
          "kfctl apply",
          "kfctl build",
          "kfctl delete",
          "kfctl generate",
          "kfctl version",
        ],
      },
      {
        name: "mlflow",
        description: "Machine learning lifecycle platform",
        syntax: "mlflow [command]",
        examples: [
          "mlflow run",
          "mlflow models serve",
          "mlflow experiments create",
          "mlflow artifacts log",
          "mlflow ui",
        ],
      },
    ],
  },
  {
    category: "Database Replication",
    commands: [
      {
        name: "pgpool",
        description: "PostgreSQL connection pooling/replication",
        syntax: "pgpool [options]",
        examples: [
          "pgpool -n",
          "pgpool -f config.conf",
          "pgpool -m fast stop",
          "pgpool -D",
          "pgpool status",
        ],
      },
      {
        name: "galera",
        description: "MySQL/MariaDB synchronous replication",
        syntax: "galera_new_cluster",
        examples: [
          "galera_new_cluster",
          "wsrep_sst_rsync",
          "wsrep_sst_mariabackup",
          "wsrep_notify_cmd",
          "garbd -d",
        ],
      },
    ],
  },
  {
    category: "Network Optimization",
    commands: [
      {
        name: "netdata",
        description: "Real-time performance monitoring",
        syntax: "netdata [options]",
        examples: [
          "netdata -D",
          "netdata -W set",
          "netdata -v",
          "netdata -c config",
          "netdata -p pid",
        ],
      },
      {
        name: "bmon",
        description: "Bandwidth monitor",
        syntax: "bmon [options]",
        examples: [
          "bmon -p eth0",
          "bmon -r 1",
          "bmon -o curses",
          "bmon -i all",
          "bmon -b",
        ],
      },
    ],
  },
  {
    category: "Cluster Management",
    commands: [
      {
        name: "rancher",
        description: "Container management platform",
        syntax: "rancher [command]",
        examples: [
          "rancher clusters create",
          "rancher kubectl",
          "rancher projects",
          "rancher nodes",
          "rancher apps",
        ],
      },
      {
        name: "openshift",
        description: "Enterprise Kubernetes platform",
        syntax: "oc [command]",
        examples: [
          "oc login",
          "oc new-project",
          "oc new-app",
          "oc get pods",
          "oc rollout",
        ],
      },
    ],
  },
  {
    category: "Security Hardening",
    commands: [
      {
        name: "apparmor",
        description: "Application security system",
        syntax: "apparmor_parser [options]",
        examples: [
          "apparmor_parser -r profile",
          "apparmor_parser -C",
          "apparmor_parser -Q",
          "apparmor_status",
          "aa-enforce /etc/apparmor.d/profile",
        ],
      },
      {
        name: "auditd",
        description: "System audit daemon",
        syntax: "auditctl [options]",
        examples: [
          "auditctl -l",
          "auditctl -w /path -p rwxa",
          "auditctl -a always,exit",
          "auditctl -s",
          "auditctl -e 1",
        ],
      },
    ],
  },
  {
    category: "Visualization Tools",
    commands: [
      {
        name: "kibana",
        description: "Data visualization platform",
        syntax: "kibana [options]",
        examples: [
          "kibana --config kibana.yml",
          "kibana --port 5601",
          "kibana --host localhost",
          "kibana --verbose",
          "kibana --quiet",
        ],
      },
      {
        name: "grafana",
        description: "Metrics visualization",
        syntax: "grafana-server [options]",
        examples: [
          "grafana-server start",
          "grafana-server -config config.ini",
          "grafana-server -homepath /usr/share/grafana",
          "grafana-server -pidfile file",
          "grafana-server version",
        ],
      },
    ],
  },
];

export default cheatsheetCategories;