import type { BannerSection } from '@/types/homeEditorType';
import { ThemePalette } from '@/types/ThemeTypes';
import { typePill } from './ThemeUtils';
import { BannerSlotContent } from './BannerSlotContent';
import BannerRenderer from '../../Banner/Partials/BannerRenderer';
import { Banner } from '@/types/bannerTypes';

type BannerPreviewProps = {
  banner : Banner;
};

export function BannerPreview({ banner }: BannerPreviewProps) {
    return <BannerRenderer
               banner={banner}
               isEditor={false}
            />
}