import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Physique",
  description: "Elliot's workout tracker",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Physique",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c1710",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA / iPhone home screen */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Physique" />
        <meta name="theme-color" content="#0c1710" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0c1710" }}>
        {children}
      </body>
    </html>
  );
}
