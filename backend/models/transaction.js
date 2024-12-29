import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()
mongoose.connect(process.env.MONGO_URL)


const TransactionSchema = new mongoose.Schema({
    description: {type: String, required: true},
    amount: {type: Number, required: true}, 
    date: {type: Date, required: true},
    time: {type: String, required: true},
}) 

export default mongoose.model('Transaction', TransactionSchema)