import axios from "axios";
import { Request, Response } from "express";
import { signature } from "../../utils/signature";


const createPaymentController = async (req: Request, res: Response) => {
    const body = req.body

    const date = new Date().toJSON()

    const { data } = await axios.post('https://sandbox.dlocal.com/payments', body, {
        headers: {
            'Accept': 'application/json',
            'X-Date': date,
            'X-Login': process.env.X_Login!,
            'X-Trans-Key': process.env.X_Trans_Key!,
            'Content-Type': 'application/json',
            Authorization: `V2-HMAC-SHA256, Signature: ${signature(date, body).toString()}`
        }
    })

    res.json(data)
   
}



export {
    createPaymentController
}