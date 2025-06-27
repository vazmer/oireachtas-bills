import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Bills from './features/bills/Bills'
import BillsModalProvider from './features/bills/BillsModal'
import { FavoriteBillsProvider } from './features/bills/FavoriteBills'

export default function App() {
	return (
		<Container>
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" sx={{ mb: 2 }}>
					Capaciteam Assignment
				</Typography>
			</Box>
			<BillsModalProvider>
				<FavoriteBillsProvider>
					<Bills />
				</FavoriteBillsProvider>
			</BillsModalProvider>
		</Container>
	)
}
