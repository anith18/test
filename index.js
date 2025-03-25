const connectToMongo = require('./db');
const express=require('express');
var cors = require('cors')

connectToMongo();
const app=express();
const port=process.env.PORT || 5000; 

const allowedOrigins = [
    "https://frontend-k1j5.onrender.com" // Deployed frontend
// ikujyhntgbvfd
];

app.use(cors({
    origin:  "https://frontend-k1j5.onrender.com",
    methods: "GET, POST, PUT, DELETE",
    credentials: true, // Allow cookies and authentication headers
}));


app.use(express.json());
//available routes

app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));
// app.use('/api/notes',require('/routes/notes'));
   
app.get('/',(req,res)=>{
    res.send("root is working");
});
app.listen(port,()=>{
    console.log("app is running on 5000");
});