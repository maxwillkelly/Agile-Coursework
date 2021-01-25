const hello = "Hello";
const number = 1;
const bool = true;
const obj = {
  hello: "hello",
  number: 1,
};

console.log(bool);

function myFunction() {
  const john = "Bye";
  console.log(hello);
}

const myArrow = () => {
  const john = "Bye";
  console.log(hello);
};

myFunction();
myArrow();

const firstName = "Max";
const lastName = "Fyall";
const fullName = `${firstName} ${lastName}`; 
console.log(fullName); // Max Fyall