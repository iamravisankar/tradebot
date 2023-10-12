import axios, { AxiosResponse } from 'axios';
import { pool } from './dbConfig';

const fetchAuthTokenFromDB = async (): Promise<string | null> => {
    try {
        const result = await pool.query('SELECT access_token FROM keys WHERE id = 1');
        return result.rows[0]?.access_token || null;
    } catch (error: any) {
        console.error('Error fetching access token from DB:', error.message);
        return null;
    }
};

const fetchOptionChainForExpiry = async (expiryDate: string, symbol: string, authToken: string, type: string, unique_id: number) => {
    const apiUrl = `https://developer.paytmmoney.com/fno/v1/option-chain?symbol=${symbol}&expiry=${expiryDate}&type=${type}`;

    try {
        const response: AxiosResponse<any> = await axios.get(apiUrl, {
            headers: {
                'x-jwt-token': authToken,
            },
        });

        // Extract the data
        const dataArray = response.data.data.results;

        for (const data of dataArray) {

        // Insert into the database
        const query = `
            INSERT INTO option_chain (
                unique_id, pml_id, exchange, 
                underlaying_scrip_code, segment, security_id, 
                pml_symbol, vega, fresh_pos, iv, 
                square_off_pos, description, theta, gamma, 
                spot_price, delta, price, stk_price, 
                net_chg, oi, oi_per_chg, oi_net_chg, 
                per_chg, traded_vol, symbol, expiry_date, 
                option_type, instrument, name, tick_size, 
                lot_size, exch_feed_time
            ) VALUES (
                $1, $2, $3, 
                $4, $5, $6,
                $7, $8, $9, $10,
                $11, $12, $13, $14,
                $15, $16, $17, $18,
                $19, $20, $21, $22,
                $23, $24, $25, $26,
                $27, $28, $29, $30,
                $31, $32
            );
        `;

        await pool.query(query, [
            unique_id, data.pml_id, data.exchange,
            data.underlaying_scrip_code, data.segment, data.security_id,
            data.pml_symbol, data.vega, data.fresh_pos, data.iv,
            data.square_off_pos, data.desc, data.theta, data.gamma,
            data.spot_price, data.delta, data.price, data.stk_price,
            data.net_chg, data.oi, data.oi_per_chg, data.oi_net_chg,
            data.per_chg, data.traded_vol, symbol, data.expiry_date,
            data.option_type, data.instrument, data.name, data.tick_size,
            data.lot_size, data.exch_feed_time
        ]);
        
    }
        console.log(`Inserted data for expiry date ${expiryDate}`);

    } catch (error: any) {
        console.error(`Error fetching option chain for expiry date ${expiryDate}:`, error.message);
    }
};


export const fetchExpiryDates = async (symbol: string, type: string,unique_id: number) => {
    const authToken = await fetchAuthTokenFromDB();

    if (!authToken) {
        console.error('No Auth Token found.');
        return;
    }

    const apiUrl: string = `https://developer.paytmmoney.com/fno/v1/option-chain/config?symbol=${symbol}`;
  
    try {
        const response: AxiosResponse<any> = await axios.get(apiUrl, {
            headers: {
                'x-jwt-token': authToken,
            },
        });

        const expiryDates = response.data.data.expires;

        // Loop through each expiry date and fetch the option chain
        for (const expiryTimestamp of expiryDates) {
            const expiryDate = new Date(expiryTimestamp); // Convert the UNIX timestamp to a JavaScript Date object
            const day = String(expiryDate.getDate()).padStart(2, '0');
            const month = String(expiryDate.getMonth() + 1).padStart(2, '0'); // January is 0!
            const year = expiryDate.getFullYear();
        
            const formattedExpiryDate = `${day}-${month}-${year}`; // Combine them into the required format
        
            await fetchOptionChainForExpiry(formattedExpiryDate, symbol, authToken, type, unique_id);
        }

    } catch (error: any) {
        console.error('Error:', error.message);
    }
};

// Run the function

