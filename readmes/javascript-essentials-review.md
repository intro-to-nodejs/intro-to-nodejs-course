# JavaScript Essentials Review

## Learning Objectives

By the end of this lesson, you will be able to understand:

- the arrow function syntax
- the differences between `var`, `let`, and `const`
- object destructuring
- the spread syntax (`...`)
- CommonJS and ES6 module systems
- closures
- asynchronous programming with `async/await`

## Table of Contents

- [Setup](#setup)
- [Arrow Functions](#arrow-functions)
- [JavaScript Variables - `var`, `let`, `const`](#javascript-variables---var-let-const)
  - [Variable Update](#variable-update)
  - [Variable Scope](#variable-scope)
  - [Variable Hoisting](#variable-hoisting)
- [Object Destructuring](#object-destructuring)
- [Spread `...` Syntax](#spread--syntax)
- [CommonJS & ES2015 Modules](#commonjs--es2015-modules)
- [Closures](#closures)
- [Asynchronous Programming with `Async`/`Await`](#asynchronous-programming-with-asyncawait)
- [Additional Resources](#additional-resources)

## Setup

Before diving into Node.js, let's review several key JavaScript programming concepts that are essential to understanding the tutorials for this course.

I will be running code in a browser-based IDE: [repl.it](https://repl.it/)

## Arrow Functions

**_We will be using the arrow function syntax throughout the course._**

A function is a reusable block of JavaScript code used to perform a task. Arrow functions were introduced in ES6 and provide a simpler syntax for creating functions along with more [intuitive handling of `this`](#bonus).

```js
// ES5 Function Expression Syntax
var printName = function (firstName, lastName) {
  return `${firstName} ${lastName}`;
};

// ES6 Arrow Syntax
// 1. drop the function keyword
// 2. add a fat arrow between the parentheses and opening curly brace

const printName = (firstName, lastName) => {
  return `${firstName} ${lastName}`;
};

// If your function immediately returns a value, the curly braces wrapping the function body and return statements are not needed and the value is implicitly returned. Here's the shorthand you can use:
const printNameES6Shorthand = (firstName, lastName) =>
  `${firstName} ${lastName}`;
```

### BONUS

We won't be using `this` extensively in this course but it's good to know how arrow functions handle `this` differently compared to regular functions.

In [regular functions](https://www.w3schools.com/js/tryit.asp?filename=tryjs_arrow_function6), the `this` keyword represented the object that called the function, which could be the `window`, the `document`, a button or whatever.

In [arrow functions](https://www.w3schools.com/js/tryit.asp?filename=tryjs_arrow_function7), there are no binding of `this`. With arrow functions, the `this` keyword always represents the object that defined the arrow function.

## JavaScript Variables - `var`, `let`, `const`

In JavaScript, we can declare variables with either `var`, `let`, or `const`.

**_`let` and `const` were introduced in ES6 and are the preferred variable declaration methods for this course._**

### Variable Update

`var` variables can be updated and re-declared within its scope.

```js
// What will be logged to the console? Why?
var color = "red";
var color = "yellow";
console.log(color); // "yellow"
```

`let` variables can be updated but not re-declared. If the variable needs to change (like in a `for` loop), you should use `let`.

```js
// What will be logged to the console? Why?
let color = "red";
let color = "yellow";
console.log(color); // SyntaxError: Identifier 'color' has already been declared

let greeting = "hello";
greeting = "hi";
console.log(greeting); // 'hi'
```

`const` variables can neither be updated nor re-declared. In my opinion, you should always use `const` unless you know the variable is going to change. By using `const`, you’re telling your future self as well as collaborators on your codebase that the variable shouldn’t change.

```js
// What will be logged to the console? Why?
const color = "red";
color = "yellow";
console.log(color); // TypeError: Assignment to constant variable.
```

Once you've assigned an object to `const`, you cannot re-assign the `const` variable to a different object but you can update the methods and properties on the object.

```js
// What will be logged to the console? Why?
const computer = {
  type: "Macintosh",
  os: "Catalina",
};

computer.type = "Microsoft";
computer.os = "Windows 10";

console.log(computer); // { type: 'Microsoft', os: 'Windos 10' }

computer = {
  type: "Chromebook",
  os: "Chrome OS",
};

console.log(computer); // TypeError: Assignment to constant variable.
```

### Variable Scope

Scope describes the part of the program where variables are accessible by the program.

`var` is globally or function-scoped.

```js
// What will be logged to the console? Why?
var fruit = "apple";
var fruitEaten = 3;

if (fruitEaten > 2) {
  var fruit = "orange";
}

console.log(fruit); // "orange"

const printColor = () => {
  var color = "red";
};
console.log(color); // ReferenceError: color is not defined
```

`const` and `let` are blocked-scoped, so a variable declared within a block (e.g., the space in-between of the curly brackets of an `if...else` statement) can only be accessed within that block.

```js
// What will be logged to the console? Why?
shouldEatFruit = true;
if (shouldEatFruit) {
  let fruit = "orange";
  const anotherFruit = "apple";
  console.log("fruit inside block: ", fruit); // fruit inside block: orange
  console.log("anotherFruit inside block: ", anotherFruit); // anotherFruit inside block: apple
}

console.log("fruit outside block: ", fruit); // ReferenceError: fruit is not defined
console.log("anotherFruit outside block:", anotherFruit); // ReferenceError: anotherFruit is not defined
```

Take a look at the following code:

```js
// What will be logged to the console? Why?
let number = 1;

if (number === 1) {
  let number = 2;
  console.log("inside block: ", number);
}
console.log("outside block: ", number);
```

### Variable Hoisting

Hoisting describes the default JavaScript behavior of moving variable declarations to the top of their scope.`var`, `let`, and `const` are all hoisted, albeit a little differently.

During hoisting, `var` variables are initialized to `undefined`, so trying to access a variable declared with `var` before the declaration returns `undefined`.

```js
// What will be logged to the console? Why?
console.log(animal);
var animal = "rabbit";
```

How about this?

```js
// What will be logged to the console? Why?
var flower = "rose";
const printFlower = () => {
  console.log(flower);
  var flower = "hibiscus";
};
printFlower();
```

Trying to do the same with `let` or `const` returns a `ReferenceError`, as they are **_not_** initialized during hoisting.

```js
// What will be logged to the console? Why?
console.log(flower);
let flower = "rose"; // ReferenceError: Cannot access 'flower' before initialization
```

In short, you shouldn’t ever have to use `var` again.

## Object Destructuring

The destructuring syntax allows us to easily extract data from arrays or objects into separate variables.

```js
const person = {
  name: "Hou Chia",
  title: "software engineer",
  city: "Brooklyn,NY",
  age: 32,
};

/*
  Without Destructuring
*/
// const name = person.name;
// const title = person.title;
// const city = person.city;
// const age = person.age;

/*
  With Destructuring
*/
// const { name, title, city, age } = person;
// console.log(name, title, city, age);

/*
  With Destructuring to Different Variable Names
*/
// const {
//   name: employeeName,
//   title: employeeTitle,
//   city: employeeCity,
//   age: employeeAge,
// } = person;
// console.log(employeeName, employeeTitle, employeeCity, employeeAge);
```

If a function takes more than 1 parameter, we can pass in an object that contains
possible key/values and destructure the object:

```js
/*
  Without Destructuring
*/
const introduce = (name, title, city, age) => {
  return `Hello, my name is ${name}, and I'm a ${title}. I live in ${city}, and I'm ${age} years old.`;
};
introduce("Hou", "software engineer", "Brooklyn, NY", 32); // the order in which the arguments are passed matters here

/*
  With Destructuring
  We can destructure the person argument directly
*/
const introduce = ({ name, title, city, age }) => {
  return `Hello, my name is ${name}, and I'm a ${title}. I live in ${city}, and I'm ${age} years old.`;
};
console.log(introduce(person));
```

You can also [destructure arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)!

## Spread `...` Syntax

We can clone the properties from one object to another:

```js
const person = { name: "Hou", title: "software engineer" };
const personalInfo = { age: 32, location: "Brooklyn, NY" };

const employee = {
  id: 1,
  department: "engineering",
  ...person,
  ...personalInfo,
};
// Object {
//   id: 1;
//   department: 'engineering';
//   name: 'Hou';
//   title: 'software engineer';
//   age: 32;
//   location: 'Brooklyn, NY';
// }
```

Please note that the spread operator performs a [shallow copy, not a deep copy of an object](https://flaviocopes.com/how-to-clone-javascript-object/).

## CommonJS & ES2015 Modules

**_We will stick with [CommonJS](https://requirejs.org/docs/commonjs.html) modules for this course._**

Modules allow developers to organize their codebase within separate files or components for better reusability, flexibility, shareability, and overall maintenance. Multiple modules can be composed together to create an application.

ECMAScript Modules are defined with the use of the `import` and `export` keywords:

```js
// file1.js
const sayHi = (name) => {
  console.log(`Hello, ${name}!`);
};
export { sayHi };

//file2.js
import { sayHi } from "./file1.js";
console.log(sayHi("Hou"));
```

CommonJS uses the `module.exports` syntax for exports and the `require()` function for imports:

```js
// file1.js
const sayHi = (name) => {
  console.log(`Hello, ${name}!`);
};

module.exports = {
  sayHi,
};

//file2.js

const { sayHi } = require("./file1.js");
console.log(sayHi("Hou"));
```

A detailed look at the differences between the two module systems is outside the scope of this course, but here's an excellent [article](https://blog.logrocket.com/es-modules-in-node-today/) about it.

Although ECMAScript modules are the official standard format to package JavaScript code, they are [still considered an experimental Node.js feature](https://nodejs.org/api/esm.html#esm_ecmascript_modules) as of July 2020, since the Node.js team is still working on ensuring backward compatibility and support for both module systems.

## Closures

JavaScript functions have lexical scopes. Where a variable is accessible to a function depends on where that variable is declared within the code, hence the term **_lexical_**.

A function that is nested inside of another function has access to variables declared in its local scope, in the outer function’s scope and in the global scope. The nested function is called a **_closure_**.

```js
// What do you think will be logged to the console? Why?
const lastName = "Chia";

const printPerson = () => {
  const firstName = "Hou"; // name is a local variable created by printPerson

  // logNameAndLocation() is the closure, a function nested inside of printPerson()
  const logNameAndLocation = () => {
    const location = "Brooklyn, NY";
    // access a variable declared in the local, outer function, and global scopes
    console.log(`${firstName} ${lastName}, ${location}`);
  };
  logNameAndLocation();
};
printPerson();
```

Although `logName` has no local variables, it can still access the variable `name` declared in `printPerson`, its parent function. So when `printPerson` is invoked, `logName` can log the `name` to the console successfully.

Let's modify the code a bit:

```diff
const lastName = 'Chia';

const printPerson = () => {
  const firstName = 'Hou';

  const logNameAndLocation = () => {
    const location = 'Brooklyn, NY';
    console.log(`${firstName} ${lastName}, ${location}`);
  }
-  logNameAndLocation();
+  return logNameAndLocation;
}
- printPerson()
+  const printPersonNameAndLocation = printPerson();
+  printPersonNameAndLocation();
```

Here, the `logNameAndLocation` inner function is returned from the `printPerson` outer function.

`printPersonNameAndLocation` references an instance of `logNameAndLocation`, which is returned from `printPerson` when `printPerson` is called.

On the next line, we invoke `printPersonNameAndLocation`. Does the code still work? Would the `firstName` varible, which belongs to the outer function, still be accessible?

The answer is yes! As it turns out, a closure maintains a reference to the lexical environment, consisting of any variables that were in-scope at the time the closure was created.

Therefore, `printPersonNameAndLocation` would still be able to access the `firstName` variable, and we would still log the output to the console successfully.

## Asynchronous Programming with `Async`/`Await`

**_We'll be using the `async`/`await` pattern extensively to handle asynchronous code in the course._**

In the not-so-distant past, we relied primarily on promise chains to handle asynchronous logic, which quickly lead to [messy and unreadable code](https://www.google.com/search?q=javascript+promise+chain+hell&tbm=isch&hl=en-US&ved=2ahUKEwixjPSl4qzqAhXCn-AKHXEyDvsQBXoECAEQKA&biw=1440&bih=766#imgrc=F5kMdJKLp7ov3M)

`Async`/`Await` statements greatly simplify the syntax for making asynchronous calls with JavaScript. They make asynchronous code look like synchronous code.

Functions declared with `async` always return a promise. For example:

```js
const greet = async () => "hello"; // async implicitly wraps 'hello'in a promise
console.log(greet); // returns a Promise object

greet.then((greeting) => console.log(greeting)); // logs 'hello'
```

...is equivalent to:

```js
const greet = async () => Promise.resolve("hello");
console.log(greet()); // returns a Promise object
```

`await` pauses function execution at the `await`ed line until the promise is either resolved or rejected with a result. It only works inside `async` functions!

Take a look at the following code:

```js
const smileAfterDelay = (delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("😁");
    }, delay);
  });
};

const smiley = await smileAfterDelay(2000); // will not work because it's not inside an async function
console.log(smiley);

const smileAtMe = async () => {
  const smiley = await smileAfterDelay(3000); // wait on this line until promise is resolved or rejected
  console.log(smiley);
};

smileAtMe(); // 😁 <-- after 3 seconds
```

The built-in JavaScript [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), which is promise-based, is a prime candidate for handling with `async`/`await`.

Here is a function that performs a GET request using `fetch` to a public api, extracts the information from the returned JSON response, and logs the result to the console. We handle the response by chaining promise methods (i.e., `then`, `catch`) to the end of the `fetch` function:

```js
const fetchTrivia = () => {
  fetch("https://opentdb.com/api.php?amount=1&category=18")
    .then((response) => response.json()) // parse the JSON response, returning a promise that resolves to a JS object
    .then((data) => {
      console.log(data.results[0]);
    })
    .catch(console.error);
};
```

But if an operation depends on multiple API calls, the syntax above quickly results in a [Promise Hell.](https://www.google.com/search?q=promise+chaining+hell+javascript&tbm=isch&ved=2ahUKEwjur-iOscrqAhUapOAKHUVgBm8Q2-cCegQIABAA&oq=promise+chaining+callback+hell+javascript&gs_lcp=CgNpbWcQAzoECAAQQzoECAAQGDoECAAQHlDbTVjJamCwa2gCcAB4AIABOIgBpgeSAQIxOZgBAKABAaoBC2d3cy13aXotaW1n&sclient=img&ei=QmgMX-6GBJrIggfFwJn4Bg&bih=798&biw=960#imgrc=eo-XZ7gM_rmqXM)

ES6 offers a better alternative. Here's the same function written with `async`/`await`:

```js
const fetchTrivia = async () => {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=1&category=18"
    );
    const data = await response.json();
    console.log(data.results[0]);
  } catch (error) {
    console.error(error);
  }
};
```

## Additional Resources:

- [MDN Let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
- [MDN Const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [MDN Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [ES Modules In Node.js](https://blog.logrocket.com/es-modules-in-node-today/)
- [MDN Export](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)
- [MDN Import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- [MDN Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [Toptal Async/Await Tutorial](https://www.toptal.com/javascript/asynchronous-javascript-async-await-tutorial)
- [How to clone a JavaScript Object](https://flaviocopes.com/how-to-clone-javascript-object/)
