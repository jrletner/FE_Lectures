# Lesson Walkthrough: From Procedural JS to OOP (Classes & Inheritance)

Goal: Start with plain functions/objects, feel the pain on a more complex case, then refactor to a class-based design that’s easier to reason about and extend.

How to use this:

- Open this folder with a local server (so `<script type="module">` works if you use modules later).
- Paste one snippet at a time into `app.js`, refresh, and watch the page and console.

---

## 1) Simple example – procedural is perfectly fine

Task: One simple bank account with deposit/withdraw and render the result.

```js
// app.js
// Minimal banking as a plain object + simple functions
const account = { owner: "Alex", balance: 0 };

function deposit(acct, amount) {
  if (amount <= 0) throw new Error("deposit must be > 0");
  acct.balance += amount;
}

function withdraw(acct, amount) {
  if (amount <= 0) throw new Error("withdraw must be > 0");
  if (amount > acct.balance) throw new Error("insufficient funds");
  acct.balance -= amount;
}

// usage
deposit(account, 100);
withdraw(account, 30);

const out = document.getElementById("out") || document.createElement("pre");
out.id = "out";
out.textContent = JSON.stringify(account, null, 2);
document.body.appendChild(out);
```

Plain-language explanation:

- We keep a tiny bit of state (`owner`, `balance`) in a simple object.
- Two tiny functions update the balance with minimal checks.
- For one account and basic rules, procedural code is clear and sufficient; classes would be extra ceremony here.

---

## 2) Complex example – procedural starts to hurt

Task: A tiny “banking” feature with multiple accounts, deposits/withdrawals, basic validation, and a simple statement. We’ll do this the procedural way first.

```js
// app.js
// Procedural banking with multiple accounts
const accounts = [];

function createAccount(owner, startingBalance = 0) {
  if (startingBalance < 0)
    throw new Error("starting balance cannot be negative");
  const acct = {
    id: crypto.randomUUID(),
    owner,
    balance: startingBalance,
    history: [],
  };
  acct.history.push({
    type: "OPEN",
    amount: startingBalance,
    at: new Date().toISOString(),
  });
  accounts.push(acct);
  return acct;
}

function deposit(acct, amount) {
  if (amount <= 0) throw new Error("deposit must be > 0");
  acct.balance += amount;
  acct.history.push({ type: "DEPOSIT", amount, at: new Date().toISOString() });
}

function withdraw(acct, amount) {
  if (amount <= 0) throw new Error("withdraw must be > 0");
  if (amount > acct.balance) throw new Error("insufficient funds");
  acct.balance -= amount;
  acct.history.push({ type: "WITHDRAW", amount, at: new Date().toISOString() });
}

function printStatement(acct) {
  return {
    owner: acct.owner,
    balance: acct.balance,
    history: acct.history,
  };
}

// Usage
const a1 = createAccount("Alex", 100);
deposit(a1, 50);
withdraw(a1, 20);

const a2 = createAccount("Sam", 0);
deposit(a2, 200);
withdraw(a2, 25);

const out = document.getElementById("out") || document.createElement("pre");
out.id = "out";
out.textContent = JSON.stringify(
  { a1: printStatement(a1), a2: printStatement(a2) },
  null,
  2
);
document.body.appendChild(out);
```

Where it starts to hurt (plain language):

- Anyone can do `acct.balance = 999999` directly—business rules are easy to bypass.
- We pass `acct` into every function; as the API grows, this gets noisy and error-prone.
- Data and behavior are split apart; it’s harder to see the full “account” story in one place.
- As features grow (fees, limits, transfers, freezing, interest), procedural glue code sprawls.

---

## 3) Refactor to OOP – class with encapsulation and behavior

Let’s wrap state and rules together. Each account manages its own data, enforces its own rules, and knows how to produce a statement.

