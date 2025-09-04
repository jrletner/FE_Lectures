import { add, PI } from "./modules/math.module.js"
import * as utility from "./modules/utils.module.js"

console.log(`add(2,3) = ${add(2, 3)}`);
console.log(`PI = ${PI}`);

console.log(`slugify('Hello Modules!') -> ${utility.slugify("Hello Modules!")}`);
console.log(utility.shout("alias import"));
