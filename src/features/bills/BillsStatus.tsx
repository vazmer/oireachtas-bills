import BackHandIcon from '@mui/icons-material/BackHand'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import DriveFileMoveRtlIcon from '@mui/icons-material/DriveFileMoveRtl'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import { Chip, type ChipProps } from '@mui/material'
import { type Bill } from 'bills-api'
import { useMemo } from 'react'

export function BillStatus({ bill }: { bill: Bill }) {
	const [color, icon] = useMemo(() => {
		let chipColor: ChipProps['color'] | undefined
		let chipIcon: ChipProps['icon'] | undefined

		switch (bill.status) {
			case 'Enacted':
				chipColor = 'success'
				chipIcon = <CheckCircleIcon />
				break
			case 'Current':
				chipColor = 'secondary'
				chipIcon = <BorderColorIcon />
				break
			case 'Lapsed':
				chipColor = 'warning'
				chipIcon = <TimelapseIcon />
				break
			case 'Defeated':
				chipColor = 'primary'
				chipIcon = <BackHandIcon />
				break
			case 'Rejected':
				chipColor = 'error'
				chipIcon = <DoDisturbIcon />
				break
			case 'Withdrawn':
				chipColor = 'default'
				chipIcon = <DriveFileMoveRtlIcon />
				break
			default:
				break
		}
		return [chipColor, chipIcon]
	}, [bill.status])

	return <Chip size="small" color={color} icon={icon} label={bill.status} />
}
