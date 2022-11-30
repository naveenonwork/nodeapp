

const express = require('express');
const handlebars = require('express-handlebars');
const routes = require('./routes');
 

const path = require('path'); 
const fileURLToPath = require('url');  
 

const port = 3000;
const app = express();


  
app.set('view engine', 'handlebars');
app.set('views', './views');

 app.engine('handlebars', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    })); 
 var publicPath=path.resolve(__dirname, "public"); 
app.use('/static', express.static(publicPath));


app.use(routes);    

app.listen(port, () => console.log(`App listening to port ${port}`));