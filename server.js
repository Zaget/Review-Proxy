// <<<<<<<<<<<<<<<<<<<<<<<<< Server Side Rendering >>>>>>>>>>>>>>>>>>>>>>>>
const express = require('express')
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const clientBundles = './public/services';
const serverBundles = './templates/services';
const serviceConfig = require('./service-config.json');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDom.renderToString(component);
  });
};

app.get('/restaurants/:id', function(req, res) {
  let id = req.params.id;
  axios.get(`http://proxyloadbalancer-1317420474.us-west-1.elb.amazonaws.com/api/restaurants/${id}`)
  .then(({data}) => {
    let obj = {
      reviewList: data,
      rating: data.rating
    }
  let components = renderComponents(services, obj);
    res.end(Layout(
      'Zaget Reviews',
      App(...components),
      Scripts(Object.keys(services), obj)
    ));
  });
});

app.listen(port, () => {
  console.log(`server running at: ${port}`);
});

//<<<<<<<<<<<<<<<< Original >>>>>>>>>>>>>>>>>>>>>>>>>>>
// // const newrelic = require('newrelic');
// const express = require('express');
// const axios = require('axios');
// // const morgan = require('morgan');
// const path = require('path');
// const app = express();
// const port = 3000;
// // app.use(morgan('dev'));
// const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(bodyParser.json());

// app.use('/restaurants', express.static(path.join(__dirname, './public')));

// // Original
// app.get('/restaurants/:id', (req, res) => {
//   res.sendFile(path.join(__dirname, './public/index.html'));
// });

// app.use(express.static(path.join(__dirname, './public')));

// app.listen(port, () => {
//   console.log(`server running at: http://localhost:${port}`);
// });

// <<<<<<<<<<<<<<<<<<<<<<<< SSR >>>>>>>>>>>>>>>>>>>>>>>>>
// app.get('/restaurants/:id', (req, res) => {
//   axios.get(`http://54.183.72.230:3003/api/restaurants/${req.params.id}`)
//   .then((data) => {
//     var obj = {
    
//     }
//     res.send()
// });