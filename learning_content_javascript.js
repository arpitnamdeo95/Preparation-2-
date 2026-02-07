// Velosify Learning Content - Comprehensive Seed Data
// This file contains full learning resources for all topics

export const LEARNING_TOPICS = [
    {
        id: 'javascript-complete',
        title: 'JavaScript – Complete Guide',
        description: 'Comprehensive JavaScript tutorial from basics to advanced concepts',
        category: 'technical',
        difficulty: 'beginner',
        estimatedHours: 40,
        icon: 'code',
        modules: [
            {
                id: 'js-intro',
                title: 'Introduction to JavaScript',
                description: 'Understanding JavaScript and its role in web development',
                content: `# Introduction to JavaScript

## What is JavaScript?
JavaScript is a high-level, interpreted programming language that enables interactive web pages. It's one of the core technologies of the World Wide Web, alongside HTML and CSS.

## Why Learn JavaScript?
- **Versatile**: Runs on browsers, servers (Node.js), mobile apps, and more
- **In-Demand**: One of the most popular programming languages
- **Interactive**: Makes websites dynamic and engaging
- **Full-Stack**: Can be used for both frontend and backend development

## JavaScript Basics
JavaScript can be included in HTML using the \`<script>\` tag:

\`\`\`html
<script>
    console.log("Hello, World!");
</script>
\`\`\`

## Key Concepts
1. **Variables**: Store data values
2. **Functions**: Reusable blocks of code
3. **Events**: Respond to user actions
4. **DOM Manipulation**: Change HTML content dynamically

## Your First JavaScript Program
\`\`\`javascript
// This is a comment
let greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## Best Practices
- Use meaningful variable names
- Comment your code
- Follow consistent formatting
- Test your code regularly
`,
                videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
                estimatedMinutes: 45,
                questions: [
                    {
                        question: 'What is JavaScript primarily used for?',
                        type: 'multiple-choice',
                        options: ['Styling web pages', 'Making web pages interactive', 'Database management', 'Server configuration'],
                        correctAnswer: 'Making web pages interactive',
                        difficulty: 'easy',
                        explanation: 'JavaScript is primarily used to make web pages interactive and dynamic.'
                    },
                    {
                        question: 'Which tag is used to include JavaScript in HTML?',
                        type: 'multiple-choice',
                        options: ['<javascript>', '<js>', '<script>', '<code>'],
                        correctAnswer: '<script>',
                        difficulty: 'easy'
                    },
                    {
                        question: 'What does console.log() do?',
                        type: 'multiple-choice',
                        options: ['Creates a new variable', 'Prints output to the console', 'Defines a function', 'Creates an HTML element'],
                        correctAnswer: 'Prints output to the console',
                        difficulty: 'easy'
                    }
                ]
            },
            {
                id: 'js-variables',
                title: 'Variables & Data Types',
                description: 'Learn about variables, data types, and type conversion',
                content: `# Variables & Data Types

## Declaring Variables
JavaScript has three ways to declare variables:

### 1. let (Block-scoped, can be reassigned)
\`\`\`javascript
let age = 25;
age = 26; // Can be changed
\`\`\`

### 2. const (Block-scoped, cannot be reassigned)
\`\`\`javascript
const PI = 3.14159;
// PI = 3.14; // Error! Cannot reassign
\`\`\`

### 3. var (Function-scoped, avoid in modern code)
\`\`\`javascript
var name = "John"; // Old way, use let/const instead
\`\`\`

## Data Types

### Primitive Types
1. **String**: Text data
\`\`\`javascript
let name = "Alice";
let message = 'Hello World';
\`\`\`

2. **Number**: Numeric data
\`\`\`javascript
let age = 25;
let price = 99.99;
\`\`\`

3. **Boolean**: true or false
\`\`\`javascript
let isActive = true;
let hasPermission = false;
\`\`\`

4. **Undefined**: Variable declared but not assigned
\`\`\`javascript
let x;
console.log(x); // undefined
\`\`\`

5. **Null**: Intentional absence of value
\`\`\`javascript
let data = null;
\`\`\`

### Complex Types
1. **Object**: Collection of key-value pairs
\`\`\`javascript
let person = {
    name: "John",
    age: 30,
    city: "New York"
};
\`\`\`

2. **Array**: Ordered list of values
\`\`\`javascript
let colors = ["red", "green", "blue"];
let numbers = [1, 2, 3, 4, 5];
\`\`\`

## Type Checking
\`\`\`javascript
typeof "Hello"  // "string"
typeof 42       // "number"
typeof true     // "boolean"
typeof {}       // "object"
typeof []       // "object"
\`\`\`

## Type Conversion
\`\`\`javascript
// String to Number
let str = "123";
let num = Number(str); // 123

// Number to String
let age = 25;
let ageStr = String(age); // "25"

// To Boolean
Boolean(1)      // true
Boolean(0)      // false
Boolean("")     // false
Boolean("hi")   // true
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=9emXNzqCKyg',
                estimatedMinutes: 60,
                questions: [
                    {
                        question: 'Which keyword should you use for a value that will never change?',
                        type: 'multiple-choice',
                        options: ['var', 'let', 'const', 'static'],
                        correctAnswer: 'const',
                        difficulty: 'easy'
                    },
                    {
                        question: 'What is the data type of: let x = "123";',
                        type: 'multiple-choice',
                        options: ['number', 'string', 'boolean', 'undefined'],
                        correctAnswer: 'string',
                        difficulty: 'easy'
                    },
                    {
                        question: 'What will typeof [] return?',
                        type: 'multiple-choice',
                        options: ['array', 'object', 'list', 'undefined'],
                        correctAnswer: 'object',
                        difficulty: 'medium'
                    },
                    {
                        question: 'What is the difference between null and undefined?',
                        type: 'text',
                        correctAnswer: 'undefined means a variable has been declared but not assigned a value, while null is an intentional assignment representing no value',
                        difficulty: 'medium'
                    }
                ]
            },
            {
                id: 'js-functions',
                title: 'Functions',
                description: 'Master JavaScript functions, arrow functions, and callbacks',
                content: `# JavaScript Functions

## Function Declaration
\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("Alice")); // "Hello, Alice!"
\`\`\`

## Function Expression
\`\`\`javascript
const greet = function(name) {
    return "Hello, " + name + "!";
};
\`\`\`

## Arrow Functions (ES6+)
\`\`\`javascript
// Basic syntax
const greet = (name) => {
    return "Hello, " + name + "!";
};

// Shorter syntax (implicit return)
const greet = name => "Hello, " + name + "!";

// Multiple parameters
const add = (a, b) => a + b;

// No parameters
const sayHi = () => "Hi!";
\`\`\`

## Function Parameters

### Default Parameters
\`\`\`javascript
function greet(name = "Guest") {
    return "Hello, " + name;
}

greet();        // "Hello, Guest"
greet("John");  // "Hello, John"
\`\`\`

### Rest Parameters
\`\`\`javascript
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3, 4); // 10
\`\`\`

## Callback Functions
\`\`\`javascript
function processData(data, callback) {
    // Process data
    const result = data * 2;
    // Call the callback with result
    callback(result);
}

processData(5, (result) => {
    console.log("Result:", result); // Result: 10
});
\`\`\`

## Higher-Order Functions
\`\`\`javascript
// Function that returns a function
function multiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
\`\`\`

## Scope and Closures
\`\`\`javascript
function outer() {
    let count = 0;
    
    function inner() {
        count++;
        return count;
    }
    
    return inner;
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ',
                estimatedMinutes: 75,
                questions: [
                    {
                        question: 'What is the correct syntax for an arrow function?',
                        type: 'multiple-choice',
                        options: ['function => {}', '() => {}', 'arrow function() {}', '=> function()'],
                        correctAnswer: '() => {}',
                        difficulty: 'easy'
                    },
                    {
                        question: 'What is a callback function?',
                        type: 'multiple-choice',
                        options: [
                            'A function that calls itself',
                            'A function passed as an argument to another function',
                            'A function that returns a value',
                            'A built-in JavaScript function'
                        ],
                        correctAnswer: 'A function passed as an argument to another function',
                        difficulty: 'medium'
                    },
                    {
                        question: 'What will this code output? const add = (a, b = 5) => a + b; console.log(add(3));',
                        type: 'multiple-choice',
                        options: ['3', '5', '8', 'undefined'],
                        correctAnswer: '8',
                        difficulty: 'medium'
                    }
                ]
            },
            {
                id: 'js-arrays',
                title: 'Arrays & Objects',
                description: 'Working with arrays and objects in JavaScript',
                content: `# Arrays & Objects

## Arrays

### Creating Arrays
\`\`\`javascript
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];
let mixed = [1, "hello", true, null];
\`\`\`

### Array Methods

#### Adding/Removing Elements
\`\`\`javascript
let arr = [1, 2, 3];

// Add to end
arr.push(4);        // [1, 2, 3, 4]

// Remove from end
arr.pop();          // [1, 2, 3]

// Add to beginning
arr.unshift(0);     // [0, 1, 2, 3]

// Remove from beginning
arr.shift();        // [1, 2, 3]
\`\`\`

#### Iteration Methods
\`\`\`javascript
let numbers = [1, 2, 3, 4, 5];

// forEach - execute function for each element
numbers.forEach(num => console.log(num));

// map - create new array with transformed elements
let doubled = numbers.map(num => num * 2);
// [2, 4, 6, 8, 10]

// filter - create new array with elements that pass test
let evens = numbers.filter(num => num % 2 === 0);
// [2, 4]

// reduce - reduce array to single value
let sum = numbers.reduce((total, num) => total + num, 0);
// 15

// find - return first element that matches
let found = numbers.find(num => num > 3);
// 4
\`\`\`

## Objects

### Creating Objects
\`\`\`javascript
let person = {
    name: "John",
    age: 30,
    city: "New York",
    isEmployed: true
};
\`\`\`

### Accessing Properties
\`\`\`javascript
// Dot notation
console.log(person.name);  // "John"

// Bracket notation
console.log(person["age"]); // 30

// Dynamic property access
let prop = "city";
console.log(person[prop]);  // "New York"
\`\`\`

### Modifying Objects
\`\`\`javascript
// Add property
person.email = "john@example.com";

// Update property
person.age = 31;

// Delete property
delete person.city;
\`\`\`

### Object Methods
\`\`\`javascript
let person = {
    name: "John",
    age: 30,
    greet: function() {
        return "Hello, I'm " + this.name;
    },
    // ES6 shorthand
    introduce() {
        return \`I'm \${this.name}, \${this.age} years old\`;
    }
};

console.log(person.greet());      // "Hello, I'm John"
console.log(person.introduce());  // "I'm John, 30 years old"
\`\`\`

### Destructuring
\`\`\`javascript
// Array destructuring
let [first, second, third] = [1, 2, 3];

// Object destructuring
let {name, age} = person;
console.log(name); // "John"
console.log(age);  // 30

// With different variable names
let {name: personName, age: personAge} = person;
\`\`\`

### Spread Operator
\`\`\`javascript
// Array spread
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Object spread
let person1 = {name: "John", age: 30};
let person2 = {...person1, city: "NYC"};
// {name: "John", age: 30, city: "NYC"}
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=R8rmfD9Y5-c',
                estimatedMinutes: 90,
                questions: [
                    {
                        question: 'Which method adds an element to the end of an array?',
                        type: 'multiple-choice',
                        options: ['push()', 'pop()', 'shift()', 'unshift()'],
                        correctAnswer: 'push()',
                        difficulty: 'easy'
                    },
                    {
                        question: 'What does the map() method return?',
                        type: 'multiple-choice',
                        options: [
                            'The original array',
                            'A new array with transformed elements',
                            'A single value',
                            'undefined'
                        ],
                        correctAnswer: 'A new array with transformed elements',
                        difficulty: 'medium'
                    },
                    {
                        question: 'How do you access a property dynamically in an object?',
                        type: 'multiple-choice',
                        options: ['object.property', 'object[property]', 'object->property', 'object::property'],
                        correctAnswer: 'object[property]',
                        difficulty: 'medium'
                    }
                ]
            },
            {
                id: 'js-dom',
                title: 'DOM Manipulation',
                description: 'Learn to interact with HTML elements using JavaScript',
                content: `# DOM Manipulation

## What is the DOM?
The Document Object Model (DOM) is a programming interface for HTML documents. It represents the page structure as a tree of objects that can be manipulated with JavaScript.

## Selecting Elements

### getElementById
\`\`\`javascript
let element = document.getElementById("myId");
\`\`\`

### querySelector (CSS selector)
\`\`\`javascript
let element = document.querySelector(".myClass");
let firstButton = document.querySelector("button");
\`\`\`

### querySelectorAll
\`\`\`javascript
let allButtons = document.querySelectorAll("button");
// Returns NodeList (array-like)
\`\`\`

### Other Methods
\`\`\`javascript
let elements = document.getElementsByClassName("myClass");
let divs = document.getElementsByTagName("div");
\`\`\`

## Modifying Elements

### Changing Content
\`\`\`javascript
// Text content
element.textContent = "New text";

// HTML content
element.innerHTML = "<strong>Bold text</strong>";
\`\`\`

### Changing Attributes
\`\`\`javascript
// Set attribute
element.setAttribute("class", "active");

// Get attribute
let value = element.getAttribute("data-id");

// Direct property access
element.id = "newId";
element.className = "newClass";
\`\`\`

### Changing Styles
\`\`\`javascript
element.style.color = "red";
element.style.backgroundColor = "yellow";
element.style.fontSize = "20px";

// Add/remove CSS classes
element.classList.add("active");
element.classList.remove("hidden");
element.classList.toggle("highlight");
\`\`\`

## Creating and Adding Elements
\`\`\`javascript
// Create element
let newDiv = document.createElement("div");
newDiv.textContent = "Hello!";
newDiv.className = "message";

// Add to DOM
document.body.appendChild(newDiv);

// Insert before another element
let parent = document.getElementById("container");
let referenceNode = document.getElementById("existing");
parent.insertBefore(newDiv, referenceNode);
\`\`\`

## Removing Elements
\`\`\`javascript
// Remove element
element.remove();

// Remove child
parent.removeChild(child);
\`\`\`

## Event Handling

### addEventListener
\`\`\`javascript
let button = document.querySelector("button");

button.addEventListener("click", function() {
    console.log("Button clicked!");
});

// Arrow function
button.addEventListener("click", () => {
    console.log("Button clicked!");
});

// With event object
button.addEventListener("click", (event) => {
    console.log("Clicked at:", event.clientX, event.clientY);
});
\`\`\`

### Common Events
\`\`\`javascript
// Mouse events
element.addEventListener("click", handler);
element.addEventListener("dblclick", handler);
element.addEventListener("mouseenter", handler);
element.addEventListener("mouseleave", handler);

// Keyboard events
element.addEventListener("keydown", handler);
element.addEventListener("keyup", handler);

// Form events
form.addEventListener("submit", handler);
input.addEventListener("change", handler);
input.addEventListener("input", handler);
\`\`\`

### Event Delegation
\`\`\`javascript
// Handle clicks on multiple elements efficiently
document.querySelector("#parent").addEventListener("click", (e) => {
    if (e.target.matches(".child-button")) {
        console.log("Child button clicked!");
    }
});
\`\`\`

## Practical Example
\`\`\`javascript
// Todo list example
const input = document.querySelector("#todoInput");
const button = document.querySelector("#addButton");
const list = document.querySelector("#todoList");

button.addEventListener("click", () => {
    const text = input.value.trim();
    
    if (text) {
        const li = document.createElement("li");
        li.textContent = text;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            li.remove();
        });
        
        li.appendChild(deleteBtn);
        list.appendChild(li);
        input.value = "";
    }
});
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=5fb2aPlgoys',
                estimatedMinutes: 90,
                questions: [
                    {
                        question: 'Which method selects the first element matching a CSS selector?',
                        type: 'multiple-choice',
                        options: ['getElementById', 'querySelector', 'getElementsByClassName', 'querySelectorAll'],
                        correctAnswer: 'querySelector',
                        difficulty: 'easy'
                    },
                    {
                        question: 'How do you add a CSS class to an element?',
                        type: 'multiple-choice',
                        options: [
                            'element.class.add("active")',
                            'element.classList.add("active")',
                            'element.addClass("active")',
                            'element.style.class = "active"'
                        ],
                        correctAnswer: 'element.classList.add("active")',
                        difficulty: 'medium'
                    },
                    {
                        question: 'What is event delegation?',
                        type: 'text',
                        correctAnswer: 'Event delegation is a technique where you attach a single event listener to a parent element to handle events from multiple child elements',
                        difficulty: 'hard'
                    }
                ]
            },
            {
                id: 'js-es6',
                title: 'ES6+ Features',
                description: 'Modern JavaScript features and syntax',
                content: `# ES6+ Features

## Template Literals
\`\`\`javascript
let name = "Alice";
let age = 25;

// Old way
let message = "Hello, " + name + ". You are " + age + " years old.";

// ES6 way
let message = \`Hello, \${name}. You are \${age} years old.\`;

// Multi-line strings
let html = \`
    <div>
        <h1>\${name}</h1>
        <p>Age: \${age}</p>
    </div>
\`;
\`\`\`

## Destructuring
\`\`\`javascript
// Array destructuring
let [a, b, c] = [1, 2, 3];

// Skip elements
let [first, , third] = [1, 2, 3];

// Rest operator
let [head, ...tail] = [1, 2, 3, 4, 5];
// head = 1, tail = [2, 3, 4, 5]

// Object destructuring
let person = {name: "John", age: 30, city: "NYC"};
let {name, age} = person;

// Rename variables
let {name: personName, age: personAge} = person;

// Default values
let {name, country = "USA"} = person;
\`\`\`

## Spread Operator
\`\`\`javascript
// Array spread
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Object spread
let obj1 = {a: 1, b: 2};
let obj2 = {c: 3, d: 4};
let merged = {...obj1, ...obj2}; // {a: 1, b: 2, c: 3, d: 4}

// Copy arrays/objects
let copy = [...arr1];
let objCopy = {...obj1};
\`\`\`

## Enhanced Object Literals
\`\`\`javascript
let name = "John";
let age = 30;

// Property shorthand
let person = {name, age};
// Same as: {name: name, age: age}

// Method shorthand
let person = {
    name: "John",
    greet() {
        return \`Hello, I'm \${this.name}\`;
    }
};

// Computed property names
let prop = "dynamicKey";
let obj = {
    [prop]: "value",
    ["key" + 2]: "value2"
};
\`\`\`

## Classes
\`\`\`javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return \`Hello, I'm \${this.name}\`;
    }
    
    static species() {
        return "Homo sapiens";
    }
}

// Inheritance
class Employee extends Person {
    constructor(name, age, jobTitle) {
        super(name, age);
        this.jobTitle = jobTitle;
    }
    
    work() {
        return \`\${this.name} is working as \${this.jobTitle}\`;
    }
}

let emp = new Employee("Alice", 28, "Developer");
console.log(emp.greet());  // "Hello, I'm Alice"
console.log(emp.work());   // "Alice is working as Developer"
\`\`\`

## Modules
\`\`\`javascript
// Export (in module.js)
export const PI = 3.14159;
export function add(a, b) {
    return a + b;
}
export default class Calculator {
    // ...
}

// Import (in another file)
import Calculator, {PI, add} from './module.js';
import * as math from './module.js';
\`\`\`

## Optional Chaining
\`\`\`javascript
let user = {
    name: "John",
    address: {
        city: "NYC"
    }
};

// Safe property access
let city = user?.address?.city;  // "NYC"
let zip = user?.address?.zip;    // undefined (no error)

// Safe method call
let result = obj.method?.();
\`\`\`

## Nullish Coalescing
\`\`\`javascript
let value = null;
let defaultValue = value ?? "default";  // "default"

let count = 0;
let result = count ?? 10;  // 0 (not 10, because 0 is not null/undefined)

// Compare with ||
let result2 = count || 10;  // 10 (because 0 is falsy)
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=nZ1DMMsyVyI',
                estimatedMinutes: 80,
                questions: [
                    {
                        question: 'What is the syntax for template literals?',
                        type: 'multiple-choice',
                        options: ['Single quotes', 'Double quotes', 'Backticks', 'Parentheses'],
                        correctAnswer: 'Backticks',
                        difficulty: 'easy'
                    },
                    {
                        question: 'What does the spread operator (...) do?',
                        type: 'multiple-choice',
                        options: [
                            'Deletes elements',
                            'Expands an iterable into individual elements',
                            'Creates a loop',
                            'Defines a function'
                        ],
                        correctAnswer: 'Expands an iterable into individual elements',
                        difficulty: 'medium'
                    },
                    {
                        question: 'What is the difference between ?? and ||?',
                        type: 'text',
                        correctAnswer: '?? (nullish coalescing) only returns the right side if left is null/undefined, while || returns right side for any falsy value (0, "", false, etc.)',
                        difficulty: 'hard'
                    }
                ]
            },
            {
                id: 'js-async',
                title: 'Async JavaScript',
                description: 'Promises, async/await, and asynchronous programming',
                content: `# Asynchronous JavaScript

## Understanding Asynchronous Code
JavaScript is single-threaded but can handle asynchronous operations using callbacks, promises, and async/await.

## Callbacks
\`\`\`javascript
function fetchData(callback) {
    setTimeout(() => {
        const data = {name: "John", age: 30};
        callback(data);
    }, 1000);
}

fetchData((data) => {
    console.log(data);
});
\`\`\`

## Promises
A Promise represents a value that may be available now, later, or never.

### Creating Promises
\`\`\`javascript
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        let success = true;
        
        if (success) {
            resolve("Operation successful!");
        } else {
            reject("Operation failed!");
        }
    }, 1000);
});
\`\`\`

### Using Promises
\`\`\`javascript
promise
    .then(result => {
        console.log(result);  // "Operation successful!"
        return "Next step";
    })
    .then(result => {
        console.log(result);  // "Next step"
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        console.log("Always runs");
    });
\`\`\`

### Promise Methods
\`\`\`javascript
// Promise.all - wait for all promises
let p1 = Promise.resolve(1);
let p2 = Promise.resolve(2);
let p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
    .then(results => console.log(results)); // [1, 2, 3]

// Promise.race - first to complete
Promise.race([p1, p2, p3])
    .then(result => console.log(result)); // 1

// Promise.allSettled - wait for all, regardless of outcome
Promise.allSettled([p1, p2, p3])
    .then(results => console.log(results));
\`\`\`

## Async/Await
Syntactic sugar over promises for cleaner asynchronous code.

### Basic Syntax
\`\`\`javascript
async function fetchData() {
    try {
        let response = await fetch('https://api.example.com/data');
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}

// Using the async function
fetchData().then(data => console.log(data));
\`\`\`

### Error Handling
\`\`\`javascript
async function getData() {
    try {
        let result = await someAsyncOperation();
        console.log(result);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        console.log("Cleanup");
    }
}
\`\`\`

### Parallel Execution
\`\`\`javascript
async function fetchMultiple() {
    // Sequential (slower)
    let user = await fetchUser();
    let posts = await fetchPosts();
    
    // Parallel (faster)
    let [user, posts] = await Promise.all([
        fetchUser(),
        fetchPosts()
    ]);
    
    return {user, posts};
}
\`\`\`

## Fetch API
\`\`\`javascript
// GET request
async function getData() {
    try {
        let response = await fetch('https://api.example.com/data');
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// POST request
async function postData(userData) {
    try {
        let response = await fetch('https://api.example.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Post error:", error);
    }
}
\`\`\`

## Practical Example
\`\`\`javascript
class DataService {
    async getUser(id) {
        const response = await fetch(\`/api/users/\${id}\`);
        return response.json();
    }
    
    async getUserPosts(userId) {
        const response = await fetch(\`/api/users/\${userId}/posts\`);
        return response.json();
    }
    
    async getUserWithPosts(userId) {
        try {
            const [user, posts] = await Promise.all([
                this.getUser(userId),
                this.getUserPosts(userId)
            ]);
            
            return {
                ...user,
                posts
            };
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }
}
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=V_Kr9OSfDeU',
                estimatedMinutes: 100,
                questions: [
                    {
                        question: 'What does async/await do?',
                        type: 'multiple-choice',
                        options: [
                            'Makes code run faster',
                            'Makes asynchronous code look synchronous',
                            'Creates new threads',
                            'Prevents errors'
                        ],
                        correctAnswer: 'Makes asynchronous code look synchronous',
                        difficulty: 'medium'
                    },
                    {
                        question: 'What does Promise.all() do?',
                        type: 'multiple-choice',
                        options: [
                            'Runs promises one by one',
                            'Waits for all promises to resolve',
                            'Returns the first resolved promise',
                            'Cancels all promises'
                        ],
                        correctAnswer: 'Waits for all promises to resolve',
                        difficulty: 'medium'
                    },
                    {
                        question: 'How do you handle errors in async/await?',
                        type: 'multiple-choice',
                        options: ['if/else', 'try/catch', '.catch()', 'error()'],
                        correctAnswer: 'try/catch',
                        difficulty: 'easy'
                    }
                ]
            },
            {
                id: 'js-error-handling',
                title: 'Error Handling',
                description: 'Learn to handle errors gracefully in JavaScript',
                content: `# Error Handling in JavaScript

## Try-Catch-Finally
\`\`\`javascript
try {
    // Code that might throw an error
    let result = riskyOperation();
    console.log(result);
} catch (error) {
    // Handle the error
    console.error("An error occurred:", error.message);
} finally {
    // Always executes (cleanup code)
    console.log("Cleanup");
}
\`\`\`

## Throwing Errors
\`\`\`javascript
function divide(a, b) {
    if (b === 0) {
        throw new Error("Division by zero!");
    }
    return a / b;
}

try {
    let result = divide(10, 0);
} catch (error) {
    console.error(error.message); // "Division by zero!"
}
\`\`\`

## Custom Error Types
\`\`\`javascript
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

function validateAge(age) {
    if (age < 0) {
        throw new ValidationError("Age cannot be negative");
    }
    if (age > 150) {
        throw new ValidationError("Age is unrealistic");
    }
    return true;
}

try {
    validateAge(-5);
} catch (error) {
    if (error instanceof ValidationError) {
        console.error("Validation failed:", error.message);
    } else {
        console.error("Unknown error:", error);
    }
}
\`\`\`

## Error Object Properties
\`\`\`javascript
try {
    throw new Error("Something went wrong");
} catch (error) {
    console.log(error.name);     // "Error"
    console.log(error.message);  // "Something went wrong"
    console.log(error.stack);    // Stack trace
}
\`\`\`

## Best Practices
\`\`\`javascript
// 1. Be specific with error messages
throw new Error("User with ID 123 not found");

// 2. Don't catch errors you can't handle
try {
    criticalOperation();
} catch (error) {
    if (error instanceof SpecificError) {
        // Handle it
    } else {
        // Re-throw if you can't handle it
        throw error;
    }
}

// 3. Use finally for cleanup
let file;
try {
    file = openFile();
    processFile(file);
} catch (error) {
    console.error("File processing failed:", error);
} finally {
    if (file) {
        closeFile(file);
    }
}
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=cFTFtuEQ-10',
                estimatedMinutes: 45,
                questions: [
                    {
                        question: 'What block always executes in try-catch-finally?',
                        type: 'multiple-choice',
                        options: ['try', 'catch', 'finally', 'none'],
                        correctAnswer: 'finally',
                        difficulty: 'easy'
                    },
                    {
                        question: 'How do you throw a custom error?',
                        type: 'multiple-choice',
                        options: ['error("message")', 'throw new Error("message")', 'raise Error("message")', 'throw("message")'],
                        correctAnswer: 'throw new Error("message")',
                        difficulty: 'easy'
                    }
                ]
            },
            {
                id: 'js-best-practices',
                title: 'JavaScript Best Practices',
                description: 'Write clean, maintainable, and efficient JavaScript code',
                content: `# JavaScript Best Practices

## Code Organization

### Use Meaningful Names
\`\`\`javascript
// Bad
let d = new Date();
let x = getUserData();

// Good
let currentDate = new Date();
let userData = getUserData();
\`\`\`

### Keep Functions Small
\`\`\`javascript
// Bad - function does too much
function processUser(user) {
    validateUser(user);
    saveToDatabase(user);
    sendEmail(user);
    updateUI(user);
}

// Good - separate concerns
function processUser(user) {
    if (validateUser(user)) {
        saveUser(user);
        notifyUser(user);
    }
}
\`\`\`

## Variable Declaration

### Use const by default
\`\`\`javascript
// Use const for values that won't change
const API_URL = "https://api.example.com";
const MAX_RETRIES = 3;

// Use let for values that will change
let counter = 0;
let userName = "";

// Avoid var
\`\`\`

## Comparison and Equality

### Use Strict Equality
\`\`\`javascript
// Bad
if (value == "5") { }

// Good
if (value === "5") { }
if (value === 5) { }
\`\`\`

## Error Handling

### Always Handle Errors
\`\`\`javascript
// Bad
async function getData() {
    const response = await fetch(url);
    return response.json();
}

// Good
async function getData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
}
\`\`\`

## Performance

### Avoid Global Variables
\`\`\`javascript
// Bad
var globalCounter = 0;

function increment() {
    globalCounter++;
}

// Good
function createCounter() {
    let count = 0;
    return {
        increment: () => ++count,
        getCount: () => count
    };
}
\`\`\`

### Use Event Delegation
\`\`\`javascript
// Bad - attaching many event listeners
buttons.forEach(button => {
    button.addEventListener('click', handleClick);
});

// Good - single event listener on parent
container.addEventListener('click', (e) => {
    if (e.target.matches('button')) {
        handleClick(e);
    }
});
\`\`\`

## Modern Syntax

### Use Template Literals
\`\`\`javascript
// Bad
const message = "Hello, " + name + "! You have " + count + " messages.";

// Good
const message = \`Hello, \${name}! You have \${count} messages.\`;
\`\`\`

### Use Destructuring
\`\`\`javascript
// Bad
const name = user.name;
const age = user.age;
const city = user.city;

// Good
const {name, age, city} = user;
\`\`\`

### Use Arrow Functions Appropriately
\`\`\`javascript
// Good for callbacks
array.map(item => item * 2);

// Avoid for methods that need 'this'
const obj = {
    value: 42,
    // Bad
    getValue: () => this.value,  // 'this' is not obj
    // Good
    getValue() { return this.value; }
};
\`\`\`

## Comments and Documentation

### Write Self-Documenting Code
\`\`\`javascript
// Bad
// Check if user is adult
if (user.age >= 18) { }

// Good
const isAdult = user.age >= 18;
if (isAdult) { }
\`\`\`

### Comment Why, Not What
\`\`\`javascript
// Bad
// Increment counter by 1
counter++;

// Good
// Retry failed requests up to 3 times to handle network issues
const MAX_RETRIES = 3;
\`\`\`

## Security

### Sanitize User Input
\`\`\`javascript
// Bad
element.innerHTML = userInput;

// Good
element.textContent = userInput;
// Or use a sanitization library
\`\`\`

### Avoid eval()
\`\`\`javascript
// Bad
eval(userCode);

// Good
// Use safer alternatives or validate input thoroughly
\`\`\`
`,
                videoUrl: 'https://www.youtube.com/watch?v=Mus_vwhTCq0',
                estimatedMinutes: 60,
                questions: [
                    {
                        question: 'Which keyword should you use by default for variables?',
                        type: 'multiple-choice',
                        options: ['var', 'let', 'const', 'static'],
                        correctAnswer: 'const',
                        difficulty: 'easy'
                    },
                    {
                        question: 'Why should you use === instead of ==?',
                        type: 'multiple-choice',
                        options: [
                            'It is faster',
                            'It checks both value and type',
                            'It is required in strict mode',
                            'It prevents errors'
                        ],
                        correctAnswer: 'It checks both value and type',
                        difficulty: 'medium'
                    },
                    {
                        question: 'What is event delegation?',
                        type: 'text',
                        correctAnswer: 'Event delegation is attaching a single event listener to a parent element to handle events from multiple child elements, improving performance',
                        difficulty: 'medium'
                    }
                ]
            }
        ]
    }
];

// Export for use in application
export default LEARNING_TOPICS;
