import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import BgBubbleBox from "@/components/backgrounds/BgBubbleBox";
import Navigation from "@/components/commons/Navigation";
import AppClientLayout from "@/layouts/AppClientLayout";
import * as MainStyles from "@/styles/MainStyles";
import { SiteConsts } from "@/types/SiteTypes";
import ApiUtils from "@/utils/ApiUtils";

const inter = Inter({ subsets: ["latin"] });

async function generateGuestId() {
  await ApiUtils.request("/api/users/guest", "POST", { useCache: true });
}

export const metadata: Metadata = {
  title: SiteConsts.SITE_TITLE,
  description: SiteConsts.SITE_DESCRIPTION,
  keywords: SiteConsts.SITE_KEYWORDS,
  robots: "index, follow",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // await generateGuestId()

  return (
    <html lang="ko">
      <head>
        <FrontHead />
        <AppClientLayout />
      </head>
      <MainStyles.Body
        style={{
          backgroundColor: "repeating-linear-gradient(45deg, #444, #444 10px, #888 0, #888 20px)",
        }}
      >
        {/* <div className="fixed w-full h-full background-color"></div> */}
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </MainStyles.Body>
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
  themeColor: "#f92392",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
