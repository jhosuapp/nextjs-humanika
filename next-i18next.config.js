/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
  },
  // En desarrollo, relee los JSON de public/locales en cada request para que
  // los textos nuevos aparezcan sin reiniciar `npm run dev` (en producción no
  // tiene efecto: next-i18next lo ignora fuera de development).
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
