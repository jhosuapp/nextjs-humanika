import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { AnimatePresence, motion } from "framer-motion";
import { appWithTranslation, useTranslation } from "next-i18next/pages";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { jakarta } from "@/src/config/fonts/fonts";
import { CookieConsent } from "@/src/shared/components/cookie-consent/CookieConsent";
import { CustomScrollbar } from "@/src/shared/components/custom-scrollbar/CustomScrollbar";
import { SmoothScroll } from "@/src/shared/components/smoth-scroll/SmoothScroll";
import { ThemeTransitionOverlay } from "@/src/shared/components/theme-transition/ThemeTransitionOverlay";
import { Toast } from "@/src/shared/components/toast/Toast";
import { Footer } from "@/src/shared/layouts/footer/Footer";
import { Header } from "@/src/shared/layouts/header/Header";
import { useLoaderStore } from "@/src/shared/stores/loader.store";
import { useLenisStore } from "@/src/shared/stores/lenis.store";

import "@/src/styles/globals.css";

config.autoAddCss = false;

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const setIsLoading = useLoaderStore((state) => state.setIsLoading);

  useEffect(() => {
    setIsLoading();
  }, [setIsLoading, router.asPath]);

  useEffect(() => {
    document.documentElement.lang = router.locale ?? "es";
  }, [router.locale]);

  useEffect(() => {
    const scrollToTop = () => {
      useLenisStore.getState().lenis?.scrollTo(0, { immediate: true });
    };
    router.events.on("routeChangeStart", scrollToTop);
    return () => router.events.off("routeChangeStart", scrollToTop);
  }, [router.events]);

  useEffect(() => {
    useLenisStore.getState().lenis?.scrollTo(0, { immediate: true });
  }, []);

  return (
    <div className={`${jakarta.variable} contents`}>
      <SmoothScroll />
      <CustomScrollbar />
      <Header t={t} />
      <AnimatePresence mode="wait">
        <motion.div key={router.asPath}>
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
      <Footer t={t} />
      <CookieConsent t={t} />
      <ThemeTransitionOverlay />
      <Toast t={t} />
      <GoogleTagManager gtmId="GTM-T99QFB7B" />
    </div>
  );
}

export default appWithTranslation(App);
