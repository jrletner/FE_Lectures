
// #Objects
// const myObj = {
//     name: "Joe",
//     age: 28,
//     gender: "Male",
//     getName() {
//         console.log(`Hello ${myObj.name}`);
//     }
// }

// console.log(myObj.getName());

// const person = {
//     name: "John",
//     age: 30,
//     greet: function () {
//         console.log("Hello");
//     },
// }
// const person2 = person
// person2.name = "alice"
// console.log(person);


// console.log(person == person2);


// person.greet();

// console.log('person.name:', person.name);
// console.log('person.age:', person.age);


// person.name = "alice"

// console.log('person', person.name);

// Javascript array
// [
//     {name: "Joe", age:28},
//     {name: "Bob", age:21}
// ]

// JSON Object
// "[
// { "name": "Joe", "age": 28 },
//     {"name": "Bob", "age":21}
// ]"

// #Cover JSON
// #JSON.stringify(object)
// #JSON.parse(JSON)
// #stringify = turn JavaScript Object into a JSON Object
// #parse = turn a JSON Object into a JavaScript Object

// JS Object
// const person = {
//     name: "John",
//     age: 30,
//     greet: function () {
//         console.log("Hello");
//     },
// }

// const myPersonJSON = JSON.stringify(person)
// localStorage.setItem('person', myPersonJSON)
// console.log(myPersonJSON);

// const parsedPerson = JSON.parse(localStorage.getItem('person'));
// console.log(parsedPerson);


// #Cover localstorage
// #localStorage.setItem(lsKey, string)
// #localStorage.getItem(lsKey, string)
// #localStorage.removeItem(lsKey)
// #show localStorage in browser
// #stringify the localStorage.setItem()
// #parse the localStorage.getItem()

// #const will not protect an object
// #an object is a hashed name of the memory location of the object (e.g. puts myObj in ruby returns a hash)
// Output: #< Object: 1 >

// DOM
// let myBody = document.body
// console.log('window:', window);
// myBody.innerHTML = "<h1>Goodbye</h2>"



// const div = document.createElement('div')

// const p = document.createElement('p')

// p.textContent = "Testing"

// div.appendChild(p)
// myBody.appendChild(div)

// console.log(myBody);

// const body = document.querySelectorAll('h1')
// body.forEach(element => {
//     element.textContent = "Bye";
// });

// console.log(body);

// const mhHi = document.querySelector('#h1-3')
// console.log(mhHi);


