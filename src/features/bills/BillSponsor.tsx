import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { Stack, Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import { type Bill } from 'bills-api'
import { Fragment } from 'react'

export function BillSponsor({ bill }: { bill: Bill }) {
	return bill.sponsors.map(({ sponsor }) => (
		<Fragment key={sponsor.as.showAs + sponsor.by.showAs}>
			<Stack direction="row" sx={{ alignItems: 'center' }}>
				<Box component="div">{sponsor.as.showAs || sponsor.by.showAs}</Box>
				{sponsor.isPrimary && bill.sponsors.length > 1 && (
					<Box component="div">
						<Tooltip describeChild title="Primary sponsor">
							<BookmarkBorderOutlinedIcon fontSize="small" color="warning" />
						</Tooltip>
					</Box>
				)}
			</Stack>
		</Fragment>
	))
}
