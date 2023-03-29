import { Schema, Types, model } from "mongoose";

interface usersInterface {
    name : string,
    username: string,
    email: string,
    password: string
}

const usersSchema = new Schema<usersInterface>({
    name: {type: String},
    username: {type: String},
    email: {type: String},
    password: {type: String}
})

export default model('users', usersSchema)