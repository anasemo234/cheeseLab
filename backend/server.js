// === DEPENDENCIES === //
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

// === INITIALIZE THE EXPRESS APP === //
const app = express();
// === CONFIGURE APP SETTINGS === //
require('dotenv').config();
const { PORT = 4000, MONGODB_URL } = process.env;
// === CONNECT TO MONGODB === //
mongoose.connect(MONGODB_URL);
// === MONGO STATUS LISTENERS === //
mongoose.connection
.on('connected', () => console.log('Connected to MongoDb'))
.on('error', (error) => console.log('Error with MongoDb:' + err.message))
// === SET UP OUR MODEL === //
const cheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
}, { timestamps: true });

const Cheese = mongoose.model('Cheese', cheeseSchema);

// === MOUNT MIDDLEWARE === //
app.use(cors());   // Access-Control-Allow: '*'
app.use(morgan('dev'));
app.use(express.json());
// this creates req.body from incoming JSON request bodies                
// app.use(express.urlencoded({ extended: fasle }))  
// ^~~~ this also creates req.bdoy but only when express is serving HTML 
// === MOUNT ROUTES === //
app.get("/", (req, res) => {
    res.send('Hello')
});
// INDEX
app.get('/cheese', async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (error) {
        console.log('error,' error);
        res.json({error: 'something went wrong'});
    }
});
// CREATE 
app.post('/cheese', async (req, res) => {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        console.log('error,' error);
        res.json({error: 'something went wrong'});
    }
})
// UPDATE 
app.put('/cheese/:id', async (req,res) => {
    try {
        res,json(await Cheese.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } ))
        
    } catch (error) {
        console.log('error,' error);
        res.json({error: 'something went wrong'});
    }
})

// DELETE
app.delete('/cheese/id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndDelete(req.params.id));
    } catch (error) {
        console.log('error: ', error);
        res.json({error: 'something went wrong'})
    }
})
// === LISTENERS === //
