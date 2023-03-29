import jwt, { JwtPayload } from 'jsonwebtoken';
import { app } from "../app/app.module";
import { Request, Response } from "express";
import auth from '../authentication/auth'
import users from "../models/usersModel";

function usersController (url: string) : void {
    app.post(url + '/register', async (req: Request, res: Response) => {
        try {
            const existingUser = await users.findOne({email: req.body.email})
            if (existingUser) return res.status(400).json({message: "User already exists!"})
            const user = new users({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
            const token = jwt.sign({_id: user?._id.toString()}, `${process.env.secretToken}`, {expiresIn: 86400})
            await user.save()
            return res.status(200).json({user, token})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Internal server error!"})
        }
    })

    app.post(url + '/login', async (req: Request, res: Response) => {
        try {
            const user = await users.findOne({username: req.body.username})
            if (!user) {
                return res.status(404).json({message: 'Username or password is incorrect!'})
            }

            const userPsw = await users.findOne({password: req.body.password})
            if (userPsw) {
                const token = jwt.sign({_id: user?._id.toString()}, `${process.env.secretToken}`, {expiresIn: 86400})
                return res.status(200).json({user, token})
            } 
            else {
                return res.status(400).json({message: 'Username or password is incorrect!'})
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    })

    app.get(url, async (req: Request, res: Response) => {
        try {
            const user = await users.find()
            res.status(200).json(user)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Internal server error!"})
        }
    })
    app.get(url + '/:id',async (req: Request, res: Response) => {
        try {
            /*
            let payload = (req as CustomRequest).user as JwtPayload
            let userAuth = await users.findById(payload._id)
            if (!userAuth) return res.status(400).json({message: 'Access denied'})
            */
            const user = await users.findById(req.params.id)
            return res.status(200).json(user)
        } catch (e) {
            return res.status(500).json(e)
        }
    })
}

export default usersController

