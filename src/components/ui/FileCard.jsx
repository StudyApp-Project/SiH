import { FileText, Image, FileBox, File, Download, MoreVertical, Link as LinkIcon, Video } from 'lucide-react';
import { Card } from './Card';
import { IconButton } from './Button';

const iconMap = {
  pdf: FileText,
  image: Image,
  video: Video,
  doc: FileText,
  archive: FileBox,
  link: LinkIcon,
  default: File,
};

const colorMap = {
  pdf: 'text-red-500 bg-red-500/10',
  image: 'text-blue-500 bg-blue-500/10',
  video: 'text-purple-500 bg-purple-500/10',
  doc: 'text-blue-600 bg-blue-600/10',
  archive: 'text-yellow-600 bg-yellow-600/10',
  link: 'text-emerald-500 bg-emerald-500/10',
  default: 'text-(--text-secondary) bg-(--bg-glass)',
};

export function FileCard({ name, type = 'default', size, date, url, onDownload, onMore }) {
  const Icon = iconMap[type] || iconMap.default;
  const colorClass = colorMap[type] || colorMap.default;

  return (
    <Card interactive className="flex items-center gap-3 p-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-(--text-primary) truncate" title={name}>
          {name}
        </h4>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-(--text-muted)">
          {size && <span>{size}</span>}
          {size && date && <span>•</span>}
          {date && <span>{date}</span>}
        </div>
      </div>
      
      <div className="flex items-center gap-1 shrink-0">
        {onDownload && (
          <IconButton size="sm" onClick={onDownload} aria-label="Download file">
            <Download size={14} />
          </IconButton>
        )}
        {onMore && (
          <IconButton size="sm" onClick={onMore} aria-label="More options">
            <MoreVertical size={14} />
          </IconButton>
        )}
      </div>
    </Card>
  );
}
