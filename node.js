const http = require('http');
const url = require('url');
const fs = require('fs');
const tempCard = fs.readFileSync(
  './templates/template-card.html',
  'utf-8'
);
const tempOverview = fs.readFileSync(
  './templates/template-overview.html',
  'utf-8'
);
const tempProduct = fs.readFileSync(
  './templates/template-product.html',
  'utf-8'
);

const data = fs.readFileSync(
  './data.json',
  'utf-8' 
);
const replacetemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }
  return output;
};

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      errortype: 'html/css',
      myheader: 'even I dont know',
    });
    const cardsHtml = dataObj
      .map((ele) => replacetemplate(tempCard, ele))
      .join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  }
  //product
  else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replacetemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }
  //error
  else {
    res.writeHead(404, {
      errortype: 'html/css',
      myheader: 'even I dont know',
    });
    res.end('<h1>page not found<h1>');
  }
});
server.listen(7000, '127.0.0.1', () => {
  console.log('listening to the request in port no 7000');
});
 