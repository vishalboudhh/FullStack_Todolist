import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './db/database.js';
import userRouter from './routes/user.routes.js';
import todoRouter from './routes/todo.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
const app = express();

//.env config
dotenv.config();

//database connection
connectDB();

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))
app.use(cors());

//routes
app.use('/api/v1/user',userRouter);
app.use(`/api/v1/todo`,todoRouter);


//PORT
const PORT = process.env.PORT;

//starting the server
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    
})