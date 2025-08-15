# Class 5 Walkthrough: OOP & Member Management

This guide will walk you through refactoring your code to use a `Club` class and adding a simple member management UI.

---

## 1. Update `app.js`

**Remove this old code at the top of your file:**

```js
// REMOVE this old array and any related club logic:
const clubs = [
  { name: "Chess Club", capacity: 10 },
  { name: "Art Club", capacity: 8 },
];
```

**Replace it with this new code:**

```js
// Club class with member management
class Club {
  constructor(name, capacity) {
    this.name = name;
    this.capacity = capacity;
    this.members = [];
  }
  addMember(name) {
    if (this.members.length < this.capacity) {
      this.members.push(name);
    }
  }
  removeMember(name) {
    this.members = this.members.filter((m) => m !== name);
  }
}

// Array of Club instances (place this just below the Club class)
const clubs = [new Club("Chess Club", 10), new Club("Art Club", 8)];
```

---

## 2. Update `renderClubs` in `app.js`

**Remove your old `renderClubs` function:**

```js
// REMOVE this old renderClubs function:
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = clubs
    .map((club) => `<div>${club.name} (${club.capacity})</div>`)
    .join("");
}
```

**Replace it with this version:**

```js
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = clubs
    .map(
      (club) => `
    <div>
      <h2>${club.name} (${club.capacity})</h2>
      <ul>
        ${club.members
          .map(
            (m) =>
              `<li>${m} <button onclick=\"removeMember('${club.name}', '${m}')\">Remove</button></li>`
          )
          .join("")}
      </ul>
      <input id="member-input-${
        club.name
      }" type="text" placeholder="Add member" />
      <button onclick="addMember('${club.name}')">Add Member</button>
    </div>
  `
    )
    .join("");
}
```

---

## 3. Add member management functions in `app.js`

Add these helper functions below your `renderClubs` function:

```js
function addMember(clubName) {
  const club = clubs.find((c) => c.name === clubName);
  const input = document.getElementById(`member-input-${clubName}`);
  if (input.value) {
    club.addMember(input.value);
    input.value = "";
    renderClubs();
  }
}

function removeMember(clubName, memberName) {
  const club = clubs.find((c) => c.name === clubName);
  club.removeMember(memberName);
  renderClubs();
}
```

---

## 4. What you should see

- Each club now displays a list of members (initially empty), an input to add a member, and a remove button for each member.
- Adding a member updates the list; removing a member deletes them from the list.

You have now completed the steps for Class 5. In the next lesson, you'll add a toolbar for searching, filtering, and sorting clubs!
