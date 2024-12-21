import { LineChart } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <LineChart className="h-8 w-8 text-indigo-600" />
      <span className="text-2xl font-bold text-indigo-600">Equitas AI</span>
    </div>
  );
}