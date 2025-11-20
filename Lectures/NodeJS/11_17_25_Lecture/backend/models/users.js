// Simple in-memory users store for demo only
let users = [
    // reset on restart
    {
        id: 1,
        email: "ada@example.com",
        name: "Ada",
        role: "admin",
        password: "password123",
    }, // seed admin
    {
        id: 2,
        email: "bao@example.com",
        name: "Bao",
        role: "user",
        password: "password123",
    }, // seed user
]; // end seed

function findByEmail(email) {
    // locate user by email
    return users.find((u) => u.email === email); // return matching user or undefined
} // end findByEmail

function publicProfile(u) {
    // non-sensitive fields
    return { id: u.id, email: u.email, name: u.name, role: u.role }; // strip password
} // end publicProfile

module.exports = { findByEmail, publicProfile }; // export helpers