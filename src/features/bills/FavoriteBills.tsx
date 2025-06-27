import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import {
	Box,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Stack,
	IconButton,
	Tooltip,
	type TooltipProps,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import { type Bill } from 'bills-api'
import { useSnackbar } from 'notistack'
import {
	type ActionDispatch,
	createContext,
	Fragment,
	type ReactNode,
	use,
	useMemo,
	useReducer,
} from 'react'
import { toggleFavoriteBill } from '../../utils/bills'
import { BillStatus } from './BillsStatus'

type ActionDispatchArg = {
	type: 'added' | 'removed'
	bill: Bill
}

const FavoriteBillsContext = createContext<{
	favoriteBills: Bill[]
	favoriteBillsNormalised: Record<Bill['id'], Bill>
	dispatch: ActionDispatch<[ActionDispatchArg]>
}>({
	favoriteBills: [],
	favoriteBillsNormalised: {},
	dispatch: (_) => {},
})

function favoriteBillsReducer(
	favoriteBills: Record<Bill['id'], Bill>,
	{ type, bill }: ActionDispatchArg,
) {
	switch (type) {
		case 'added': {
			return { ...favoriteBills, [bill.id]: bill }
		}
		case 'removed': {
			const clonedFavoriteBills = { ...favoriteBills }
			delete clonedFavoriteBills[bill.id]
			return clonedFavoriteBills
		}
		default: {
			throw Error(`Unknown action: ${type}`)
		}
	}
}

export function FavoriteBillsProvider({ children }: { children: ReactNode }) {
	const [favoriteBills, dispatch] = useReducer(favoriteBillsReducer, {})

	const favouriteBillsMemoised = useMemo(
		() =>
			Object.entries(favoriteBills).map(([id, bill]) => ({
				...bill,
				id,
			})),
		[favoriteBills],
	)
	return (
		<FavoriteBillsContext
			value={{
				favoriteBills: favouriteBillsMemoised,
				favoriteBillsNormalised: favoriteBills,
				dispatch,
			}}
		>
			{children}
		</FavoriteBillsContext>
	)
}

export function useFavoriteBills() {
	const { favoriteBills, favoriteBillsNormalised, dispatch } =
		use(FavoriteBillsContext)
	return { favoriteBills, favoriteBillsNormalised, dispatch }
}

export function FavouriteButton({
	bill,
	tooltipPlacement = 'left',
}: {
	bill: Bill
	tooltipPlacement?: TooltipProps['placement']
}) {
	const { dispatch, favoriteBillsNormalised } = useFavoriteBills()
	const favorite = useMemo(
		() => !!favoriteBillsNormalised[bill.id],
		[favoriteBillsNormalised, bill.id],
	)
	const { enqueueSnackbar } = useSnackbar()

	const handleToggleFavourite = async () => {
		// let's use the optimist approach here and trust the server
		dispatch({ type: !favorite ? 'added' : 'removed', bill })

		try {
			await toggleFavoriteBill(bill, favorite)
			enqueueSnackbar(
				!favorite
					? `Bill #${bill.billNo} successfully set as favorite`
					: `Bill #${bill.billNo} successfully un-favorited`,
				{ variant: 'success' },
			)
		} catch {
			// revert the favorite state, and show an error snack
			dispatch({ type: favorite ? 'added' : 'removed', bill })
			enqueueSnackbar('Error updating the favorite state', { variant: 'error' })
		}
	}

	return (
		<Tooltip
			title={favorite ? 'Un-favourite' : 'Set as favourite'}
			placement={tooltipPlacement}
		>
			<IconButton
				onClick={async (e) => {
					e.stopPropagation()
					await handleToggleFavourite()
				}}
			>
				{favorite ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
			</IconButton>
		</Tooltip>
	)
}

export default function FavoriteBills() {
	const { favoriteBills } = useFavoriteBills()

	return (
		<Box sx={{ p: 3 }}>
			{favoriteBills.length === 0 && (
				<Typography sx={{ mb: 2, color: 'text.secondary' }}>
					No bill has been set as favorite yet. Jump to Bills tab to pick the
					ones you like.
				</Typography>
			)}
			{favoriteBills.length > 0 && (
				<Stack spacing={2} direction="row" useFlexGap sx={{ flexWrap: 'wrap' }}>
					{favoriteBills.map((bill) => (
						<Card
							key={bill.id}
							sx={{ width: 150, display: 'flex', flexDirection: 'column' }}
						>
							<CardHeader
								title={`#${bill.billNo}`}
								subheader={<BillStatus bill={bill} />}
							/>
							<CardContent sx={{ py: 0, flexGrow: 1 }}>
								<Typography
									gutterBottom
									sx={{
										color: 'text.secondary',
										fontSize: 14,
										alignSelf: 'end',
									}}
								>
									{bill.sponsors.map(({ sponsor }) => (
										<Fragment key={sponsor.as.showAs + sponsor.by.showAs}>
											{sponsor.as.showAs}
										</Fragment>
									))}
								</Typography>
							</CardContent>
							<CardActions sx={{ py: 0 }}>
								<FavouriteButton bill={bill} tooltipPlacement="auto" />
							</CardActions>
						</Card>
					))}
				</Stack>
			)}
		</Box>
	)
}
