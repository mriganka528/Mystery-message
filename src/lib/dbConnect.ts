import mongoose from "mongoose";
type ConnectionObject = {
    isConnected?: number
}
const connection: ConnectionObject = {

}
async function connectToDb(): Promise<void> {
    if (connection.isConnected) {
        console.log("DB is already connected")
        return;
    }
    else {
        try {
            const db = await mongoose.connect(process.env.mongoURI || '')
            connection.isConnected = db.connections[0].readyState
            console.log("Db is connectedsuccessfully")

        } catch (error) {
            console.log("DB connection failed", error)
            process.exit(1)
        }
    }
}
export default connectToDb;