```js
// app.js
class BankAccount {
  #balance = 0; // private state
  #history = [];
  #frozen = false;

  constructor(owner, startingBalance = 0) {
    if (startingBalance < 0)
      throw new Error("starting balance cannot be negative");
    this.id = crypto.randomUUID();
    this.owner = owner;
    this.#balance = startingBalance;
    this.#history.push({
      type: "OPEN",
      amount: startingBalance,
      at: new Date().toISOString(),
    });
  }

  #ensureActive() {
    if (this.#frozen) throw new Error("account is frozen");
  }

  freeze(reason = "") {
    if (this.#frozen) return; // idempotent
    this.#frozen = true;
    this.#history.push({
      type: "FREEZE",
      reason,
      at: new Date().toISOString(),
    });
  }
  unfreeze() {
    if (!this.#frozen) return;
    this.#frozen = false;
    this.#history.push({ type: "UNFREEZE", at: new Date().toISOString() });
  }

  deposit(amount) {
    this.#ensureActive();
    if (amount <= 0) throw new Error("deposit must be > 0");
    this.#balance += amount;
    this.#history.push({
      type: "DEPOSIT",
      amount,
      at: new Date().toISOString(),
    });
  }

  withdraw(amount) {
    this.#ensureActive();
    if (amount <= 0) throw new Error("withdraw must be > 0");
    if (amount > this.#balance) throw new Error("insufficient funds");
    this.#balance -= amount;
    this.#history.push({
      type: "WITHDRAW",
      amount,
      at: new Date().toISOString(),
    });
  }

  transferTo(target, amount) {
    this.#ensureActive();
    if (!(target instanceof BankAccount))
      throw new Error("target must be BankAccount");
    if (amount <= 0) throw new Error("transfer must be > 0");
    // Use existing rules via withdraw/deposit so validation stays centralized
    this.withdraw(amount);
    target.deposit(amount);
    this.#history.push({
      type: "TRANSFER_OUT",
      amount,
      to: target.id,
      at: new Date().toISOString(),
    });
    target.#history.push({
      type: "TRANSFER_IN",
      amount,
      from: this.id,
      at: new Date().toISOString(),
    });
  }

  get balance() {
    return this.#balance;
  }
  get history() {
    return [...this.#history];
  } // defensive copy
  get frozen() {
    return this.#frozen;
  }

  statement() {
    return {
      id: this.id,
      owner: this.owner,
      balance: this.#balance,
      frozen: this.#frozen,
      history: this.history,
    };
  }
}

// Usage
const a1 = new BankAccount("Alex", 100);
a1.deposit(50);
a1.withdraw(20);

const a2 = new BankAccount("Sam");
a2.deposit(200);

// demonstrate transfer and freeze/unfreeze
a1.transferTo(a2, 25); // move 25 from a1 to a2
a2.freeze("XYZ pending");
// a2.withdraw(10); // would throw: account is frozen
a2.unfreeze();
a2.withdraw(25);

const out = document.getElementById("out") || document.createElement("pre");
out.id = "out";
out.textContent = JSON.stringify(
  { a1: a1.statement(), a2: a2.statement() },
  null,
  2
);
document.body.appendChild(out);
```

Plain-language explanation:

- We moved the data (`#balance`, `#history`) and the rules (`deposit`, `withdraw`, `transferTo`, `freeze/unfreeze`) into one place: the class.
- `#balance` and `#history` are private—outside code can’t directly alter them.
- The public methods enforce rules every time they’re used.
- Each account instance manages its own state; creating more accounts doesn’t increase code complexity.
- `freeze()/unfreeze()` lets the account temporarily block money movement; every money-moving method checks `#ensureActive()`.
- `transferTo(other, amount)` reuses `withdraw` and `deposit` so validation stays in one place, and both accounts get matching history entries.

Benefits vs procedural in this case:

- Stronger guarantees: state can’t be mutated randomly from the outside.
- Clear API: discoverable methods (`deposit`, `withdraw`, `statement`) show how to use the object.
- Easier to extend: you can add methods (fees, freeze, transfer) without changing external utility functions everywhere.

---

## 4) When inheritance helps – specialized accounts (optional)

Let’s say we want a “FeeAccount” that charges a fixed fee on each withdrawal.

