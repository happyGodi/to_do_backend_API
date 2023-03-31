import auth, { CustomRequest } from './../authentication/auth';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { app } from "../app/app.module";
import { Request, Response } from "express";
import { userSignValidator, userLogValidator }  from "../validation/validation"
import Users from "../models/usersModel";

function usersController (url: string) : void {
    app.post(url + '/register', async (req: Request, res: Response) => {
        try {
            const {error} = userSignValidator(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            
            const existingUser = await Users.findOne({ username: req.body.username })
            if (existingUser) return res.status(400).json({message: "User already exists!"})
            
            const salt = await bcrypt.genSalt(10)

            const user = new Users({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, salt)
            })

            const token = jwt.sign({_id: user?._id.toString()}, `${process.env.secretToken}`, {expiresIn: '2 days'})
            await user.save()
            return res.status(200).json({user, token})
        } catch (e) {
            return res.status(500).json({message: "Internal server error!"})
        }
    })

    app.post(url + '/login', async (req: Request, res: Response) => {
        try {
            const {error} = userLogValidator(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            const user = await Users.findOne({username: req.body.username})
            if (!user) {
                return res.status(404).json({message: 'Username or password is incorrect!'})
            }

            const isMatch = await bcrypt.compareSync(req.body.password, user.password)

            if (isMatch) {
                const token = jwt.sign({_id: user?._id.toString()}, `${process.env.secretToken}`, {expiresIn: '2 days'})
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
            const user = await Users.find().populate({ path: 'tasks', select: 'taskName date isDone'})
            res.status(200).json(user)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Internal server error!"})
        }
    })
    app.get(url + '/one', auth, async (req: Request, res: Response) => {
        try {
            let payload = (req as CustomRequest).token as JwtPayload
            let user = await Users.findById(payload._id)
            if (!user) return res.status(400).json({message: 'Access denied'})
            return res.status(200).json(user)
        } catch (e) {
            return res.status(500).json(e)
        }
    })
}

export default usersController

