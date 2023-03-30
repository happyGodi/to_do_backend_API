import { app } from "../app/app.module"
import auth, { CustomRequest} from "../authentication/auth"
import { Request, Response } from "express"
import users from "../models/usersModel"
import Tasks from "../models/tasksModel"
import { JwtPayload } from 'jsonwebtoken';
import { taskValidator } from "../validation/validation"


const tasksController = (url: string) => {
    app.post(url, auth, async (req: Request, res: Response) => {
        try {
            let payload = (req as CustomRequest).token as JwtPayload
            let user = await users.findById(payload._id)
            if (!user) return res.status(400).json({ message: 'Acces denied!'})

            const {error} = taskValidator(req.body);
            if (error) return res.status(400).send(error.details[0].message);

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
            return res.json(e)
        }
    })

    app.get(url, auth, async (req: Request, res: Response) => {
        try {
            let payload = (req as CustomRequest).token as JwtPayload
            let user = await users.findById(payload._id)
            if (!user) return res.status(400).json({ message: 'Acces denied!'})

            const alltasks = await Tasks.find({ user: user._id});   
            res.status(200).json(alltasks);
        } catch (e) {
            return res.json(e)
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
            return res.json(e)
        }
    })
    app.delete(url + '/clear', auth, async (req: Request, res: Response) => {
        try {
            let payload = (req as CustomRequest).token as JwtPayload
            let user = await users.findById(payload._id)
            if (!user) return res.status(400).json({ message: 'Acces denied!'})

            await Tasks.deleteMany()
            user?.tasks.splice(0, user?.tasks.length)
            user?.save()
            return res.status(200).json({ message: 'All task deleted successfully' })
        } catch (e) {
            return res.json(e)
        }
    })
    app.put(url + '/update/:id', auth, async (req: Request, res: Response) => {
        try {

            const task = await Tasks.findById(req.params.id)
            if (!task) return res.status(404).json({ message: 'Task not found' })
            
            await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true })
            return res.status(200).json(task)
        } catch (e) {
            return res.json(e)
        }
    })
}

export default tasksController