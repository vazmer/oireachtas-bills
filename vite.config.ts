import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	// resolve: {
	//   alias: {
	//     '@': path.resolve(__dirname, './app'),
	//     '@hooks': path.resolve(__dirname, './hooks'),
	//   },
	// },
})
