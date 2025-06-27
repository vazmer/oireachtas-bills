import { Skeleton } from '@mui/material'
import { useMemo } from 'react'

export function TableRowsSkeleton() {
	return useMemo(() => {
		return Array.from(Array(7).keys()).map((index) => (
			<Skeleton key={index} width="100%" sx={{ m: 2 }} />
		))
	}, [])
}