```js
// app.js
class BankAccount {
  #balance = 0;
  #history = [];
  constructor(owner, startingBalance = 0) {
    if (startingBalance < 0)
      throw new Error("starting balance cannot be negative");
    this.id = crypto.randomUUID();
    this.owner = owner;
    this.#balance = startingBalance;
    this.#history.push({
      type: "OPEN",
      amount: startingBalance,
      at: new Date().toISOString(),
    });
  }
  deposit(amount) {
    if (amount <= 0) throw new Error("deposit must be > 0");
    this.#balance += amount;
    this.#history.push({
      type: "DEPOSIT",
      amount,
      at: new Date().toISOString(),
    });
  }
  withdraw(amount) {
    if (amount <= 0) throw new Error("withdraw must be > 0");
    if (amount > this.#balance) throw new Error("insufficient funds");
    this.#balance -= amount;
    this.#history.push({
      type: "WITHDRAW",
      amount,
      at: new Date().toISOString(),
    });
  }
  get balance() {
    return this.#balance;
  }
  get history() {
    return [...this.#history];
  }
  statement() {
    return {
      id: this.id,
      owner: this.owner,
      balance: this.#balance,
      history: this.history,
    };
  }
}

class FeeAccount extends BankAccount {
  constructor(owner, startingBalance = 0, fee = 1) {
    super(owner, startingBalance); // initialize base fields (id, owner, starting state)
    this.fee = fee;
  }
  withdraw(amount) {
    const total = amount + this.fee;
    // call the base logic by temporarily delegating
    super.withdraw(total);
  }
}

// Usage
const premium = new FeeAccount("Dana", 100, 2);
premium.withdraw(10); // charges 10 + fee 2

const out = document.getElementById("out") || document.createElement("pre");
out.id = "out";
out.textContent = JSON.stringify({ premium: premium.statement() }, null, 2);
document.body.appendChild(out);
```

Plain-language explanation:

- `extends` builds a specialized account that reuses base features.
- `super(owner, startingBalance)` runs the parent constructor so core fields (`id`, `owner`, starting `balance/history`) are set up.
- Overriding `withdraw()` lets us add a fee without copying base code; we reuse the safety checks in the parent method via `super.withdraw(total)`.

When to use inheritance vs composition:

- Inheritance: one thing is a more-specific version of another and shares most behavior, only tweaking some parts.
- Composition: combine small capabilities (logging, caching, etc.) into a bigger object without building a deep class tree.

---

### Setters in subclasses – validate and normalize configuration

Setters shine when you’re “assigning a property” but want validation/normalization. Here are two examples built on top of `BankAccount`.

```js
// app.js (assumes BankAccount from above is in scope)

// 1) Revised FeeAccount with a validated `fee` setter
class FeeAccount extends BankAccount {
  #fee = 1;
  constructor(owner, startingBalance = 0, fee = 1) {
    super(owner, startingBalance);
    this.fee = fee; // goes through the setter for validation/normalization
  }
  get fee() {
    return this.#fee;
  }
  set fee(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) throw new Error("fee must be >= 0");
    this.#fee = n;
  }
  withdraw(amount) {
    // reuse base checks by calling super.withdraw with the total
    const total = amount + this.#fee;
    super.withdraw(total);
  }
}

// 2) SavingsAccount with a validated `interestRate` setter
class SavingsAccount extends BankAccount {
  #rate = 0.01; // 1% per apply
  get interestRate() {
    return this.#rate;
  }
  set interestRate(v) {
    const n = Number(v);
    // Accept [0, 0.5] for demo; real ranges depend on your domain
    if (!Number.isFinite(n) || n < 0 || n > 0.5) {
      throw new Error("interestRate must be between 0 and 0.5");
    }
    this.#rate = n;
  }
  applyInterest() {
    // Avoid side effects if frozen; deposit enforces positivity
    if (this.frozen) throw new Error("account is frozen");
    const gain = this.balance * this.#rate;
    if (gain > 0) this.deposit(gain);
  }
}

// Usage demo
const fa = new FeeAccount("Lee", 100);
fa.fee = "2"; // normalized to number 2
fa.withdraw(10); // withdraws 12 total

const sa = new SavingsAccount("Rita", 1000);
sa.interestRate = 0.02; // 2%
sa.applyInterest(); // deposits 20

const out = document.getElementById("out") || document.createElement("pre");
out.id = "out";
out.textContent = JSON.stringify(
  {
    feeAccount: fa.statement(),
    savings: sa.statement(),
  },
  null,
  2
);
document.body.appendChild(out);
```

Plain-language explanation:

- The `fee` setter ensures only non-negative numeric values are accepted; passing a string like `'2'` is normalized to a number.
- The `interestRate` setter constrains the rate to a safe range, guarding against bad input.
- Setters make assignment ergonomic while keeping validation centralized; bigger operations (like moving money) should remain explicit methods.

