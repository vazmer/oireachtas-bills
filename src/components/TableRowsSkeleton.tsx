import { Skeleton } from '@mui/material'
import { useMemo } from 'react'

export function TableRowsSkeleton({ rows = 7 }) {
	return useMemo(() => {
		return Array.from(Array(rows).keys()).map((index) => (
			<Skeleton key={index} width="100%" sx={{ m: 2 }} />
		))
	}, [rows])
}
