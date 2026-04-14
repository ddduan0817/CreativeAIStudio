import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreativeAI Studio - 沉浸式创意写作工作台",
  description: "AI-powered creative writing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
