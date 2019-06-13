const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

//database
const db = require('./config/db');

//test db
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error: '+err))

const app = express();

//middleware for handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//home gigs view
app.get('/', (req, res) => res.render('home', { layout: 'landing' }));

//gig routes
app.use('/gigs', require('./routes/gigs'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));