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
    const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJtZXJjaGFudCIsImlzcyI6InBheXRtbW9uZXkiLCJpZCI6NTU4MzkzLCJleHAiOjE2OTY3MDMzOTl9.qB5G7xSe7g8WNu9B-APGJHzSz3NfSNRl9_U3RcwGXsA';
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

fetchDataAndInsert();
