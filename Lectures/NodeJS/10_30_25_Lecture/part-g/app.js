// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
    const header = title ? `\n# ${title}\n` : "";
    out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) An object with a nested array property.
const base = { name: "gadget", price: 10, tags: ["new"] };

// 2) Shallow copy: top-level properties are copied, but nested objects/arrays
//    are still SHARED between the copies.
const copyObj = { ...base };

// 3) Independent copy of the nested array (now not shared with base.tags).
const copyArr = base.tags.slice();

// 4) Deep copy of the whole structure: nothing is shared.
const deepCopy = structuredClone(base);

// 5) Change copies so we can observe the effects vs the original.
copyObj.name = "renamed";
copyArr.push("hot");

// 6) base.tags still has ["new"]; copyArr has ["new","hot"].
show({ base, copyObj, copyArr, deepCopy }, "G: copying");