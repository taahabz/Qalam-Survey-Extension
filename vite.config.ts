import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
        {
          src: 'public/images',
          dest: '.',
        }
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './index.html',
        background: resolve(__dirname, 'src/background.ts'),
        'content-script-feedback': resolve(__dirname, 'src/content-script-feedback.ts'),
        'content-script-survey': resolve(__dirname, 'src/content-script-survey.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep background and content scripts as .js files in the root
          if (chunkInfo.name === 'background' || 
              chunkInfo.name === 'content-script-feedback' || 
              chunkInfo.name === 'content-script-survey') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
});
