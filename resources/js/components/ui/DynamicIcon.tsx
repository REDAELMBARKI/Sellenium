import * as icons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import DOMPurify from 'dompurify';

type IconName = keyof typeof icons;

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

export default function DynamicIcon({ name, size = 24, ...props }: DynamicIconProps) {

  const isSvg = name.startsWith("<svg");
  if(!isSvg){
    const Icon = icons[name] as React.ComponentType<LucideProps>;
    if (!Icon) return null;
    return <Icon size={size}  {...props} />;
  }
  return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(name) }} /> ;
}