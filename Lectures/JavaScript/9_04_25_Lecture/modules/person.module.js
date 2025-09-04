export default class Person {
    constructor(name) {
        this.name = name
    }
    introduce() {
        return `Hi, I'm ${this.name}`
    }
}