import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()
mongoose.connect(process.env.MONGO_URL)

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    }]
})
    
export default mongoose.model('User', UserSchema)