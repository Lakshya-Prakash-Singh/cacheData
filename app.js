const bodyParser = require('body-parser');
const express = require('express');
const cacheDataRouter = require('./routers/cacheDataRouter');
const dbsConnection = require('./connection/dbsConnection');
const res = require('express/lib/response');
const app = express()
const port = 3000;



// Body-parser middleware to convert API data into json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/api/1.0.0/cacheData', cacheDataRouter);
app.use((rez, res) => {
  res.status(404).sendFile(__dirname + "/README.md");
});



dbsConnection.connectToServer( function( err, client ) {
  if (err) { console.log(err) }
  else {    
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  }
});