---

## 5) Modules – split classes across files

Let’s move our classes into separate modules to keep files focused and reusable.

Create `bank-account.js`:

```js
// bank-account.js
export class BankAccount {
  #balance = 0;
  #history = [];
  #frozen = false;
  constructor(owner, startingBalance = 0) {
    if (startingBalance < 0)
      throw new Error("starting balance cannot be negative");
    this.id = crypto.randomUUID();
    this.owner = owner;
    this.#balance = startingBalance;
    this.#history.push({
      type: "OPEN",
      amount: startingBalance,
      at: new Date().toISOString(),
    });
  }
  #ensureActive() {
    if (this.#frozen) throw new Error("account is frozen");
  }
  freeze(reason = "") {
    if (this.#frozen) return;
    this.#frozen = true;
    this.#history.push({
      type: "FREEZE",
      reason,
      at: new Date().toISOString(),
    });
  }
  unfreeze() {
    if (!this.#frozen) return;
    this.#frozen = false;
    this.#history.push({ type: "UNFREEZE", at: new Date().toISOString() });
  }
  deposit(amount) {
    this.#ensureActive();
    if (amount <= 0) throw new Error("deposit must be > 0");
    this.#balance += amount;
    this.#history.push({
      type: "DEPOSIT",
      amount,
      at: new Date().toISOString(),
    });
  }
  withdraw(amount) {
    this.#ensureActive();
    if (amount <= 0) throw new Error("withdraw must be > 0");
    if (amount > this.#balance) throw new Error("insufficient funds");
    this.#balance -= amount;
    this.#history.push({
      type: "WITHDRAW",
      amount,
      at: new Date().toISOString(),
    });
  }
  transferTo(target, amount) {
    this.#ensureActive();
    if (!(target instanceof BankAccount))
      throw new Error("target must be BankAccount");
    if (amount <= 0) throw new Error("transfer must be > 0");
    this.withdraw(amount);
    target.deposit(amount);
    this.#history.push({
      type: "TRANSFER_OUT",
      amount,
      to: target.id,
      at: new Date().toISOString(),
    });
    target.#history.push({
      type: "TRANSFER_IN",
      amount,
      from: this.id,
      at: new Date().toISOString(),
    });
  }
  get balance() {
    return this.#balance;
  }
  get history() {
    return [...this.#history];
  }
  get frozen() {
    return this.#frozen;
  }
  statement() {
    return {
      id: this.id,
      owner: this.owner,
      balance: this.#balance,
      frozen: this.#frozen,
      history: this.history,
    };
  }
}
```

Create `fee-account.js`:

```js
// fee-account.js
import { BankAccount } from "./bank-account.js";

export class FeeAccount extends BankAccount {
  #fee = 1;
  constructor(owner, startingBalance = 0, fee = 1) {
    super(owner, startingBalance);
    this.fee = fee;
  }
  get fee() {
    return this.#fee;
  }
  set fee(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) throw new Error("fee must be >= 0");
    this.#fee = n;
  }
  withdraw(amount) {
    super.withdraw(amount + this.#fee);
  }
}
```

Create `main.js`:

```js
// main.js
import { BankAccount } from "./bank-account.js";
import { FeeAccount } from "./fee-account.js";

const a1 = new BankAccount("Alex", 100);
a1.deposit(50);

const premium = new FeeAccount("Dana", 100, 2);
premium.withdraw(10); // charges 10 + fee 2

const out = document.getElementById("out") || document.createElement("pre");
out.id = "out";
out.textContent = JSON.stringify(
  { a1: a1.statement(), premium: premium.statement() },
  null,
  2
);
document.body.appendChild(out);
```

Update `index.html` to load `main.js` as a module:

```html
<script type="module" src="./main.js"></script>
```

Plain-language explanation:

- Each file exports a single responsibility. Imports wire them together.
- The browser loads `main.js` as an ES module; relative paths (`./...`) are required.
- This structure scales as features grow without cramming everything into one file.

---

## 6) Quick recap

- For tiny problems, procedural code is simple and great.
- As the surface area grows (rules, state, validation), classes group data and behavior, providing guardrails and a clearer API.
- Inheritance is optional: reach for it when a subtype tweaks small parts of a base type; otherwise prefer composition.

Happy coding!
