// pages/Cockpit.tsx — MindRoot Cockpit (Home redesign)
// Design: Sunsama-inspired, flat, clean, minimal
// Mobile-first 390px, Inter font

import { useState } from 'react';
import {
  Home,
  Layers,
  Circle,
  FolderKanban,
  Settings,
  Send,
  Check,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────

type EnergyLevel = 'alta' | 'media' | 'baixa';

interface Task {
  id: string;
  title: string;
  module: string;
  moduleColor: string;
  completed: boolean;
}

interface InboxItem {
  id: string;
  title: string;
  type: string;
}

type NavTab = 'home' | 'triage' | 'raiz' | 'projects' | 'settings';

// ─── Mock Data ────────────────────────────────────────

const DOMAINS = [
  { name: 'saúde', progress: 85, status: 'green' },
  { name: 'finanças', progress: 60, status: 'yellow' },
  { name: 'identidade', progress: 40, status: 'gray' },
  { name: 'documentos', progress: 70, status: 'green' },
  { name: 'memórias', progress: 30, status: 'gray' },
  { name: 'tempo', progress: 55, status: 'yellow' },
  { name: 'comunicação', progress: 80, status: 'green' },
  { name: 'projetos', progress: 45, status: 'yellow' },
  { name: 'arquivos', progress: 25, status: 'gray' },
];

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Revisar orçamento mensal', module: 'finanças', moduleColor: '#3D9970', completed: false },
  { id: '2', title: 'Agendar consulta médica', module: 'saúde', moduleColor: '#2D6BE4', completed: true },
  { id: '3', title: 'Organizar arquivos do projeto', module: 'projetos', moduleColor: '#F59E0B', completed: false },
];

const INITIAL_INBOX: InboxItem[] = [
  { id: '1', title: 'Email importante de João', type: 'email' },
  { id: '2', title: 'Ideia para novo projeto', type: 'ideia' },
  { id: '3', title: 'Lembrete de reunião', type: 'lembrete' },
  { id: '4', title: 'Nota de voz sobre curso', type: 'nota' },
];

// ─── Helpers ──────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'bom dia';
  if (hour < 18) return 'boa tarde';
  return 'boa noite';
}

function formatDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'green': return '#3D9970';
    case 'yellow': return '#F59E0B';
    default: return '#9B9B9B';
  }
}

// ─── Components ───────────────────────────────────────

function StatusBar() {
  const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="h-11 flex items-center justify-between px-6 text-[14px] font-medium text-[#1A1A1A]">
      <span>{time}</span>
      <div className="flex items-center gap-1">
        <div className="flex gap-[2px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[3px] h-3 bg-[#1A1A1A] rounded-sm" style={{ height: `${8 + i * 2}px` }} />
          ))}
        </div>
        <span className="ml-1 text-[12px]">100%</span>
      </div>
    </div>
  );
}

function Header({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <h1 className="text-[22px] font-medium text-[#1A1A1A]">
          {getGreeting()}, {name}
        </h1>
        <p className="text-[12px] text-[#6B6B6B] mt-0.5">{formatDate()}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white text-[14px] font-medium">
        R
      </div>
    </div>
  );
}

function SoulCard({
  selectedEnergy,
  onSelectEnergy,
}: {
  selectedEnergy: EnergyLevel | null;
  onSelectEnergy: (energy: EnergyLevel) => void;
}) {
  const energyOptions: EnergyLevel[] = ['alta', 'media', 'baixa'];

  return (
    <div className="mx-4 bg-white border border-[#E8E7E3] rounded-2xl p-[14px_16px]">
      <div className="text-[10px] font-medium uppercase tracking-[1px] text-[#9B9B9B] mb-2">
        SOUL · AURORA
      </div>
      <p className="text-[14px] text-[#1A1A1A] mb-3">como você está chegando hoje?</p>
      <div className="flex gap-2">
        {energyOptions.map((energy) => (
          <button
            key={energy}
            onClick={() => onSelectEnergy(energy)}
            className={`px-4 py-2 rounded-full text-[12px] font-medium transition-colors duration-150 ${
              selectedEnergy === energy
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#F7F6F3] text-[#6B6B6B] hover:bg-[#EEEDEA]'
            }`}
          >
            {energy}
          </button>
        ))}
      </div>
    </div>
  );
}

