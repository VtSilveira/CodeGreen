import express, { json } from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express()

app.use(cors());
app.use(json());

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

app.use("/", routes);
