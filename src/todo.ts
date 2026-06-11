import express from 'express';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'HTTP server is running' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
