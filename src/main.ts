import { fetchDataAndInsert } from './fetchPaytmData';
import { srAnalysis } from './srAnalysis';
import { techAnalysis } from './techAnalysis';

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
