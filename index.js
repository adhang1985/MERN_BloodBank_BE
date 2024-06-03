const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

const userRouter = require('./routes/authRoutes');
const inventRouter = require('./routes/inventoryRoutes');


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/v1/auth',userRouter);
app.use('/api/v1/inventory',inventRouter);

app.get('/',(req,res) => {
    res.send('Welcome to server');
})

connectDB();

app.listen(PORT,() => {
    console.log(`Server running on Port ${PORT}`);
})