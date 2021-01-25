# controlAnimationJS

<blockquote>
The simple can be simply incredible! An “original copy”, from @keyframe CSS, but with new features, light (14.3KB), elegant, powerful and with high performance. 
</blockquote>

## Getting started

### Download

Via npm

```bash
$ npm install controlAnimationjs --save
```

or manual [download](https://github.com/diogoneves07/controlAnimationJS/archive/master.zip).

### Usage

#### ES6 modules

```javascript
import controlAnimation from 'controlAnimationJS/lib/controlAnimation.js';
```

#### CommonJS

```javascript
const controlAnimation = require('controlAnimation');
```

#### File include

Link `controlAnimation.min.js` in your HTML :

```html
<script src="controlAnimation.min.js"></script>
```

### Hello world

```javascript
var element = document.createElement( "div" ),
  myAnimationObject = controlAnimation.create();

element.append( document.createTextNode( "Hello world" ) );
document.body.append( element );

myAnimationObject.element = element;
myAnimationObject.iterations = Infinity;

myAnimationObject[ 0 ] = {
  color: "#009",
  fontSize: "40px",
};
myAnimationObject[ 100 ] = {
  0: "rgb(0, 200, 150)",
};

controlAnimation.play( myAnimationObject );

```

## Browser support

| Firefox | Opera | Chrome | Edge | IE | Safari |
| --- | --- | --- | --- | --- | --- |
| 3.6 * | 11.0 * | 26.0 * | * | 5.0 * | 5.1 * |
<p>
<strong>Google Chrome:</strong> It is possible that the library also supports older versions of this browser.
</p>

[Website](https://flyneves.com) | [Documentation](https://flyneves.com/en-US/projects/controlAnimationJS/) | [MIT License](LICENSE.md) | © 2021 Diogo Neves.
