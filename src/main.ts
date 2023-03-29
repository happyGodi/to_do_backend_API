import { app } from "./app/app.module";
import usersController from './controllers/usersController'
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

function main(): void {
    //db connection
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.db_connection}`, () => {
        console.log('Connected to database')
    })
    usersController('/users')

    app.listen(process.env.port, () => {
        console.log('Server is listening on ' + process.env.port)
    })
}

export default main