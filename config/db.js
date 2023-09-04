import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const connectDB = async () => {
    try {
        let dbUri
        if(process.env.ENV == 'dev'){
            dbUri = process.env.MONGO_DB_URI
        } else{
            dbUri = process.env.MONGO_TEST_DB_URI
        }
        mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to MongoDB")
    } catch (err) {
    }
}

export default connectDB