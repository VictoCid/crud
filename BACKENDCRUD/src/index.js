
const express = require ('express');
const morgan = require ('morgan');
const cors = require('cors');

const crudRoutes = require('./routes/crud.routes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(crudRoutes);

//app.use((err, req, res, next)=>{
  //  return res.json({
 //       message: 
 //   })
//});

app.listen(4000);
console.log('Servidor iniciado en el puerto 4000');
