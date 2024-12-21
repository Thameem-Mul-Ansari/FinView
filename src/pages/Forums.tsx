import { Plus, Search } from 'lucide-react';
import { CategoryFilter } from '../components/CategoryFilter';
import { ThreadCard } from '../components/ThreadCard';
import { threads } from '../lib/threads';
import { Sidebar } from '../components/Sidebar';

function Forums() {
  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fintech Forums</h1>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span>New Thread</span>
          </button>
        </div>
        <Sidebar/>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        <CategoryFilter />

        <div className="space-y-4">
          {threads.map((thread) => (
            <ThreadCard key={thread.id} {...thread} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forums;