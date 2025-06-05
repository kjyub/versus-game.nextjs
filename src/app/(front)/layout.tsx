import Navigation from '@/components/commons/Navigation';

export default function FrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
