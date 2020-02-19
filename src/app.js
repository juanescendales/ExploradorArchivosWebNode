const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

// importing Routes
const indexRoutes =require('./routes/index.js')

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
// routes
app.use('/',indexRoutes);

// static files
app.use('/static', express.static(__dirname + '/public'));

// listening the Server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});