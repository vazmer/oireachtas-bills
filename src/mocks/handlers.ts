import { http, type HttpHandler, HttpResponse } from 'msw'

const { json } = HttpResponse

export const handlers: Array<HttpHandler> = [
	http.patch(
		`https://api.oireachtas.ie/v1/legislation/:legislationId`,
		async ({ request }) => {
			const body = await request.json()
			console.info('🔶 mocked toggle favorite legislation request:', body)

			return json(body)
		},
	),
]
