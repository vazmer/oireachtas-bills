import { setupServer } from 'msw/node'
import { test as testBase } from 'vitest'
import { handlers } from '../src/mocks/handlers'

// use setupServer since we're running tests in Node.js environment
const worker = setupServer(...handlers)

export const mswTest = testBase.extend<{ worker: typeof worker }>({
	worker: [
		async ({}, use) => {
			// Start the worker before the test.
			worker.listen()

			// Expose the worker object on the test's context.
			await use(worker)

			// Remove any request handlers added in individual test cases.
			// This prevents them from affecting unrelated tests.
			worker.resetHandlers()
		},
		{
			auto: true,
		},
	],
})
