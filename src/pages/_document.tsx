import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="bg-[#003B49]">
      <Head>
        {/* Paint browser UI on mobile with your brand color */}
        <meta name="theme-color" content="#003B49" />
        {/* Use the phone’s full viewport including notches */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <body className="bg-[#003B49] overflow-x-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
