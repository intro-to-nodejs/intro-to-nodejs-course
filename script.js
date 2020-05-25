console.log('hello world');

let count = 5;

const countDown = setInterval(() => {
  console.log(`counting down ${count}`);
  count--;

  if (count < 0) {
    console.log("Time's up!");
    clearInterval(countDown);
  }
}, 1000);
