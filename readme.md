### What is AutoMapper?

AutoMapper is a simple little library built to solve a simple but annoying issues of data consolidation based on different language conventions when sending data. Some languages prefer the use of snake_case, kebab-case or camelCase when storing objects to be sent, often via json, but this is also the case when retreiving data from a database.

This generally forces multiple models to be created just for a key casing convention change, this is just annoying. As such I created a solution so that I wouldn't need to do this.

### Language Support
While both typescript and javascript are supported, things can get a little messy on the javascript side when it comes to telling the mapper how to handle incoming data. More on this later, but a not so pretty but functional solution for this is available

### Getting started
#### Sample data
```ts
const incomingData = {
  id: 0
  first_name: "Henry",
  last_name: "Fold",
  birth_date: "1724-02-11T19:24:49.913Z",
  hobbies: [
    {
      name: "drinking",
      activity_description: "relaxing after work",
    },
    { 
      name: "tennis",
    }
  ]
};
```
#### Typescript usage
```ts
import { AutoMapper, CaseType, defineType } from "../src"; // I know, not published on npm (oh well, something to worry about later)

// defining a usage models:
class Hobby {
  name: string
  activityDescription: string

  constructor() {
    this.name = null;
    this.activityDescription = null;
  }
}

class Person {
  id: number
  firstName?: string
  lastName?: string
  
  @defineType(Date)
  birthDate?: Date
  
  @defineType(Hobby)
  hobbies?: Array<Hobby>

  constructor() {
    this.id = null;
    this.firstName = null;
    this.lastName = null;
    this.birthDate = null;
    this.hobbies = null;
  }
}



// options defined when the automapper is created are merged into type registration
const mapper = new AutoMapper({ 
  convention: ParameterConvention.SNAKECASE, // this describes the key convention of the incoming data (optional)
});

const henry = mapper.map(incomingData, Person);
// and that is all it takes
```
#### Javascript usage
```js
// in javascript you don't get decorators, as an alternative you can register models to the automapper
const mapper = new AutoMapper();
mapper.register(Person)
  .define("birthDate", Date)
  .define("hobbies", Hobby);
  
const henry = mapper.map(incomingData, Person);

// if you don't like this, there is:
const mapper = new AutoMapper({ deriveType: true }); // deriveType will now use the value of the class property as the type, this means a small change in our class

class Person {

  // yes, it's weird ...
  constructor() {
    this.id = 0;
    this.firstName = "";
    this.lastName = "";
    this.birthDate = Date;
    this.hobbies = Hobby;
  }
}

// result will be the same however
const henry = mapper.map(incomingData, Person);
```

### But what if my data is a complete mess because someone put a good old "LGTM" in the PR?
Don't worry, I thought about that! 
#### Sample data from drunken commit
```ts
const incomingData = {
  Id: 0
  "first-name": "Henry",
  last_name: "Fold",
  BirthDate: "1724-02-11T19:24:49.913Z",
  hobbies: [
    {
      name: "drinking",
      activity_description: "relaxing after work"
    },
    { 
      name: "tennis",
      ActivityDescription: "Stressing after work",
    },
    ,
    { 
      name: "tennis",
      some_activityDescription: "Stressing after work",
    }
  ]
};
```
You would likely want to throw your keyboard at the person that did this.
#### Solution
```ts
const mapper = new AutoMapper({ 
  keyAutoMatch: true,
  // not efficient but will attempt to brute force a match for the data using all possible cases
});

// there is that one random annoying key though which doesn't follow a convention on the hobby data
// lets force that to `activityDescription`
mapper.register(Hobby).define('some_activityDescription', 'activityDescription');

const drunkHenry = mapper.map(incomingData, Person);
```

### What if I don't want the mapping but I want the case conversion?
Simple enough, the case converted is entirely standalone and is comptible with all browsers and nodejs compatible
```ts
import { CaseType, convert } from '../src/CaseConverter';

  const space = convert('testing string101 hello');
  const param = convert('testing-string101-hello');
  const snake = convert('testing_string101_hello');
  const dot = convert('testing.string101.hello');
  const camel = convert('testingString101Hello');
  const pascal = convert('TestingString101Hello');
  const mixed = convert('testing_string101.hello');

  snake.toSpaceSeparated();
  snake.toKebabCase();
  snake.toPascalCase();
  ...
```

### Final notes
This isn't finalized and presents some flaws, that currently aren't handled, as well as some case conventions that aren't supported currently only `space separated` / `kebab-case` / `snake_case` / `dot.case` / `camelCase` and `PascalCase` are supported.

There are a lot of other features currently not documented, 

