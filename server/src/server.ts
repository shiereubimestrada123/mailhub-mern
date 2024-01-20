import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// import userRoutes from './routes/user';

const app = express();

require('dotenv').config();

try {
  mongoose.connect(
    process.env.MONGO_URI as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions
  );
} catch (error) {
  console.log((error as Error).message);

  process.exit(1);
}

const db = mongoose.connection;
db.on('error', (error: Error) => console.log(error));
db.once('error', (error: Error) => console.log(error));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
