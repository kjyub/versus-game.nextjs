import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import AppClientLayout from '@/layouts/AppClientLayout';
import * as MainStyles from '@/styles/MainStyles';
import { SiteConsts } from '@/types/SiteTypes';
import { pretendard } from './fonts';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: SiteConsts.SITE_TITLE,
  description: SiteConsts.SITE_DESCRIPTION,
  keywords: SiteConsts.SITE_KEYWORDS,
  robots: 'index, follow',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <FrontHead />
      </head> 
      <MainStyles.Body
        className={`${pretendard.variable} font-pretendard`}
        style={{
          backgroundColor: 'repeating-linear-gradient(45deg, #444, #444 10px, #888 0, #888 20px)',
        }}
      >
        <Providers>
          <div id="portal"></div>
          <AppClientLayout />
          {children}
        </Providers>
      </MainStyles.Body>
      <Analytics />
    </html>
  );
}

const FrontHead = () => {
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      {/* <script
                src="https://kit.fontawesome.com/181af83e33.js"
                crossOrigin="anonymous"
            ></script> */}
      <meta name="naver-site-verification" content="06d62bf148f52142a78299cd86e47786d11fc182" />
    </>
  );
};

export const viewport: Viewport = {
  themeColor: '#69364a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
