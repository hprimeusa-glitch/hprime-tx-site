import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ModalProvider } from '@/contexts/ModalContext';
import LeadFormModalWrapper from '@/components/LeadFormModalWrapper';
import UTMTracker from '@/components/UTMTracker';
import { ChromeTop, ChromeBottom } from '@/components/SiteChrome';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/schema';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const SITE_URL = 'https://tx.h-prime-co.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'H-Prime Appliance Repair Services | Fort Worth, TX | Same-Day Service',
  description: 'Professional appliance repair in the Fort Worth Metro area. Same-day service, EPA certified technicians. Repair all major brands - refrigerators, washers, dryers & more. Call (817) 799-6313!',
  keywords: 'appliance repair, Fort Worth, Texas, refrigerator repair, washer repair, dryer repair, same-day service, H-Prime',
  openGraph: {
    title: 'H-Prime Appliance Repair Services | Same-Day Service in Fort Worth, TX',
    description: 'Professional appliance repair in the Fort Worth Metro area. Same-day service, certified technicians.',
    url: SITE_URL,
    siteName: 'H-Prime Appliance Repair Services',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${SITE_URL}/logo-original.jpg`,
        width: 1200,
        height: 630,
        alt: 'H-Prime Appliance Repair Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'H-Prime Appliance Repair Services | Same-Day Service in Fort Worth, TX',
    description: 'Professional appliance repair in the Fort Worth Metro area. Same-day service, certified technicians.',
    images: [`${SITE_URL}/logo-original.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PFMKJRST');
      `}</Script>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PFMKJRST"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <UTMTracker />
        <ModalProvider>
          <ChromeTop />
          <main>{children}</main>
          <LeadFormModalWrapper />
          <ChromeBottom />
        </ModalProvider>
      </body>
    </html>
  );
}
