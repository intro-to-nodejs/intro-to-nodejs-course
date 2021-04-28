# Node.js API

## Learning Objectives

By the end of this lesson, you will be able to:

- `fs` module to access and interact with the file system
- `process` module to interact with the current Node.js process

## Table of Contents

- [Node.js API Overview](#nodejs-api-overview)
- [**_CODE-ALONG_**: Set Up](#we-do-set-up)
- [`fs` Module Overview](#fs-module-overview)
  - [Load the `fs` Module](#load-the-fs-module)
  - [Inspect File Details - `fs.stat`](#inspect-file-details---fsstat)
  - [Read the Contents of a File - `fs.readFile`](#read-the-contents-of-a-file---fsreadfile)
  - [**_CHALLENGE_**: Write to a File](#challenge-write-to-a-file)
  - [**_CHALLENGE_**: Append to a File - `fs.appendFile`](#challenge-append-to-a-file---fsappendfile)
  - [Node.js Streams](#nodejs-streams)
  - [Working with Folders](#working-with-folders)
- [`process` Module Overview](#process-module-overview)
  - [Access CLI Arguments - `process.argv`](#access-cli-arguments---processargv)
  - [Access Node.js Environment Variables - `process.env`](#access-nodejs-environment-variables---processenv)
- [**_REVIEW_**](#review)
- [Additional Resources](#additional-resources)

## Node.js API Overview

Let's get started with Node.js by exploring its module system!

The module system allows you to load built-in Node.js modules as well as third-party libraries into your application to perform various tasks, including, but not limited to:

- creating web servers,
- manipulating the file system,
- making HTTP requests,
- connecting to a database,
- and more!

In this section, let's explore two popular, widely-used built-in Node.js modules - [`process`](https://nodejs.org/api/process.html) and [`fs`](https://nodejs.org/api/fs.html).

Later on in the course, we will also apply the `http` and `https` modules to create web servers, make HTTP requests, and perform other networking tasks!

## **_CODE-ALONG_**: Set Up

1. In `intro-to-nodejs-course`, create subfolder called `nodejs-api` and change into it:

   ```
   $ mkdir nodejs-api
   $ cd nodejs-api

   ```

1. In `nodejs-api`, create a `file-system.js`, `process.js`, and `test.txt` files:

   ```
   $ touch file-system.js process.js test.txt
   ```

1. Copy and paste some dummy text into `test.txt`, which is the file we will interact with for this lesson.

   <details>
     <summary>
     Copy & paste this dummy text
     </summary>

   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac sodales turpis, dignissim consequat massa. Aliquam vitae fermentum nisl. Etiam sit amet velit ullamcorper, aliquet leo non, varius nisi. Fusce vulputate venenatis magna sit amet tempor. Aliquam vestibulum faucibus sapien et cursus. Quisque venenatis vulputate viverra. Donec velit felis, fermentum nec fringilla ac, sagittis ac neque. Aenean in nisi ac nibh luctus blandit a et dolor. Praesent at lacinia ex. Morbi eros diam, rutrum vitae pellentesque id, cursus non eros. Integer consequat augue eu viverra dapibus. Cras gravida, tortor a eleifend egestas, tellus dui viverra mi, pharetra pretium velit erat malesuada erat. Praesent vitae eros feugiat, imperdiet ex eu, vulputate libero. Ut tempus sagittis dolor, ut consectetur erat convallis eget.

   Duis tempor ornare neque id tincidunt. Quisque vehicula lacinia elit, ut suscipit magna ullamcorper dapibus. Phasellus feugiat et nisl non malesuada. Suspendisse imperdiet ultrices elit, et euismod lectus scelerisque non. Suspendisse eu dui turpis. Morbi sed tortor porttitor, lacinia purus vitae, gravida erat. Nunc id massa fringilla, tristique lectus et, consectetur tortor. Phasellus blandit bibendum erat, quis cursus enim iaculis quis. Quisque porta vel sem sit amet pharetra. Maecenas vel risus nec nisi imperdiet pharetra et accumsan diam. Nam id vulputate nunc.

   Curabitur tincidunt lectus vitae turpis sollicitudin euismod. Nulla quis diam vulputate, interdum orci eu, faucibus ante. Donec mi purus, tincidunt nec pellentesque ac, ornare at neque. Donec vitae tortor dolor. Mauris vel tempus augue, in pulvinar metus. Proin tincidunt lacus at hendrerit hendrerit. Donec nec ante nec dui semper lacinia quis id lectus. Pellentesque malesuada vulputate ante, sed sollicitudin sapien aliquet quis. Nam maximus, elit ullamcorper blandit dapibus, justo velit posuere velit, vel pharetra velit justo non lacus. Suspendisse vitae vestibulum enim, sit amet sagittis metus. Ut vitae sagittis sem. Suspendisse dictum feugiat risus.

   Nam consequat urna nulla, vitae volutpat nunc tempor et. Quisque sit amet interdum nunc, sit amet elementum eros. Sed id velit quis ipsum luctus pulvinar nec vel turpis. Nunc convallis tempor nunc, sit amet posuere mi tincidunt a. Aliquam vel neque finibus, feugiat nunc non, pharetra lectus. Ut in imperdiet quam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean bibendum, purus sed viverra vehicula, ligula leo eleifend tellus, a consequat ligula elit eget ante. In vehicula orci pulvinar, porttitor elit quis, viverra libero. Phasellus quis tortor ultrices, volutpat elit a, finibus neque. Donec scelerisque ut diam a placerat.

   Vestibulum pellentesque interdum lorem at aliquam. Praesent blandit ex ac venenatis sodales. In hac habitasse platea dictumst. Duis sed est nec ex gravida tempus. Sed ac ante sit amet sapien maximus elementum. Vestibulum vel leo erat. Vestibulum eget sapien in nunc tincidunt dictum eu quis velit. Integer commodo, felis eu commodo tincidunt, leo dolor pulvinar neque, in faucibus arcu magna ac eros. In ipsum sem, ullamcorper in pretium id, luctus at dolor. Proin vitae lorem felis. Nullam facilisis, lectus id pharetra sollicitudin, lorem velit hendrerit mauris, commodo dapibus tortor arcu a sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla id turpis vel ante faucibus tristique nec eu turpis. Sed tempor, nibh ac egestas sollicitudin, dui risus sagittis neque, quis dapibus risus ipsum quis risus.

   </details>

We're all set!

## `fs` Module Overview

The `fs` module is a built-in global Node.js module that exposes an API for accessing, manipulating, and interacting with the file system. Let's use `fs` methods to read and write to `test.txt`.

All `fs` operations are available either in the [synchronous or asynchronous forms](https://nodejs.org/api/fs.html#fs_file_system).

In this course, we'll be using a newer feature of `fs`, the [`fs` Promises API](https://nodejs.org/api/fs.html#fs_fs_promises_api), which returns `Promise` objects so that we can use `async`/`await` instead of callbacks to handle asynchronicity.

We can access the API by importing it at the top of the file via `require('fs').promises`.

### Load the `fs` Module

The module system uses the `require` function to load in a module and get access to its contents.

To load in the `fs` module and get access to its properties and methods, `require` the module at the top of the file:

`nodejs-api/file-system.js`:

```js
const fs = require("fs").promises;
```

### Inspect File Details - `fs.stat()`

Every file comes with a set of information (e.g., size, creation time, etc.) we can inspect with [`fs.stat`](https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback).

Add the following code right below the `fs` module `require()` function:

`nodejs-api/file-system.js`:

```js
const getStats = async (path) => {
  try {
    // Pass in the file path
    const stats = await fs.stat(path);
    console.log(stats);
  } catch (error) {
    console.error(error);
  }
};

getStats("./test.txt");
```

Run your script in the terminal (assuming you're in the `nodejs-api` directory): `$ node script.js`

What do you see?

We can use the output of `fs.stat` to perform common programming tasks, such as checking whether or not the path resolves to a file or a directory. Let's modify `getStats()` a bit:

```diff
const getStats = async path => {
  try {
    const stats = await fs.stat(path);
    console.log(stats);
+    console.log('isFile: ', stats.isFile())
+    console.log('isDirectory: ', stats.isDirectory())

  } catch (error) {
    console.error(error);
  }
};

getStats('./test.txt');
```

When you're done, don't forget to comment out `getStats('./test.txt')` so that we can keep the console clear when testing out the remaining `fs` methods.

### Read the Contents of a File - `fs.readFile()`

We can read a file with [`fs.readFile()`](https://nodejs.org/api/fs.html#fs_filehandle_readfile_options). We have to pass two arguments: a file path and character encoding (i.e., `utf8`).

Add the following code:

`nodejs-api/file-system.js`:

```js
const readFile = async (path) => {
  try {
    const contents = await fs.readFile(path, "utf8");
    console.log(contents);
  } catch (error) {
    console.error(error);
  }
};

readFile("./test.txt");
```

Run your script in the terminal (assuming you're in the `nodejs-api` directory): `$ node script.js`

What do you see?

### **_CHALLENGE_**: Write to a File

Implement a `writeFile()` function that asynchronously writes data to `test.txt`, replacing all existing data with new data passed to `writeFile()`.

Use the [documentation](https://nodejs.org/api/fs.html#fs_fs_promises_api) to find the appropriate `fs` method for this operation.

After writing to `test.txt` with your function, check the contents of `test.txt` from your code editor. What do you see?

<details>
  <summary>
    SOLUTION
  </summary>

`nodejs-api/file-system.js`:

```js
// https://nodejs.org/api/fs.html#fs_filehandle_writefile_data_options
const writeFile = async (path, data) => {
  try {
    await fs.writeFile(path, data);
  } catch (error) {
    console.error(error);
  }
};
writeFile("./test.txt", "hello world");
```

</details>

### **_CHALLENGE_**: Append to a File - `fs.appendFile()`

Implement a `writeFile()` function that asynchronously appends data to the end of the `test.txt` file.

Use the [documentation](https://nodejs.org/api/fs.html#fs_fs_promises_api) to find the appropriate `fs` method for this operation.

After appending to `test.txt` with your function, check the contents of `test.txt` from your code editor. What do you see?

<details>
  <summary>
    SOLUTION
  </summary>
  
```js
// https://nodejs.org/api/fs.html#fs_filehandle_appendfile_data_options
const appendFile = async (path, data) => {
  try {
    await fs.appendFile(path, data);
  } catch (error) {
    console.error(error);
  }
};
appendFile('./test.txt', 'appending another hello world');
```
</details>

### Node.js Streams

The `fs` methods above load the full content of `test.txt` in memory before manipulating the content. As a result, huge files will have an adverse impact on your program's memory efficiency and speed of execution.

In this case, a better option is to access the file content using [streams](https://nodejs.org/api/stream.html#stream_stream). Streams are a way to handle and process data in smaller chunks, without loading all the data in memory.

We won't be using streams extensively for this course, but you can read and learn about the Node.js Stream Module [here](https://nodejs.dev/learn/nodejs-streams).

### Working with Folders

We won't go into detail on folder manipulation, but take a look [at this guide](https://nodejs.dev/learn/working-with-folders-in-nodejs) if you're interested.

## `process` Module Overview

The [`process`](https://nodejs.org/api/process.html) object provides information about and allows us to interact with the current Node.js process.

`process` is a global object, so it can be accessed from anywhere inside our Node.js applications without using `require()`.

Let's take a look at a few `process` properties.

### Access CLI Arguments - `process.argv`.

[`process.argv`](https://nodejs.org/api/process.html#process_process_argv) allows us to access the values passed into the application from the command-line.

1. Add the following code:

   `nodejs-api/process.js`:

   ```js
   const name = process.argv[2];
   console.log(process.argv);
   console.log(`Hi, I'm ${name}!`);
   ```

1. Run `process.js` (assuming you're in the `nodejs-api` subfolder), passing in your name (e.g., `Hou`) as an argument:

   ```
   $ node process.js Hou
   ```

   What do you see?

   The `argv` property consists of an array of all the command line invocation arguments.

   The first element (i.e., `process.argv[0]`) is the full path of the node command.

   The second element (i.e., `process.argv[1]`) is the full path of the file being executed.

   The third elements and beyond consist of the additional arguments passed from the command line. Node.js accepts any number of arguments from the command line.

1. Try passing in a `location` argument.

   ```diff
   const name = process.argv[2];
   console.log(process.argv);
   + const location = process.argv[3];
   - console.log(`Hi, I'm ${name}!`);
   + console.log(`Hi, I'm ${name}! I live in ${location}`);
   ```

You can use libraries like [yargs](http://yargs.js.org/) or [minimist](https://www.npmjs.com/package/minimist) to parse more complex arguments (e.g., `$ node process.js name=Hou location=Brooklyn`)

### Access Node.js Environment Variables - `process.env`.

Log the `process.env` property to the console:

`nodejs-api/process.js`:

```js
console.log("process.env:", process.env);
```

What do you see? It logs an object containing all the environment variables for the Node.js process.

Log `process.env.NODE_ENV` to the console:

`nodejs-api/process.js`:

```js
console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
```

You should get `process.env.NODE_ENV: undefined`.

Let's set a custom environment variable from the command-line:

```
$ NODE_ENV=development node process.js Hou Brooklyn
```

What gets logged to the console now?

## **_REVIEW_**

- What would you use the `fs` or `process` module for?
- How would you access environment variables attached to a Node.js process?
- How would you access arguments passed to a Node.js application from the command line?

## Additional Resources:

- [Node.js Buffers](https://nodejs.dev/learn/nodejs-buffers)
- [`process.exit()`](https://nodejs.dev/learn/how-to-exit-from-a-nodejs-program)
