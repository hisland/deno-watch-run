setTimeout(() => {
  console.log("test2.js 1", 1000);

  setTimeout(() => {
    console.log("test2.js 2", 2000);
  }, 1000);
}, 1000);
