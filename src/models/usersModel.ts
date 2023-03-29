import { Schema, Types, model } from "mongoose";

interface usersInterface {
    name : string,
    username: string,
    email: string,
    password: string,
    tasks: Types.Array<Types.ObjectId>
}

const usersSchema = new Schema<usersInterface>({
    name: {type: String},
    username: {type: String},
    email: {type: String},
    password: {type: String},
    tasks: [{type: Schema.Types.ObjectId, ref: 'Tasks'}]
})

export default model('Users', usersSchema)