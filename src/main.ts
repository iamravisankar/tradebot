import { fetchDataAndInsert } from './fetchPaytmData';
import { srAnalysis } from './srAnalysis';
import { techAnalysis } from './techAnalysis';
import { pool } from './dbConfig';

const unique_id = Math.floor(Date.now() / 1000); //timestampInSeconds


const fetchExchangeSymbolsFromDB = async (): Promise<string[]> => {
    try {
        const result = await pool.query('SELECT exchange, symbol FROM equity_security_master WHERE in_watchlist = true');
        const exchangeSymbols: string[] = result.rows.map(row => `${row.exchange}_${row.symbol}`);
        return exchangeSymbols;
    } catch (error: any) {
        console.error('Error fetching exchange symbols:', error.message);
        return [];
    }
};

async function fetchSrAnalysisData() {
    try {
        const exchangeSymbols: string[] = await fetchExchangeSymbolsFromDB();

        if (exchangeSymbols.length === 0) {
            console.log('No exchange symbols found in the watchlist.');
            return;
        }

        const data_min = await srAnalysis("min", exchangeSymbols,unique_id);
        const data_3min = await srAnalysis("3min", exchangeSymbols,unique_id);
        const data_5min = await srAnalysis("5min", exchangeSymbols,unique_id);
        const data_15min = await srAnalysis("15min", exchangeSymbols,unique_id);
        const data_30min = await srAnalysis("30min", exchangeSymbols,unique_id);
        const data_day = await srAnalysis("day", exchangeSymbols,unique_id);
        // console.log('Fetched SR Analysis data:', data);

    } catch (error: any) {
        console.error('Failed to fetch SR Analysis data:', error.message);
    }
}

async function fetchTechAnalysisData() {
    try {
        const exchangeSymbols: string[] = await fetchExchangeSymbolsFromDB();

        if (exchangeSymbols.length === 0) {
            console.log('No exchange symbols found in the watchlist.');
            return;
        }

        const data_min = await techAnalysis("min", exchangeSymbols,unique_id);
        const data_3min = await techAnalysis("3min", exchangeSymbols,unique_id);
        const data_5min = await techAnalysis("5min", exchangeSymbols,unique_id);
        const data_15min = await techAnalysis("15min", exchangeSymbols,unique_id);
        const data_30min = await techAnalysis("30min", exchangeSymbols,unique_id);
        const data_day = await techAnalysis("day", exchangeSymbols,unique_id);

        // console.log('Fetched Technical Analysis data:', data); // Uncomment if you want to log this data

    } catch (error: any) {
        console.error('Failed to fetch Technical Analysis data:', error.message);
    }
}

// Data Insertion Function Call
fetchDataAndInsert(unique_id);

// SR Analysis Data Function Call (Uncomment to use)
fetchSrAnalysisData();

// Technical Analysis Data Function Call
fetchTechAnalysisData();
