import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:'/nmec-cultural-guide/',plugins:[react()],build:{sourcemap:false},server:{port:4180,strictPort:true},preview:{port:4181,strictPort:true}});
