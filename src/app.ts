import express from "express"
import 'express-async-errors';
import 'dotenv'
import { authRouter } from "./routes/auth";
import { paymentRouter } from "./routes/payment";
import { errorHandler } from "./middlewares/error-handler"
import { NotFoundError } from "./errors/not-found";
import cookieSession from 'cookie-session';


const app = express()

app.set('trust proxy', true);
app.use(express.json())
app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);

app.get('/', (req, res) => {
    res.send("Hello")
})

app.use('/api/auth', authRouter)
app.use('/api/payment', paymentRouter)

app.all("*", (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)


export { app }