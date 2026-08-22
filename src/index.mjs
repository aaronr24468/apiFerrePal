import express from "express";
import cors from 'cors';
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { expressjwt } from "express-jwt";
import {createServer} from 'http';
import { config } from "dotenv";
import { errorHandler } from "./middleware/errorHandler.mjs";
config();

import { router as authRouter } from "./routes/auth.mjs";
import { router as creditRouter } from "./routes/credit.mjs";
import { router as authentificationR } from "./routes/authentification.mjs";
import { router as productsRouter } from "./routes/products_store.mjs";

const port = process.env.PORT;

const app = express();
const server = createServer(app);

app.use(morgan('dev'));
app.use(cors({
   
    origin: 'https://ferrepalweb.onrender.com',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRouter);

app.use('/authentification', expressjwt({secret: `${process.env.SECRETJWT}`, algorithms: ['HS256'], getToken: (req) => req.cookies.creditToken}), authentificationR)

app.use('/credit', expressjwt({secret: `${process.env.SECRETJWT}`, algorithms: ['HS256'], getToken: (req) => req.cookies.creditToken}), creditRouter)

app.use('/products', expressjwt({secret: `${process.env.SECRETJWT}`, algorithms: ['HS256'], getToken: (req) => req.cookies.creditToken}), productsRouter)

app.use(errorHandler);

app.use((err, req, res, next) =>{
    if(err.name === "UnauthorizedError"){
        res.status(401).json('unauthorized')
    }else{
        next()
    }
})

server.listen(port, () =>{
    console.log(`Listening to the http://localhost:${port}`)
})