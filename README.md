## Custom parameters (*customParams*)
This middleware allows to add parameters on a object, without fear of key conflict. 
It adds an object containing the parameters with a *Symbol* key.


### Installation 
`$ npm install --save req-custom`

### Usage
#### Adding as a middleware

```javascript
const express = require('express');
const app = express();
const customParameters = require('req-custom');

app.use(customParameters());
```

#### Adding custom parameters to a random object

```javascript
const customParameters = require('req-custom');
const foo = {};

customParameters()(foo);
```

#### Adding with a specific *Symbol*

```javascript
const customParameters = require('req-custom');
const foo = {};

customParameters('id')(foo);
foo.setPrm('bar', 42);
foo[Symbol.for('id')].bar === 42; // => true
```

#### Adding parameters
***`req.setPrm('parameter name', value) => req`***
```javascript
function middlewareWitre(req, res, next) {
  req.setPrm('myParam', { foo: 42, bar: { baz: 'value' } }); // => req
  req.setPrm('anotherOne', 42);                              // => req
  //...
}
```

#### Retrieving a parameter or a sub-key
***`req.getPrm('parameter name'[, ...subKeys]) => value`***

```javascript
function middlewareUse(req, res, next) {
  const a = req.getPrm('myParam');               // => { foo: 42, bar: { baz: 'value' } }
  const b = req.getPrm('myParam', "foo");        // => 42
  const c = req.getPrm('myParam', "bar", "baz"); // => 'value'
  const d = req.getPrm('myParam', "qux");        // => null
  const foo = req.getPrm('quux');                // => null
  //...
}
```

#### Deleting a parameter
***`req.deletePrm('parameter name') => value`***

```javascript
function middlewareDelete(req, res, next) {
  req.deletePrm('myParam'); // => { foo: 42, bar: { baz: 'value' } }
  req.deletePrm('quux');    // => null
  //...
}
```

#### Check a parameter
***`req.hasPrm('parameter name') => true|false`***
```javascript
function middlewareCheck(req, res, next) {
  req.hasPrm('myParam');  // => false
  req.hasPrm('quux');     // => true
  //...
}
```
