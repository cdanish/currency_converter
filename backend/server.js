import axios from "axios";
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import currencyapi from '@everapi/currencyapi-js';


const app = express();

config({path:"./config/config.env"});

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const client = new currencyapi(process.env.API_KEY);

app.get("/",async(req,res)=>{
    return res.json({"danish":"chaush"});
})

app.get("/convert",async(req,res)=>{

    const {base_currency,currency} = req.query;

    try{

    const data = await client.latest({
      base_currency: base_currency, 
      currencies: [currency]
    });

   return res.json(data);

    }catch(error){

    console.error('Currency API error:', error)
    return res.status(500).json({ message: 'Error fetching currency data' })

    }

});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))