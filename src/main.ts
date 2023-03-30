import { app } from "./app/app.module";
import usersController from './controllers/usersController'
import tasksController from "./controllers/tasksController";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
async function main(): Promise<void> {
    //db connection
    mongoose.set('strictQuery', true)
    
    await mongoose.connect(process.env.db_connection as string)
            .then(() => { console.log('Connected to database') })
            .catch((err) => { console.log('Error when connecting ', err) })
    usersController('/users')
    tasksController('/tasks')

    app.listen(process.env.port, () => {
        console.log('Server is listening on ' + process.env.port)
    })
}

export default main