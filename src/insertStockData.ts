import axios, { AxiosResponse } from 'axios';
import { Pool } from 'pg';

// Database Configuration
const pool = new Pool({
    user: 'ravi',
    host: '13.232.169.223',
    database: 'tradebot',
    password: 'ravi',
    port: 5432,
});

const fetchDataAndInsert = async () => {
    const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJtZXJjaGFudCIsImlzcyI6InBheXRtbW9uZXkiLCJpZCI6NTU5NDY4LCJleHAiOjE2OTY3ODk3OTl9.yIBksEEsuFnIRAjvdlcj8w4TTdP9o1QmKkZ8FBSX21s';
    const apiUrl: string = 'https://developer.paytmmoney.com/data/v1/price/live';
    const preferences: string[] = ['NSE:17167:EQUITY'];
    const mode: string = 'FULL';

    try {
        const response: AxiosResponse<any> = await axios.get(apiUrl, {
            headers: {
                'x-jwt-token': authToken,
            },
            params: {
                mode: mode,
                pref: preferences.join(','),
            },
        });

        const data = response.data;

        for (let stock of data.data) {
            // Insert into stock_data
            const result = await pool.query(
                'INSERT INTO stock_data(tradable, mode, security_id, last_price, last_traded_quantity, average_traded_price, volume_traded, total_buy_quantity, total_sell_quantity, ohlc_open, ohlc_close, ohlc_high, ohlc_low, change_percent, change_absolute, week_high, week_low, last_trade_time, oi, change_oi, found) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING id',
                [stock.tradable, stock.mode, stock.security_id, stock.last_price, stock.last_traded_quantity, stock.average_traded_price, stock.volume_traded, stock.total_buy_quantity, stock.total_sell_quantity, stock.ohlc.open, stock.ohlc.close, stock.ohlc.high, stock.ohlc.low, stock.change_percent, stock.change_absolute, stock["52_week_high"], stock["52_week_low"], stock.last_trade_time, stock.oi, stock.change_oi, stock.found]
            );

            const stockId = result.rows[0].id;  // Get the ID of the inserted row


            // Insert into stock_depth_buy
            for (let buy of stock.depth.buy) {
                await pool.query(
                    'INSERT INTO stock_depth_buy(stock_id, quantity, price, orders) VALUES($1, $2, $3, $4)',
                    [stockId, buy.quantity, buy.price, buy.orders]
                );
            }

            // Insert into stock_depth_sell
            for (let sell of stock.depth.sell) {
                await pool.query(
                    'INSERT INTO stock_depth_sell(stock_id, quantity, price, orders) VALUES($1, $2, $3, $4)',
                    [stockId, sell.quantity, sell.price, sell.orders]
                );
            }

        }

        console.log('Data inserted successfully.');

    } catch (error: any) {
        console.error('Error:', error.message);
    }
};

const srAnalysis = async (time_frame: string, stocks: string[]): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await axios({
            method: 'post',
            url: 'https://mo.streak.tech/api/sr_analysis_multi/',
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

        const srData = response.data;

        // You can return the data, log it, or process it further here.
        return srData;

    } catch (error: any) {
        console.error('Error fetching SR Analysis:', error.message);
        throw error;  // Rethrow the error so the caller can handle it if necessary.
    }
}

const techAnalysis = async (time_frame: string, stocks: string[]): Promise<any> => {
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




fetchDataAndInsert();
async function main() {
    try {
        const data = await srAnalysis("min", ["NSE_ROSSARI", "NSE_REPL"]);
        console.log('Fetched SR Analysis data:', data);
    } catch (error: any) {
        console.error('Failed to fetch SR Analysis data:', error.message);
    }
}

main();


// Example usage:
async function main2() {
    try {
        const data = await techAnalysis("min", ["NSE_ROSSARI", "NSE_REPL"]);
        console.log('Fetched Technical Analysis data:', data);
    } catch (error: any) {
        console.error('Failed to fetch Technical Analysis data:', error.message);
    }
}

main2();





