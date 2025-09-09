import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '.', // Garante que o Vite leia o .env da raiz
  envPrefix: 'VITE_', // Apenas variáveis com este prefixo serão expostas
})
