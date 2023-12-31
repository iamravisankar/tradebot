import express from 'express';
import { pool } from "./dbConfig";
import { loginHandler } from "./login";

const app = express();
const PORT = 3000;

async function getTableCounts() {
    const tables = [
        'option_chain', 'sr_analysis_15min', 'sr_analysis_30min',
        'sr_analysis_3min', 'sr_analysis_5min', 'sr_analysis_day',
        'sr_analysis_hour', 'sr_analysis_min', 'stock_data',
        'stock_depth_buy', 'stock_depth_sell', 'tech_analysis_15min',
        'tech_analysis_30min', 'tech_analysis_3min', 'tech_analysis_5min',
        'tech_analysis_day', 'tech_analysis_hour', 'tech_analysis_min'
    ];
    const counts: Record<string, number> = {};

    for (const table of tables) {
        const res = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        counts[table] = parseInt(res.rows[0].count, 10);
    }

    return counts;
}

app.get('/login/:token', loginHandler);

app.get('/', async (req, res) => {
    try {
        const counts = await getTableCounts();

        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"></script>
            </head>
            <body>
                <a href="https://login.paytmmoney.com/merchant-login?apiKey=afa7cc67abba4778a2fb4ca4192cc34f" class="btn">Login</a>
           
                <div class="container mt-5">
                    <div id="tableCounts" class="d-flex justify-content-center flex-wrap">
                        ${Object.entries(counts).map(([table, count]) => `
                            <div class="m-2 p-1 border rounded w-100 w-md-auto">
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
