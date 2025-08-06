
import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/document.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/documents', documentRoutes);

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
