import { Request, Response } from 'express';
import { pool } from "./dbConfig";
import axios, { AxiosResponse } from "axios";

export const loginHandler = async (req: Request, res: Response) => {
    const { token } = req.params; // This is the requestToken

    if (!token) {
        return res.status(400).send('No token provided in the URL.');
    }

    try {
        const accessToken = await getAccessTokenFromAPI(token);
        await updateAccessToken(accessToken);
        res.send('Access token updated successfully.');
    } catch (error) {
        console.error('Error updating access token:', error);
        res.status(500).send('Error updating access token.');
    }
}

async function getAccessTokenFromAPI(requestToken: string): Promise<string> {
    const API_ENDPOINT = 'https://developer.paytmmoney.com/accounts/v2/gettoken';
    const response: AxiosResponse = await axios.post(API_ENDPOINT, {
        api_key: 'afa7cc67abba4778a2fb4ca4192cc34f',
        api_secret_key: '885afdc5539846c68daa533f57dc3569',
        request_token: requestToken
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    return response.data.access_token;
}

async function updateAccessToken(token: string) {
    const query = 'UPDATE keys SET access_token = $1 WHERE id = 1';
    await pool.query(query, [token]);
}
