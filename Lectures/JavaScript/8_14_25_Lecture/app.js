// alert("Welcome to JavaScript")


// Numbers & Math
// console.log(2 + 3); // add
// console.log(10 - 5);// sub
// console.log(8 / 2) // div
// console.log(4 * 3) // mul
// console.log(10 % 4) // modulus

// console.log(2 + 2 * 3) // order of operation

// const age = 25; // constantly this value
// let age = 25; // let this be changed
// console.log(age)
// age = 30
// console.log(age)

// STRINGS
// var age // let & const (not constant) -- GLOBAL -- AVOID!
// let age = 20 + 10;
// console.log(typeof age)
// age = {}
// console.log(typeof age)

// const name = "John"
// console.log(typeof name)

// let name = "John"
// console.log("Hello, " + name + "!")
// console.log(`Hello, ${name}!`)

// const userName = "Alice";
// console.log(`Welcome, ${userName}!`);

// Coercion
// console.log("5" - 2) // i think you want to math
// console.log("5" + 2) // i don't think you want to math 52

const item1 = 10.99;
const item2 = 7.49;
const taxRate = 0.08;

console.log(item1)

const subtotal = item1 + item2
const total = subtotal + subtotal * taxRate

console.log(`Subtotal: $${subtotal.toFixed(2)}`)
console.log(`Total: $${total.toFixed(2)}`)

