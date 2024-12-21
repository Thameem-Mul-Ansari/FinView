import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ThreadCardProps {
  title: string;
  author: string;
  avatar: string;
  preview: string;
  replies: number;
  likes: number;
  views: number;
  tags: string[];
  createdAt: Date;
}

export function ThreadCard({ title, author, avatar, preview, replies, likes, views, tags, createdAt }: ThreadCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        <img src={avatar} alt={author} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{preview}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {replies}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {views}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">by</span>
              <span className="text-sm font-medium text-gray-700">{author}</span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}