import * as VersusStyles from '@/styles/VersusStyles';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <VersusStyles.PageLayout>{children}</VersusStyles.PageLayout>;
}
