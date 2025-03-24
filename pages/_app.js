import { SessionProvider } from "next-auth/react";
import "../src/app/globals.css"; // adapte si ton CSS est ailleurs

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
