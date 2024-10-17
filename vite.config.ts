import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as dotenv from 'dotenv';

// load .env variables
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        // @ts-ignore
      '/api': process.env.VITE_API_URL,
    },
  }
})
