import axios, { AxiosResponse } from "axios";
import { pool } from "./dbConfig";

export const srAnalysis = async (
  time_frame: string,
  stocks: string[]
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios({
      method: "post",
      url: "https://mo.streak.tech/api/sr_analysis_multi/",
      headers: {
        authority: "mo.streak.tech",
        accept: "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7,mt;q=0.6",
        "content-type": "application/json",
        origin: "https://streakv3.zerodha.com",
        referer: "https://streakv3.zerodha.com/",
        "sec-ch-ua":
          '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      },
      data: {
        time_frame: time_frame,
        stocks: stocks,
        user_broker_id: "TC2529", // Assuming this remains constant. If it's dynamic, make it a parameter.
      },
    });

    const srData = response.data;

    const insertSrData = async (stockName: string, data: any) => {
        try {
            const insertQuery = `
                INSERT INTO sr_analysis_data (
                    stock_name, close, pp, r1, r2, r3, s1, s2, s3
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9
                )`;

            const values = [
                stockName,
                data.close,
                data.pp,
                data.r1,
                data.r2,
                data.r3,
                data.s1,
                data.s2,
                data.s3
            ];

            await pool.query(insertQuery, values);
        } catch (error: any) {
            console.error("Failed to insert srData:", error.message);
        }
    };

    // Call the function for each stock in the srData.data
    for (let stock in srData.data) {
        insertSrData(stock, srData.data[stock]); 
    }

    return srData;

  } catch (error: any) {
    console.error("Error fetching SR Analysis:", error.message);
    throw error; // Rethrow the error so the caller can handle it if necessary.
  }
};