function RaizCard() {
  return (
    <div className="mx-4 mt-2 bg-white border border-[#E8E7E3] rounded-2xl p-[14px_16px]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] font-medium uppercase tracking-[1px] text-[#9B9B9B]">
          RAIZ · PANORAMA
        </div>
        <button className="text-[12px] text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors duration-150">
          ver tudo →
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {DOMAINS.map((domain) => (
          <div key={domain.name} className="text-center">
            <p className="text-[9px] text-[#6B6B6B] mb-1 truncate">{domain.name}</p>
            <div className="h-[2px] bg-[#E8E7E3] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${domain.progress}%`,
                  backgroundColor: getStatusColor(domain.status),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaptureInput({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mx-4 mt-4">
      <div className="flex items-center bg-white border border-[#E8E7E3] rounded-xl h-9 px-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) {
              onSubmit();
            }
          }}
          placeholder="o que está na sua cabeça?"
          className="flex-1 bg-transparent text-[13px] text-[#1A1A1A] placeholder:text-[#9B9B9B] outline-none"
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim()}
          className="w-7 h-7 rounded-lg bg-[#1A1A1A] flex items-center justify-center disabled:opacity-30 transition-opacity duration-150"
        >
          <Send className="w-[14px] h-[14px] text-white" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function FocusSection({
  tasks,
  onToggleTask,
}: {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}) {
  return (
    <div className="mx-4 mt-6">
      <div className="text-[11px] font-medium text-[#6B6B6B] mb-2">foco de hoje</div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-[#E8E7E3] rounded-xl p-3 flex items-center gap-3"
          >
            <button
              onClick={() => onToggleTask(task.id)}
              className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors duration-150 ${
                task.completed
                  ? 'bg-[#1A1A1A] border-[#1A1A1A]'
                  : 'border-[#E8E7E3] hover:border-[#9B9B9B]'
              }`}
            >
              {task.completed && <Check className="w-3 h-3 text-white" strokeWidth={2} />}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={`text-[13px] truncate transition-all duration-150 ${
                  task.completed ? 'line-through text-[#9B9B9B]' : 'text-[#1A1A1A]'
                }`}
              >
                {task.title}
              </p>
            </div>
            <span
              className="text-[10px] font-medium px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${task.moduleColor}15`,
                color: task.moduleColor,
              }}
            >
              {task.module}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InboxSection({ items }: { items: InboxItem[] }) {
  return (
    <div className="mx-4 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-medium text-[#6B6B6B]">inbox</span>
        <span className="text-[11px] text-[#9B9B9B]">{items.length} items</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E8E7E3] rounded-[10px] px-3 py-2.5 flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#9B9B9B]" />
            <span className="flex-1 text-[12px] text-[#1A1A1A] truncate">{item.title}</span>
            <span className="text-[10px] text-[#9B9B9B]">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CloseDayButton() {
  return (
    <div className="mx-4 mt-6 mb-4">
      <button className="w-full h-12 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center gap-2 text-[14px] font-medium hover:bg-[#2A2A2A] transition-colors duration-150">
        <Check className="w-[18px] h-[18px]" strokeWidth={1.5} />
        fechar o dia
      </button>
    </div>
  );
}

function BottomNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}) {
  const tabs: { key: NavTab; label: string; icon: React.ReactNode; isCenter?: boolean }[] = [
    { key: 'home', label: 'home', icon: <Home className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
    { key: 'triage', label: 'triage', icon: <Layers className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
    { key: 'raiz', label: 'raiz', icon: <Circle className="w-[18px] h-[18px]" strokeWidth={1.5} />, isCenter: true },
    { key: 'projects', label: 'projects', icon: <FolderKanban className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
    { key: 'settings', label: 'settings', icon: <Settings className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E7E3] h-[72px] flex items-center justify-around px-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        if (tab.isCenter) {
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
                <Circle className="w-[18px] h-[18px] text-white" strokeWidth={1.5} />
              </div>
              <span className="text-[9px] text-[#1A1A1A]">{tab.label}</span>
            </button>
          );
        }

        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <span className={isActive ? 'text-[#1A1A1A]' : 'text-[#9B9B9B]'}>{tab.icon}</span>
            <span className={`text-[9px] ${isActive ? 'text-[#1A1A1A]' : 'text-[#9B9B9B]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Main Component ───────────────────────────────────

export function CockpitPage() {
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(null);
  const [captureText, setCaptureText] = useState('');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [inbox, setInbox] = useState<InboxItem[]>(INITIAL_INBOX);
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleCapture = () => {
    if (!captureText.trim()) return;

    const newItem: InboxItem = {
      id: Date.now().toString(),
      title: captureText.trim(),
      type: 'captura',
    };

    setInbox((prev) => [newItem, ...prev]);
    setCaptureText('');
  };

  return (
    <div className="min-h-dvh bg-[#F7F6F3] pb-[72px]" style={{ maxWidth: 390, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <StatusBar />
      <Header name="Rick" />
      <SoulCard selectedEnergy={selectedEnergy} onSelectEnergy={setSelectedEnergy} />
      <RaizCard />
      <CaptureInput value={captureText} onChange={setCaptureText} onSubmit={handleCapture} />
      <FocusSection tasks={tasks} onToggleTask={handleToggleTask} />
      <InboxSection items={inbox} />
      <CloseDayButton />
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default CockpitPage;
