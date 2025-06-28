import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import { Stack, Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import { type Bill } from 'bills-api'

export function BillSponsors({ bill }: { bill: Bill }) {
	return (
		<Box sx={{ maxHeight: 130, overflowY: 'auto' }}>
			{bill.sponsors.map(({ sponsor }) => (
				<Stack
					direction="row"
					sx={{ alignItems: 'center' }}
					key={sponsor.as.showAs + sponsor.by.showAs}
				>
					<Box component="div">{sponsor.as.showAs || sponsor.by.showAs}</Box>
					{sponsor.isPrimary && bill.sponsors.length > 1 && (
						<Box component="div">
							<Tooltip describeChild title="Primary sponsor">
								<BookmarkBorderOutlinedIcon fontSize="small" color="warning" />
							</Tooltip>
						</Box>
					)}
				</Stack>
			))}
		</Box>
	)
}
