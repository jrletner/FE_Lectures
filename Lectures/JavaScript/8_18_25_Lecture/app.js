// // 2 + 2 -- expression
// // 2 + 2 -- evaluated and result = 4

// console.log(10 > 5) // truthy
// console.log(5 === "5") // falsy

// console.log(Boolean(1)) // 1 = true 0 = false

// if (2 + 2 === 4) {
//     console.log("Hello")
// }

// // basic setup for if statement
// if (condition) {

// } else {

// }

// // conditional  -- is it true or false?
// let age = 19;
// if (age >= 18) {
//     console.log("You are eligible to vote.")
// } else {
//     console.log("You are not old enough to vote.")
// }

// combined conditions
// let isWeekend = true;
// let isHoliday = true;

// if (isWeekend || isHoliday) {
//     console.log(`You can relax today!`);

// } else {
//     console.log(`It's a workday`);

// }

// if (isWeekend && isHoliday) {
//     console.log(`You can relax today!`);

// } else {
//     console.log(`It's a workday`);

// }

// Nested Conditions
// const username = "admin";
// const password = "password1234"

// if (username === "admin") {
//     if (password === "password123") {
//         console.log(`Access Granted`);
//     } else {
//         console.log(`Incorrect password`);
//     }
// } else {
//     console.log(`Unknown user`);
// }

// const myName = "Joe"
// console.log(`${myName}`);


// greet();

// // Functions -- HOISTED by compiler at runtime
// function greet() {
//     console.log(`Hello world!`);
// }

// arguments / parameters
// function greet(name) {
//     console.log(`Hello, ${name}`);
// }

// greet("Codi")

// combine if statements with functions
// scope
// function checkEligibility(age) {
//     if (age >= 18) {
//         const msg = "My Message"
//         return msg
//     } else {
//         return "You cannot vote."
//     }
// }

// console.log(checkEligibility(18))

// ternary operator
// function checkEligibility(age) {
//     return age >= 18 ? "You can vote." : "You cannot vote";
// }

// console.log(checkEligibility(17));

// function calculateFinalPrice(price, discountRate = 0.1, taxRate = 0.08) {
//     const discount = price * discountRate;
//     const discountedPrice = price - discount;
//     const tax = discountedPrice * taxRate;
//     const finalPrice = discountedPrice + tax;

//     console.log(`Original Price: $${price}`);
//     console.log(`Discount: $${discount}`);
//     console.log(`Tax: $${tax}`);
//     console.log(`Final Price: $${finalPrice.toFixed(2)}`);  //using to fixed to round off to 2 decimal places.  This helps to prevent floating point errors.
// }
// console.log(calculateFinalPrice(200, 0.15, 0.1));
