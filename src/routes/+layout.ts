export const ssr = import.meta.env.VITE_CAPACITOR_BUILD !== 'true';

export const load = async () => {
  return {
    siteName: 'Centro Cristiano Misión Global Colón',
    siteUrl: 'https://centro-cristiano-colon.vercel.app',
    defaultTitle: 'Centro Cristiano Misión Global Colón',
    defaultDescription: 'Iglesia cristiana en San Juan de Colón, Estado Zulia, Venezuela. Únete a nosotros para adoración, enseñanza y comunidad.',
    defaultImage: '/logo.png'
  };
};
