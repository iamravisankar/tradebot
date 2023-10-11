import axios, { AxiosResponse } from "axios";
import { pool } from "./dbConfig";

export const techAnalysis = async (
  time_frame: string,
  stocks: string[],
  unique_id: number
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios({
      method: "post",
      url: "https://mo.streak.tech/api/tech_analysis_multi/",
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

    const techData = response.data;



    const insertTechData = async (stockName: string, data: any) => {
        try {
            const tableName = `tech_analysis_${time_frame}`;
            const insertQuery = `
                INSERT INTO ${tableName} (
                  unique_id,stock_name, adx, awesome_oscillator, cci, change, close, ema10, ema100, ema20, ema200, ema30, ema5, ema50, hma, ichimoku, loss_amt, loss_signals, macd, macdhist, momentum, rec_adx, rec_ao, rec_cci, rec_ichimoku, rec_macd, rec_mom, rec_rsi, rec_stochastic_k, rec_stochastic_rsi_fast, rec_ult_osc, rec_willr, rsi, signals, sma10, sma100, sma20, sma200, sma30, sma5, sma50, state, status, stoch_rsi_fast, stochastic_k, ult_osc, vwma, willr, win_amt, win_pct, win_signals
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51
                )`;
    
            const values = [
                unique_id,
                stockName,
                data.adx,
                data.awesome_oscillator,
                data.cci,
                data.change,
                data.close,
                data.ema10,
                data.ema100,
                data.ema20,
                data.ema200,
                data.ema30,
                data.ema5,
                data.ema50,
                data.hma,
                data.ichimoku,
                data.loss_amt,
                data.loss_signals,
                data.macd,
                data.macdHist,
                data.momentum,
                data.rec_adx,
                data.rec_ao,
                data.rec_cci,
                data.rec_ichimoku,
                data.rec_macd,
                data.rec_mom,
                data.rec_rsi,
                data.rec_stochastic_k,
                data.rec_stochastic_rsi_fast,
                data.rec_ult_osc,
                data.rec_willR,
                data.rsi,
                data.signals,
                data.sma10,
                data.sma100,
                data.sma20,
                data.sma200,
                data.sma30,
                data.sma5,
                data.sma50,
                data.state,
                data.status,
                data.stoch_rsi_fast,
                data.stochastic_k,
                data.ult_osc,
                data.vwma,
                data.willR,
                data.win_amt,
                data.win_pct,
                data.win_signals
            ];

            await pool.query(insertQuery, values);
        } catch (error:any) {
            console.error("Failed to insert techData:", error.message);
        }
    };
    

    for (let stock in techData.data) {
        insertTechData(stock, techData.data[stock]); 
    }
    // You can return the data, log it, or process it further here.
    return techData;
  } catch (error: any) {
    console.error("Error fetching Technical Analysis:", error.message);
    throw error; // Rethrow the error so the caller can handle it if necessary.
  }
};
