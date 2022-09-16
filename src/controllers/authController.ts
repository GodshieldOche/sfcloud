import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { BadRequestError  } from "../errors/bad-request"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const { user } = new PrismaClient()

const signUpController = async (req: Request, res: Response) => {

    const { email, password, name } = req.body

    // checking if user already exists, if so throwing an error
    const exists = await user.findUnique({
        where: {
            email
        }
    })

    if (exists) {
        throw new BadRequestError("Email Already in use")
    }
    

    
    // hashing the users password and creating a new user
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        }
    })


    res.status(201).json({ message: "Success", data: newUser })
    
}



const signInController = async (req: Request, res: Response) => {
    const { email, password } = req.body
    
    // checking if email doesn't exist
    const existingUser = await user.findUnique({
        where: {
            email
        }
    })

    if (!existingUser) {
        throw new BadRequestError("Invalid Credentials")
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, existingUser.password)

    if (!isMatch) {
        throw new BadRequestError("Invalid Credentials")
    }

    // Generation JWT and setting cookie
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name
    },
        process.env.SECRET!)

    req.session = {
        jwt: userJwt
    }

    res.status(200).json({ message: "Success", data: existingUser })

}



const currentUserController = async (req: Request, res: Response) => {
    res.status(200).json({ user: req.user || null })
}

const signOutController = async (req: Request, res: Response) => {
    req.session = null

    res.status(200).json({ message: "Signed Out" })
}







export {
    signUpController,
    signInController,
    currentUserController,
    signOutController
}