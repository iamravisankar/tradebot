import express from 'express';
import { pool } from "./dbConfig";

const app = express();
const PORT = 3000;

async function getTableCounts() {
    const tables = ['stock_data', 'stock_depth_buy', 'stock_depth_sell', 'tech_analysis','sr_analysis_data'];
    const counts: Record<string, number> = {};

    for (const table of tables) {
        const res = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        counts[table] = parseInt(res.rows[0].count, 10);
    }

    return counts;
}

app.get('/', async (req, res) => {
    try {
        const counts = await getTableCounts();
        res.json(counts);
    } catch (error: any) {
        console.error('Error getting table counts:', error);
        res.status(500).send('Error retrieving data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
