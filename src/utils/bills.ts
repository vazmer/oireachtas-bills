import { type Bill, type LegislationResult } from 'bills-api'
import { useEffect, useState } from 'react'

const billStatuses = [
	'Current',
	'Withdrawn',
	'Enacted',
	'Rejected',
	'Defeated',
	'Lapsed',
] as const

type FetchParams = {
	skip: number
	limit: number
	status: 'all' | 'bill' | 'act'
}

const billsApiUrl = 'https://api.oireachtas.ie/v1'

const encodeSearchParams = ({
	skip,
	limit,
	status: statusFilter,
}: FetchParams) => {
	let billStatusItems = []
	switch (statusFilter) {
		case 'bill':
			billStatusItems = billStatuses.filter((status) => status !== 'Enacted')
			break
		case 'act':
			billStatusItems = ['Enacted']
			break
		default:
			billStatusItems = [...billStatuses]
	}
	return new URLSearchParams({
		skip: skip.toString(),
		limit: limit.toString(),
		bill_status: billStatusItems.join(','),
	})
}

export function useFetchBills({
	skip = 0,
	limit = 10,
	status = 'all',
}: FetchParams) {
	const [bills, setBills] = useState<Bill[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>('')
	const [currentPage, setCurrentPage] = useState<number>(0)
	const [pagesCount, setPagesCount] = useState<number>(0)

	useEffect(() => {
		setLoading(true)

		fetch(
			`${billsApiUrl}/legislation?${encodeSearchParams({ skip, limit, status }).toString()}`,
		)
			.then((res) => res.json() as Promise<LegislationResult>)
			.then(({ results, head }) => {
				setError('')
				setBills(
					results?.map(({ bill, billSort }) => ({
						...bill,
						// no real ID provided by the api, let's set it ourselves
						id: billSort.billShortTitleEnSort + billSort.billNoSort,
					})) || [],
				)
				setCurrentPage(Math.floor(skip / limit))
				setPagesCount(Math.ceil(head.counts.resultCount / limit))
			})
			.catch((e) => {
				if (e instanceof Error) {
					setError(e.message)
				} else {
					throw e
				}
			})
			.finally(() => setLoading(false))
	}, [skip, limit, status])

	return { bills, loading, error, currentPage, pagesCount }
}

export async function toggleFavoriteBill(bill: Bill, favorite: boolean) {
	const response = await fetch(`${billsApiUrl}/legislation/${bill.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...bill, favorite }),
	})
	return response.json() as Promise<Bill>
}
