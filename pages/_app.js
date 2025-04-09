import "../src/app_old/globals.css";

import { SessionProvider } from "next-auth/react";
import Footer from "../components/Footer";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
