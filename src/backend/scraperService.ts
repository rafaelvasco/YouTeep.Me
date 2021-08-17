import toast from 'react-hot-toast'
import api from './api'

export class ScraperService {
    static scrapeImages = async (query: string, maxResults: number): Promise<string[]> => {
        console.log(`Scrape: ${query}`)
        try {
            const result = await api.get<string[]>('scrape/scrapeImages', {
                params: {
                    query,
                    maxResults,
                },
            })

            return result.data
        } catch (e) {
            if (e.response.status === 500 || e.response.status === 400) {
                if (e.response) {
                    toast.error(e.response.data.message || e.response.data)
                } else {
                    toast.error(e.message)
                }
            }

            return null
        }
    }
}
