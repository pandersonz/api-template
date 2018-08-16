var express = require('express');
var bodyParser = require('body-parser'); 
var mysql = require('mysql');
var objExpress = express(); 
objExpress.use(bodyParser.json());
objExpress.use(bodyParser.urlencoded({ extended: true })); 
var con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'bd_test'   
});
objExpress.get('/datos', function(req, res) {
   var query = "SELECT * FROM datos";
   con.query(query, function(err, rows, col) {
     if(err) {
       res.write(JSON.stringify({
         error: true,
         error_object: err         
       }));
       res.end();
     } else {
       res.write(JSON.stringify(rows));
       res.end();       
     }
   });
});
 
function CreateDatos(objDato,resp) {  
  var query = "INSERT INTO dato (id, nombre,last_updated) VALUES (NULL, ";
  query += "'" + objDato.nombre + "', ";
  query += "NOW())";
    
  con.query(query, function(err, rows, col) {
    if(err) {
     resp.write(JSON.stringify({
        error: true,
        error_object: err
      }));
     resp.end();      
    } else {
      var iIDCreated = rows.insertId;
     resp.write(JSON.stringify({
        error: false,
        idCreated: iIDCreated
      }));
     resp.end();      
    }    
  });
} 
 
function ReadDatos(resp) {
  var query = "SELECT * FROM datos";
  con.query(query, function(err, rows, col) {
    if(err) {
     resp.write(JSON.stringify({
        error: true,
        error_object: err
      }));
     resp.end();
    } else {
     resp.write(JSON.stringify({
        error: false,
        data: rows
      }));
     resp.end();            
    }    
  });    
}
function UpdateDatos(objDato,resp) {
  var query = "UPDATE datos SET last_updated = NOW() ";
  if(objDato.hasOwnProperty('nombre')) {
    query += " AND nombre = '" + objDato.nombre + "' ";
  } 
  query = " WHERE id = '" + objDato.id + "'";
  
  con.query(query, function(oErrUpdate, rowsUpdate, colUpdate) {
    if(oErrUpdate) {
     resp.write(JSON.stringify({ 
        error: true,
        error_object: oErrUpdate
      }));
     resp.end();      
    } else {
     resp.write(JSON.stringify({
        error: false
      }));
     resp.end();
    }
  });
}
function DeleteDato(objDato,resp) {
  var query = "DELETE FROM Dato WHERE id = '" + objDato.id + "'";
  con.query(query, function(oErrDelete, rowsDelete, colDelete) {
    if(oErrDelete) {
     resp.write(JSON.stringify({
        error: true,
        error_object: oErrDelete
      }));
     resp.end();
    } else {
     resp.write(JSON.stringify({
        error: false
      }));
     resp.end();      
    }    
  });  
}
 
 objExpress.post('/datos', function(req, res) {
   var oDataOP = {};
   var sOP = '';
   
   oDataOP = req.body.data_op;
   sOP = req.body.op;
   
   switch(sOP) {
     
     case 'CREATE':      
      CreateDatos(oDataOP, res);
     break;
     
     case 'READ':
      ReadDatos(res);
     break;
     
     case 'UPDATE':
      UpdateDatos(oDataOP, res);
     break;
     
     case 'DELETE':
      DeleteDato(oDataOP, res);
     break;
     
     default:
      res.write(JSON.stringify({ 
        error: true, 
        error_message: 'there has not been an operation ' 
      }));
      res.end();
     break;
     
   }   
 });
 
 objExpress.listen(2525, function(req, res) {
   console.log("server listen:2525");   
 })