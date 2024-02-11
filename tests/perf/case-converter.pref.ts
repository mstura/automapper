import { convert, CaseType } from '../../src/CaseConverter';

let perfIterations = parseInt(process.argv[2]);

console.log(`Iteration count: ${perfIterations}`);

console.time("parse");

for (let index = 0; index < perfIterations; index++) {
  convert('testing string');
}

console.timeEnd("parse");

const compTest = convert('testing string');

console.time("parse");

for (let index = 0; index < perfIterations; index++) {
  compTest.parse(CaseType.PASCALCASE);
}

console.timeEnd("parse");

console.time("access: no parse");

for (let index = 0; index < perfIterations; index++) {
  const test2 = convert('testing string');
  test2.toPascalCase();
}

console.timeEnd("access: no parse");

console.time("access: pre-parse");
const test2 = convert('testing string');
test2.parse(CaseType.PASCALCASE);

for (let index = 0; index < perfIterations; index++) {
  test2.toPascalCase();
}

console.timeEnd("access: pre-parse");

console.time("unSafeAccess: pre-parse");
const test3 = convert('testing string');
test3.parse(CaseType.PASCALCASE);

for (let index = 0; index < perfIterations; index++) {
  test3.unsafeToCaseType(CaseType.PASCALCASE);
}

console.timeEnd("unSafeAccess: pre-parse");

console.time("parse+parse");

for (let index = 0; index < perfIterations; index++) {
  const test2 = convert('testing string');
  test2.parse(CaseType.PASCALCASE);
}

console.timeEnd("parse+parse");

console.time("parse+parse+access");

for (let index = 0; index < perfIterations; index++) {
  convert('testing string').toPascalCase();
}

console.timeEnd("parse+parse+access");

console.time("parse+parse+accessUnsafe");

for (let index = 0; index < perfIterations; index++) {
  const a = convert('testing string');
  a.parse(CaseType.PASCALCASE);
  a.unsafeToCaseType(CaseType.PASCALCASE);
}

console.timeEnd("parse+parse+accessUnsafe");