declare module 'bills-api' {
	type Sponsor = {
		as: {
			showAs: string
			uri: string
		}
		by: {
			showAs: string
			uri: string
		}
		isPrimary: boolean
	}

	export type Bill = {
		id: string
		billNo: string
		billYear: string
		billType: string
		billTypeURI: string
		shortTitleEn: string
		shortTitleGa: string
		longTitleEn: string
		longTitleGa: string
		method: string
		methodURI: string
		source: string
		sourceURI: string
		lastUpdated: string
		originHouseURI: string
		originHouse: {
			showAs: string
			uri: string
		}
		act: {
			actNo: string
			actYear: string
			dateSigned: string
			shortTitleEn: string
			shortTitleGa: string
			longTitleEn: string
			longTitleGa: string
			uri: string
			statutebookURI: string
		}
		sponsors: { sponsor: Sponsor }[]
		status:
			| 'Current'
			| 'Withdrawn'
			| 'Enacted'
			| 'Rejected'
			| 'Defeated'
			| 'Lapsed'
	}

	export type LegislationResult = {
		head: {
			counts: {
				billCount: number
				resultCount: number
			}
		}
		results: {
			bill: Omit<Bill, 'id'>
			billSort: {
				actNoSort: number
				actShortTitleEnSort: string
				actShortTitleGaSort: string
				actYearSort: number
				billNoSort: number
				billShortTitleEnSort: string
				billShortTitleGaSort: string
				billYearSort: number
			}
		}[]
	}
}
