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

        // Create HTML response with inline styles and scripts
        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Table Counts</title>
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"></script>
            </head>
            <body>
                <div class="container mt-5">
                    <h2 class="text-center mb-4">Table Counts</h2>
                    <div id="tableCounts" class="d-flex justify-content-center flex-wrap">
                        ${Object.entries(counts).map(([table, count]) => `
                            <div class="m-2 p-4 border rounded w-100 w-md-auto">
                                <strong>${table}</strong>: <span class="count" data-count="${count}">0</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <script>
                    anime({
                        targets: '.count',
                        innerHTML: [0, function(el) { return el.getAttribute('data-count'); }],
                        round: 1,
                        delay: anime.stagger(200),
                        easing: 'easeInOutExpo'
                    });
                </script>
            </body>
            </html>
        `;

        res.send(htmlResponse);
    } catch (error) {
        console.error('Error getting table counts:', error);
        res.status(500).send('Error retrieving data');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
