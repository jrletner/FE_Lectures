// Single Promise example
// function getUser(id) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             if (!id) return reject(new Error("missing id"));
//             resolve({ id, name: "Ada" });
//         }, 400)
//     })
// }

// getUser("u2")
//     .then((user) => {
//         console.log(`user:`, user);

//     })
//     .then((user2) => {
//         const out = document.getElementById("out")
//         out.textContent = JSON.stringify(user2, null, 2)
//         document.body.appendChild(out)
//     })
//     .catch((err) => {
//         console.log("error:", err);

//     })
//     .finally(() => {
//         console.log("Done");

//     })

// Multiple Promises -- Promise.all
// function delay(ms, value) {
//     return new Promise((resolve) => setTimeout(() => resolve(value, ms)));

// }

// const p1 = delay(2000, "A")
// const p2 = delay(3000, "B")
// const p3 = delay(1000, "C")

// Promise.all([p1, p2, p3])
//     .then(([a, b, c]) => {
//         console.log("Here");

//         const out = document.getElementById("out")
//         out.textContent = JSON.stringify({ orderReturned: [a, b, c] }, null, 2)
//     })
//     .catch((err) => {
//         console.log("One failed:", err);

//     })

// async await functions
// function delay(ms) {
//     return new Promise((r) => setTimeout(r, ms))
// }

// async function getUser(id) {
//     await delay(3000);
//     if (!id) throw new Error("missing id")
//     return { id, name: "Grace" }
// }

// async function main() {
//     try {
//         const user = await getUser("u3")
//         const out = document.getElementById("out")
//         out.textContent = JSON.stringify(user, null, 2)
//         document.body.appendChild(out)
//     } catch {
//         console.log("error:", err);

//     }
// }
// main();

// HTTP REQUEST with fetch
async function main() {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1")
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json();
    const out = document.getElementById("out")
    out.textContent = JSON.stringify(data, null, 2)
    document.body.appendChild(out)
}

main().catch((err) => console.error(err));