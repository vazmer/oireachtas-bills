import { GlobalStyles, StyledEngineProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './global.css'

async function enableMocking() {
	if (process.env.NODE_ENV !== 'development') {
		return
	}

	const { worker } = await import('./mocks/browser')

	// `worker.start()` returns a Promise that resolves
	// once the Service Worker is up and ready to intercept requests.
	await worker.start()
}

await enableMocking().then(() => {
	ReactDOM.createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<StyledEngineProvider enableCssLayer>
				<GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
				<SnackbarProvider maxSnack={3}>
					<App />
				</SnackbarProvider>
			</StyledEngineProvider>
		</StrictMode>,
	)
})
