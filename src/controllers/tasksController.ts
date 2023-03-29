import { app } from "../app/app.module"
import auth, { CustomRequest} from "../authentication/auth"
import { Request, Response } from "express"
import users from "../models/usersModel"
import Tasks from "../models/tasksModel"
import { JwtPayload } from 'jsonwebtoken';


const tasksController = (url: string) => {
    app.post(url, auth, async (req: Request, res: Response) => {
        try {
            let payload = (req as CustomRequest).token as JwtPayload
            let user = await users.findById(payload._id)
            if (!user) return res.status(400).json({ message: 'Acces denied!'})
            let task = new Tasks({
                taskName: req.body.taskName,
                date: Date.now(),
                isDone: false,
                user: user?._id
            })
            await task.save()
            user?.tasks.push(task)
            await user?.save()
            return res.status(200).json(task)
        } catch (e) {
            res.json(e)
        }
    })

    app.get(url, auth, async (req: Request, res: Response) => {
        try {
            const alltasks = await Tasks.find();   
            res.status(200).json(alltasks);
        } catch (e) {
            res.json(e)
        }
    })
    app.delete(url + '/delete/:id', auth, async (req: Request, res: Response) => {
        try {
            await Tasks.findByIdAndDelete(req.params.id)
            let user = await users.findOne({ tasks: req.params.id})
            user?.tasks.remove(req.params.id)
            await user?.save()
            return res.status(200).json({ message: 'Task deleted successfully' })
        } catch (e) {
            res.json(e)
        }
    })
}

export default tasksController