import axios, { AxiosResponse } from 'axios';

export const techAnalysis = async (time_frame: string, stocks: string[]): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await axios({
            method: 'post',
            url: 'https://mo.streak.tech/api/tech_analysis_multi/',
            headers: {
                'authority': 'mo.streak.tech',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7,mt;q=0.6',
                'content-type': 'application/json',
                'origin': 'https://streakv3.zerodha.com',
                'referer': 'https://streakv3.zerodha.com/',
                'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
            },
            data: {
                time_frame: time_frame,
                stocks: stocks,
                user_broker_id: "TC2510" // Assuming this remains constant. If it's dynamic, make it a parameter.
            }
        });

        const techData = response.data;

        // You can return the data, log it, or process it further here.
        return techData;

    } catch (error: any) {
        console.error('Error fetching Technical Analysis:', error.message);
        throw error;  // Rethrow the error so the caller can handle it if necessary.
    }
}
