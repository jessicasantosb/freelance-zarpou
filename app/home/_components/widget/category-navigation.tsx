import {
  Bed,
  Plane,
  Luggage,
  Flame,
  Car,
  Globe,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { id: "hospedagens", label: "Hospedagens", icon: Bed },
  { id: "passagens", label: "Passagens", icon: Plane },
  { id: "pacotes", label: "Pacotes", icon: Luggage },
];

interface CategoryNavigationProps {
  activeTab: string;
  onTabChange: (id: any) => void;
}

export function CategoryNavigation({
  activeTab,
  onTabChange,
}: CategoryNavigationProps) {
  return (
    <nav className="w-full overflow-x-auto scrollbar-hide py-4">
      <ul className="flex items-center gap-2 whitespace-nowrap px-4 md:px-8">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 rounded-md px-5 py-2.5 font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
