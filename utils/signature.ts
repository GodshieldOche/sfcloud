import crypto from 'crypto'

export const signature = (date: string, body: {}) => {
    const message = `${process.env.X_Login!}${date.toString()}${JSON.stringify(body)}`
    return crypto.createHmac('sha256', process.env.Secret_Key!)
        .update(message)
        .digest('hex')
}  
