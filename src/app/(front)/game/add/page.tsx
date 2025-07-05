import VersusEditor from '@/components/versus/VersusEditor';
import { SiteConsts } from '@/types/SiteTypes';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {
  const metaData: Metadata = {
    title: SiteConsts.SITE_TITLE,
    description: `VS게임을 만들어보세요 ${SiteConsts.SITE_TITLE}`,
    keywords: SiteConsts.SITE_KEYWORDS,
  };

  return metaData;
}

export default function GameAddPage() {
  return <VersusEditor />;
}
