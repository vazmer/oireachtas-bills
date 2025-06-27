import {
	Alert,
	AlertTitle,
	Box,
	FormControl,
	FormHelperText,
	MenuItem,
	Select,
	TableFooter,
	TablePagination,
	Tabs,
	useTheme,
} from '@mui/material'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Fragment, useId, useState } from 'react'
import { TableRowsSkeleton } from '../../components/TableRowsSkeleton'
import { useFetchBills } from '../../utils/bills'
import { useBillsModal } from './BillsModal'
import { BillStatus } from './BillsStatus'
import FavoriteBills, { FavouriteButton } from './FavoriteBills'

type BillStatusOptions = 'bill' | 'act' | 'all'

export default function Bills() {
	const id = useId()
	const theme = useTheme()
	const { openModal } = useBillsModal()
	const [selectedTabIndex, setSelectedTabIndex] = useState(0)

	const [queryParams, setQueryParams] = useState<{
		skip: number
		limit: number
		status: BillStatusOptions
	}>({
		skip: 0,
		limit: 10,
		status: 'all',
	})

	const { bills, error, loading, currentPage, pagesCount } = useFetchBills({
		skip: queryParams.skip,
		limit: queryParams.limit,
		status: queryParams.status,
	})

	return (
		<>
			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
				<Tabs
					value={selectedTabIndex}
					onChange={(_, newValue) => setSelectedTabIndex(newValue)}
					aria-label="Bill tabs"
				>
					<Tab
						label="Bills table"
						id="bills-tab-0"
						aria-controls="bills-tabpanel-0"
					/>
					<Tab
						label="Favorite Bills"
						id="bills-tab-1"
						aria-controls="bills-tabpanel-1"
					/>
				</Tabs>
			</Box>

			<Box
				component="div"
				role="tabpanel"
				hidden={selectedTabIndex !== 0}
				id="bills-tabpanel-0"
				aria-labelledby="bills-tab-0"
			>
				<Box sx={{ my: 2 }}>
					<FormControl variant="standard" sx={{ minWidth: 100 }}>
						<Select
							id={`select-${id}`}
							defaultValue="all"
							size="small"
							label="Bill Type"
							variant="standard"
							onChange={(e) => {
								setQueryParams({
									...queryParams,
									status: e.target.value as BillStatusOptions,
								})
							}}
						>
							<MenuItem value="all">All</MenuItem>
							<MenuItem value="bill">Bills</MenuItem>
							<MenuItem value="act">Acts</MenuItem>
						</Select>
						<FormHelperText>Filter by type</FormHelperText>
					</FormControl>
				</Box>

				{error && (
					<Alert severity="error" sx={{ mb: 4 }}>
						<AlertTitle>
							There has been an error while fetching data!
						</AlertTitle>
						Please try again. If the issue persists reload the page, or contact
						the administrator.
					</Alert>
				)}

				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
						<TableHead>
							<TableRow>
								<TableCell align="center" width={79}>
									Number
								</TableCell>
								<TableCell align="center" width={79}>
									Type
								</TableCell>
								<TableCell align="center" width={150}>
									Status
								</TableCell>
								<TableCell>Sponsor</TableCell>
								<TableCell width={70} />
							</TableRow>
						</TableHead>
						<TableBody>
							{!loading &&
								bills.map((bill) => (
									<TableRow
										key={bill.id}
										sx={{
											'&:last-child td, &:last-child th': { border: 0 },
											'&:focus': {
												cursor: 'pointer',
												outline: `1px solid ${theme.palette.primary.main}`,
											},
										}}
										tabIndex={0}
										onClick={() => openModal(bill)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === 'Space') {
												e.stopPropagation()
												openModal(bill)
											}
										}}
									>
										<TableCell align="center" component="th" scope="row">
											#{bill.billNo}
										</TableCell>
										<TableCell align="center">
											{bill.status.includes('Enacted') ? 'Act' : 'Bill'}
										</TableCell>
										<TableCell align="center">
											<BillStatus bill={bill} />
										</TableCell>
										<TableCell>
											{bill.sponsors.map(({ sponsor }) => (
												<Fragment key={sponsor.as.showAs + sponsor.by.showAs}>
													{sponsor.as.showAs}
												</Fragment>
											))}
										</TableCell>
										<TableCell>
											<FavouriteButton bill={bill} />
										</TableCell>
									</TableRow>
								))}
							{(bills.length === 0 || loading) && (
								<TableRow>
									<TableCell colSpan={6} sx={{ py: 5 }}>
										{loading && <TableRowsSkeleton />}
										{!loading && (
											<Typography sx={{ color: 'text.secondary' }}>
												No bills found. Please refine your search, or try later.
											</Typography>
										)}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
						{bills.length > 0 && (
							<TableFooter>
								<TableRow>
									<TablePagination
										count={pagesCount}
										page={currentPage}
										onPageChange={(_, newPage) =>
											setQueryParams({
												...queryParams,
												skip: newPage * queryParams.limit,
											})
										}
										rowsPerPage={queryParams.limit}
										rowsPerPageOptions={[10, 25, 50]}
										onRowsPerPageChange={(event) =>
											setQueryParams({
												...queryParams,
												limit: parseInt(event.target.value, 10),
												skip: 0,
											})
										}
									/>
								</TableRow>
							</TableFooter>
						)}
					</Table>
				</TableContainer>
			</Box>

			<Box
				component="div"
				role="tabpanel"
				hidden={selectedTabIndex !== 1}
				id="bills-tabpanel-1"
				aria-labelledby="bills-tab-1"
			>
				{selectedTabIndex === 1 && <FavoriteBills />}
			</Box>
		</>
	)
}
