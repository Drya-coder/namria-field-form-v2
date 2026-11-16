import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NAMRIA Field Observation',
    short_name: 'NAMRIA Form',
    description: 'Field Observation for Land Classification Offline App',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#182848',
    icons: [
      {
        src: '/namria%20logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/namria%20logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
