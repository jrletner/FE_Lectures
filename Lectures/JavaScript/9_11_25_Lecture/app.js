// Simple Object
// const account = { owner: "Alex", balance: 0 };

// function deposit(acct, amount) {
//     if (amount <= 0) throw new Error("deposit must be greater than 0");
//     acct.balance += amount
// };

// function withdraw(acct, amount) {
//     if (amount <= 0) throw new Error("withdraw must be greater than 0")
//     if (amount > acct.balance) throw new Error("insufficient funds")
//     acct.balance -= amount
// }

// // usage
// deposit(account, 100);
// withdraw(account, 30);

// // render
// const out = document.getElementById("out") || document.createElement("pre");
// out.id = "out"
// out.textContent = JSON.stringify(account, null, 2)
// document.body.appendChild(out)


// Complex Object -- Procedural
// const accounts = [];

// function createAccount(owner, startingBalance = 0) {
//     if (startingBalance < 0) throw new Error("starting balance cannot be negative");
//     const acct = {
//         id: crypto.randomUUID(),
//         owner,
//         balance: startingBalance,
//         history: []
//     };
//     acct.history.push({
//         type: "OPEN",
//         amount: startingBalance,
//         at: new Date().toISOString()
//     });
//     accounts.push(acct);
//     return acct
// }

// function deposit(acct, amount) {
//     if (amount <= 0) throw new Error("deposit must be greater than 0");
//     acct.balance += amount
//     acct.history.push({ type: "DEPOSIT", amount, at: new Date().toISOString() })
// };

// function withdraw(acct, amount) {
//     if (amount <= 0) throw new Error("withdraw must be greater than 0")
//     if (amount > acct.balance) throw new Error("insufficient funds")
//     acct.balance -= amount
//     acct.history.push({ type: "WITHDRAW", amount, at: new Date().toISOString() })
// }

// function printStatement(acct) {
//     return {
//         owner: acct.owner,
//         balance: acct.balance,
//         history: acct.history
//     }
// }

// // usage
// const a1 = createAccount("Alex", 100);
// deposit(a1, 50)
// withdraw(a1, 20)

// const a2 = createAccount("Sam", 0);
// deposit(a2, 200)
// withdraw(a2, 25);

// // render
// const out = document.getElementById("out") || document.createElement("pre")
// out.id = "out"
// out.textContent = JSON.stringify({ a1: printStatement(a1), a2: printStatement(a2) }, null, 2)
// document.body.appendChild(out)

class BankAccount {
    // properties
    #balance = 0; // # = private
    #history = [];
    #frozen = false;

    constructor(owner, startingBalance = 0) {
        if (startingBalance < 0) throw new Error("starting blaance cannot be negative");
        this.id = crypto.randomUUID();
        this.owner = owner;
        this.#balance = startingBalance;
        this.#history.push({
            type: "OPEN",
            amount: startingBalance,
            at: new Date().toISOString()
        })
    }

    // methods
    #ensureActive() {
        if (this.#frozen) throw new Error("account is frozen")
    }

    freeze(reason = "") {
        if (this.#frozen) return;
        this.#frozen = true;
        this.#history.push({
            type: "FREEZE",
            reason,
            at: new Date().toISOString()
        })
    }

    unfreeze() {
        if (!this.#frozen) return;
        this.#frozen = false;
        this.#history({ type: "UNFREEZE", at: new Date().toISOString() })
    }

    deposit(amount) {
        this.#ensureActive();
        if (amount <= 0) throw new Error("deposit must be greater than 0")
        this.#balance += amount
        this.#history.push({
            type: "DEPOSIT",
            amount,
            at: new Date().toISOString()
        })
    }

    withdraw(amount) {
        this.#ensureActive();
        if (amount <= 0) throw new Error("withdraw must be greater than 0")
        this.#balance -= amount
        this.#history.push({
            type: "WITHDRAW",
            amount,
            at: new Date().toISOString()
        })
    }

    transferTo(target, amount) {
        this.#ensureActive();
        if (!(target instanceof (BankAccount)))
            throw new Error("target must be BankAccount");
        this.withdraw(amount);
        target.deposit(amount);
        this.#history.push({
            type: "TRANSFER_OUT",
            amount,
            to: target.id,
            at: new Date().toISOString()
        })
        target.#history.push({
            type: "TRANSFER_IN",
            amount,
            from: this.id,
            at: new Date().toISOString()
        })
    }

    get balance() {
        return this.#balance
    }

    get history() {
        return [...this.#history]
    }

    get frozen() {
        return this.#frozen
    }

    statement() {
        return {
            id: this.id,
            owner: this.owner,
            balance: this.#balance,
            frozen: this.#frozen,
            history: this.history
        }
    }
}

// usage
const a1 = new BankAccount("Alex", 100);
a1.deposit(50)
a1.withdraw(20);

const a2 = new BankAccount("Sam");
a2.deposit(200);

a1.transferTo(a2, 25);
// a2.freeze("XYZ pending")
a2.unfreeze();
a2.withdraw(25)
// render
const out = document.getElementById("out");
out.textContent = JSON.stringify({ a1: a1.statement(), a2: a2.statement() }, null, 2)
document.body.appendChild(out)