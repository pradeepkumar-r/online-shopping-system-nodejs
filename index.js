var express = require('express');
var path = require('path');
var app = express();
let db = require('./dbConnect/sqlconnect.js');
//var auth=require('./auth.js');

app.set('view engine', 'ejs'); 

app.locals.siteTitle = 'Ecommerce';

app.use(express.urlencoded());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(request,response){
	console.log('REDIRECT TO HOME');
	response.redirect('/home');
});

app.get('/login', function(request, response, next) {
	console.log("get called "+Date.now());
	//response.sendFile(path.join(__dirname + '/login.html'));
response.render('login');
//next();
});

app.post('/auth',function(request, response, next){
	console.log("Username is"+request.body.username+" "+request.body.password);
	//auth.verify(request.body.username,request.body.password,response);
});

app.get('/home', function(request, response, next) {
	console.log('In home');
	response.render('home',{title: 'Home'});
});

app.get('/products',function(request,response){
	console.log('In product req');
	db.query('SELECT * FROM products where not quantity=0', function (err, result, fields) {
    	if (err) {
      		throw err;
    	} else {
      		console.log(result);
      		response.render('products', {title: 'Products', products: result});
   		}
  	});
});

app.post('/addcart', function(request, response, next) {
	console.log('cart added ' + request.body.productId);
	db.query('Insert INTO CART values(1,' + request.body.productId +')', function (err, result, fields) {
    	if (err) {
      		throw err;
    	} else {
      		console.log(result);
      		response.send("success");
   		}
  	});
	
});

app.get('/cart',function(request,response) {
	console.log('In cart request');
	db.query('select products.id,products.name,products.quantity,products.price from products inner join cart on cart.productid=products.id where cart.customerid=1;',function(err,result,fields){
    	if(err){
    		throw err;
    	}
    	else{
    		console.log(result);
    		//console.log(result.RowDataPacket.productid);
    		response.render('cart',{title:'cart',customerproduct:result});
    	}
	});
});

app.post('/deletefromcart',function(request,response){
  console.log('In delete from cart');
  db.query('delete from cart where productid='+request.body.productId+' and customerid=1',function(err,result,fields){
    if(err){
      throw err;
    }else{
      console.log(result);
      response.send('success');
    }
  });

});


console.log("The dir name is " +__dirname);
console.log("App is running");
app.listen(3000);