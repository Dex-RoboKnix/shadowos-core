import React, { useState, useRef, useEffect } from 'react';

const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to System Terminal v1.0', 'Type "help" for commands.']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    
    let output = '';
    
    switch (command) {
      case 'help':
        output = 'Available commands: help, ls, cd, echo, clear, whoami, date, reboot';
        break;
      case 'ls':
        output = 'Documents  Downloads  Music  Pictures  Public';
        break;
      case 'cd':
        output = args[1] ? `cd: no such file or directory: ${args[1]}` : '';
        break;
      case 'echo':
        output = args.slice(1).join(' ');
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        output = 'casper';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'reboot':
        output = 'System is rebooting... (just kidding)';
        break;
      case '':
        break;
      default:
        output = `zsh: command not found: ${command}`;
    }

    setHistory(prev => [...prev, `➜  ~ ${cmd}`, output].filter(Boolean));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="h-full bg-[#1e1e1e] text-[#dadada] p-4 font-mono text-[13px] overflow-auto flex flex-col" onClick={() => document.getElementById('terminal-input')?.focus()}>
      <div className="flex-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
        ))}
      </div>
      <div className="flex items-center mt-2">
        <span className="text-[#34c759] mr-2">➜</span>
        <span className="text-[#5ac8fa] mr-2">~</span>
        <input
          id="terminal-input"
          className="bg-transparent border-none outline-none flex-1 text-[#dadada] caret-block"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default TerminalApp;
