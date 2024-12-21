import { Clock, Bookmark } from 'lucide-react';

interface NewsCardProps {
  category: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  imageUrl: string;
  url: string;
}

export function NewsCard({ category, title, summary, source, time, imageUrl }: NewsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{summary}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {time}
            </div>
            <span className="text-gray-500 text-sm">{source}</span>
          </div>
          <button className="text-gray-500 hover:text-blue-600 transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}