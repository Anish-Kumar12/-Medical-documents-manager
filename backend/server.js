import express from 'express';
import cors from 'cors';
import db from './database/dbinit.js';
import documentRoutes from './routes/document.routes.js';

const app = express();
app.use(cors());
app.use(express.json());


app.use('/documents', documentRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

