import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './db/database.js';
import userRouter from './routes/user.routes.js';
import todoRouter from './routes/todo.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend from server
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});


//.env config
dotenv.config();

//database connection
connectDB();

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",  // Local development
  "https://fullstack-todolist-nazk.onrender.com"  // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//routes
app.use('/api/v1/user',userRouter);
app.use(`/api/v1/todo`,todoRouter);


//PORT
const PORT = process.env.PORT;

//starting the server
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    
})
