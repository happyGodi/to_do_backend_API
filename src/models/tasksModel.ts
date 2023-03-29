import { Schema, model, Types } from "mongoose";

interface task {
    taskName: string;
    date: Date;
    isDone: boolean;
    user: Types.ObjectId
}

const taskSchema = new Schema<task>({
    taskName: { type: String },
    date: { type: Date },
    isDone: { type: Boolean },
    user: { type: Schema.Types.ObjectId, ref: 'users' }
})

export default model('Tasks', taskSchema)