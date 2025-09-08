// Nanoid Example
// import { nanoid } from "https://esm.sh/nanoid@5"

// const id = nanoid();

// document.getElementById("greeting").textContent = `Hello! Your id: ${id}`

// date-fns (date utilities)
// import { parseISO, format } from "https://esm.sh/date-fns@3"

// const when = parseISO("2025-09-08T14:30:00Z")
// const nice = format(when, "EEE,MMM d yyyy 'at' p")
// document.getElementById("greeting").textContent = `Class time: ${nice}`

// lodash-es (utility function)
// import { debounce } from "https://esm.sh/lodash-es@4"

// const out = document.getElementById("out")

// const onResize = debounce(() => {
//     out.textContent = JSON.stringify({ w: window.innerWidth, h: window.innerHeight }, null, 2);
// }, 2000);

// window.addEventListener("resize", onResize);

// onResize();

// axios (HTTP Requests)
// import axios from "https://esm.sh/axios@1"

// const out = document.getElementById("out");

// async function main() {
//     const res = await axios.get("https://api.github.com/repos/jrletner/FE_Lectures");
//     console.log(res);
//     out.textContent = JSON.stringify({
//         full_name: res.data.full_name,
//         stars: res.data.stargazer_count,
//         watcher: res.data.watchers_count,
//         forks: res.data.forks_count,
//         git_commit_url: res.data.git_commits_url
//     }, null, 2)
// }

// main().catch((err) => {
//     out.textContent = err?.message ?? String(err)
// })

// Convert markdown (.md) to HTML
// import { marked } from "https://esm.sh/marked@12"

// const md = `# Hello\n\n- item 1\n- item 2\n\n**Bold move!**`

// document.getElementById("greeting").textContent = "Rendered Markdown"
// document.getElementById("out").innerHTML = marked.parse(md)

// ky (tiny HTTP client)
// import ky from "https://esm.sh/ky@1"

// const out = document.getElementById("out")

// async function main() {
//     const data = await ky
//         .get("https://jsonplaceholder.typicode.com/todos/1")
//         .json();
//     console.log(data);

//     out.textContent = JSON.stringify(data, null, 2);
// }

// main().catch((err) => (out.textContent = err?.message ?? String(err)))

// Charts
// import Chart from "https://esm.sh/chart.js@4/auto";

// const canvas = document.createElement("canvas");
// canvas.width = 400;
// canvas.height = 200;
// document.body.appendChild(canvas);

// new Chart(canvas.getContext("2d"), {
//     type: "pie",
//     data: {
//         labels: ["Red", "Blue", "Yellow", "Green"],
//         datasets: [
//             {
//                 label: "Votes",
//                 data: [12, 19, 3, 5],
//                 backgroundColor: ["#f87171", "#60a5fa", "#fbbf24", "#34d399"],
//             },
//         ],
//     },
//     options: { responsive: false, maintainAspectRatio: true },
// });