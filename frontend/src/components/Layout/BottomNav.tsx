interface Tab {
  key: string;
  label: string;
}

interface BottomNavProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export default function BottomNav({ tabs, active, onChange }: BottomNavProps) {
  return (
    <div className="flex gap-2 border-b border-gray-200 bg-white px-4 py-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            active === tab.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
