import express from 'express';

const app = express();
const PORT = 80;

app.get('/', (req, res) => {
    res.send('durrrrr....');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
