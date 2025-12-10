import express from 'express'
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongoDb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import bodyParser from 'body-parser';


//Initilize express
const app=express()

// connect to Db
await connectDB();

//Middleware
app.use(cors())
app.use(express.json());

//Routes
app.get('/',(req, res)=>res.send("API working..."))
app.post("/api/webhooks/clerk", bodyParser.raw({ type: "*/*" }), clerkWebhooks);


//Port
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`Server is running of ${PORT}`)
});

