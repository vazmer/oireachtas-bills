import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { mswTest as test } from '../../tests/test-extend-msw'
import { useFetchBills } from './bills'

const getApiUrl = 'https://api.oireachtas.ie/v1/legislation'

describe('useFetchBills Hook', () => {
	test('should exist', async ({ worker }) => {
		worker.use(
			http.get(getApiUrl, () => {
				return HttpResponse.json({
					results: [],
					head: { counts: { resultCount: 0 } },
				})
			}),
		)

		const { result } = renderHook(() =>
			useFetchBills({ skip: 0, limit: 10, status: 'all' }),
		)

		await waitFor(() => {
			expect(result.current).toBeDefined()
			expect(result.current.bills).toStrictEqual([])
			expect(result.current.loading).toBe(false)
			expect(result.current.error).toBe('')
			expect(result.current.pagesCount).toBe(0)
			expect(result.current.currentPage).toBe(0)
		})
	})
})
