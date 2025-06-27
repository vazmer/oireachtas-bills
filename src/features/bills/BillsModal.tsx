import { Modal, Tabs, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import { type Bill } from 'bills-api'
import { Markup } from 'interweave'
import { createContext, type ReactNode, use, useState } from 'react'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	boxShadow: 24,
	px: 4,
	py: 2,
	pb: 4,
}

export const BillsModalContext = createContext({
	openModal: (_: Bill) => {},
})

export function useBillsModal() {
	return use(BillsModalContext)
}

function BillTabPanel({
	index,
	hidden,
	longTitle,
	shortTitle,
}: {
	index: number
	hidden: boolean
	shortTitle: string
	longTitle: string
}) {
	return (
		<div
			role="tabpanel"
			hidden={hidden}
			id={`bills-modal-tabpanel-${index}`}
			aria-labelledby={`bills-modal-tab-${index}`}
		>
			<Typography sx={{ mt: 2 }} variant="h6" component="h3">
				{shortTitle}
			</Typography>
			<Typography
				sx={{ mt: 2, overflow: 'scroll', maxHeight: 500 }}
				component="div"
			>
				<Markup content={longTitle} />
			</Typography>
		</div>
	)
}

export default function BillsModalProvider({
	children,
}: {
	children: ReactNode
}) {
	const [open, setOpen] = useState(false)
	const [bill, setBill] = useState<Bill | null>(null)
	const [selectedTabIndex, setSelectedTabIndex] = useState(0)

	const handleOpenModal = (newBill: Bill) => {
		setOpen(true)
		setBill(newBill)
	}

	return (
		<BillsModalContext value={{ openModal: handleOpenModal }}>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="bills-modal-title"
				aria-describedby="bills-modal-description"
			>
				<Box sx={style} component={Paper}>
					{bill && (
						<>
							<Tabs
								value={selectedTabIndex}
								onChange={(_, newValue) => setSelectedTabIndex(newValue)}
								aria-label="Bill tabs in languages"
							>
								<Tab
									label="English"
									id="bills-modal-tab-0"
									aria-controls="bills-modal-tabpanel-0"
								/>
								<Tab
									label="Gaeilge"
									id="bills-modal-tab-1"
									aria-controls="bills-modal-tabpanel-1"
								/>
							</Tabs>
							<BillTabPanel
								index={0}
								hidden={selectedTabIndex !== 0}
								shortTitle={bill?.shortTitleEn}
								longTitle={bill?.longTitleEn}
							/>
							<BillTabPanel
								index={1}
								hidden={selectedTabIndex !== 1}
								shortTitle={bill?.shortTitleGa}
								longTitle={bill?.longTitleGa}
							/>
						</>
					)}
				</Box>
			</Modal>
			{children}
		</BillsModalContext>
	)
}
