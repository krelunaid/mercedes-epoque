import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SyncGarage } from "@/components/sync-garage";
import { AppErrorComponent } from "@/lib/error-component";
import appCss from "../styles.css?url";

const APP_NAME = "Mercedes Époque";
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host ? `https://${host}/og.jpg` : undefined;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "Mercedes classiche e moderne, riservate ai conoscitori." },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "theme-color", content: "#0B0B0B" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: APP_NAME },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preload", href: "/images/mercedes-300-sl-wings.jpg", as: "image", type: "image/jpeg" },
    ],
  }),
  errorComponent: AppErrorComponent,
  notFoundComponent: () => (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-cream">
      <div>
        <p className="font-display text-5xl text-gold">404</p>
        <p className="mt-2 text-sm text-muted">Questa leggenda ha lasciato il garage.</p>
        <a href="/" className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-gold">
          Torna alla home
        </a>
      </div>
    </main>
  ),
  component: () => (
    <html lang="it" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-cream">
        <PreviewHostBridge />
        <AuthProvider>
          <SyncGarage />
          <Outlet />
          <Toaster theme="dark" position="top-center" />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
