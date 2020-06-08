const express = require('express');
const connectDB = require('./config/db')
const path = require('path')
const app = express();

connectDB();

app.use(express.json({extended: false}))

app.get('/', (req,res)=> res.json({msg : 'Welcome to contact Keeper API'}));

//Define Routes
app.use('/api/users', require('./routes/users') );
app.use('/api/auth', require('./routes/auth') );
app.use('/api/contacts', require('./routes/contacts') );

if(process.env.NODE_ENV === 'production'){
    //Set static folder
    app.use(express.static('client/build'))

    app.use('*' , (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build' , 'index.html')))
}

const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=> console.log(`Server on port ${PORT}`));

