// Imports
import { fetchDataAndInsert } from './fetchPaytmData';
import { srAnalysis } from './srAnalysis';
import { techAnalysis } from './techAnalysis';

// SR Analysis Function
async function fetchSrAnalysisData() {
    try {
        const data = await srAnalysis("min", ["NSE_ROSSARI", "NSE_REPL"]);
        console.log('Fetched SR Analysis data:', data);
    } catch (error: any) {
        console.error('Failed to fetch SR Analysis data:', error.message);
    }
}

// Technical Analysis Function
async function fetchTechAnalysisData() {
    try {
        const data = await techAnalysis("min", ["NSE_ROSSARI", "NSE_REPL"]);
        console.log('Fetched Technical Analysis data:', data); // Uncomment if you want to log this data
    } catch (error: any) {
        console.error('Failed to fetch Technical Analysis data:', error.message);
    }
}

// Data Insertion Function Call
fetchDataAndInsert();

// SR Analysis Data Function Call (Uncomment to use)
fetchSrAnalysisData();

// Technical Analysis Data Function Call
fetchTechAnalysisData();
