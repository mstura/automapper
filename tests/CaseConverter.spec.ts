import { describe, it } from 'mocha';
import { assert } from "chai";
import { CaseType, convert } from '../src/CaseConverter';


describe('CaseConverter', () => {

  const space = convert('testing string101 hello');
  const param = convert('testing-string101-hello');
  const snake = convert('testing_string101_hello');
  const dot = convert('testing.string101.hello');
  const camel = convert('testingString101Hello');
  const pascal = convert('TestingString101Hello');
  const mixed = convert('testing_string101.hello');

  describe('#toSpaceSeparated', () => {

    const expectedValue = 'testing string101 hello';

    it('should transform space seperated strings to space seperated strings', () => {
      assert.equal(space.toSpaceSeparated(), expectedValue);
    });

    it('should transform param case strings to space seperated strings', () => {
      assert.equal(param.toSpaceSeparated(), expectedValue);
    });

    it('should transform snake case strings to space seperated strings', () => {
      assert.equal(snake.toSpaceSeparated(), expectedValue);
    });

    it('should transform dot case strings to space seperated strings', () => {
      assert.equal(dot.toSpaceSeparated(), expectedValue);
    });

    it('should transform camel case strings to space seperated strings', () => {
      assert.equal(camel.toSpaceSeparated(), expectedValue);
    });

    it('should transform pascal case strings to space seperated strings', () => {
      assert.equal(pascal.toSpaceSeparated(), expectedValue);
    });

  });

  describe('#toParamCase', () => {

    const expectedValue = 'testing-string101-hello';

    it('should transform space seperated strings to param case strings', () => {
      assert.equal(space.toParamCase(), expectedValue);
    });

    it('should transform param case strings to param case strings', () => {
      assert.equal(param.toParamCase(), expectedValue);
    });

    it('should transform snake case strings to param case strings', () => {
      assert.equal(snake.toParamCase(), expectedValue);
    });

    it('should transform dot case strings to param case strings', () => {
      assert.equal(dot.toParamCase(), expectedValue);
    });

    it('should transform camel case strings to param case strings', () => {
      assert.equal(camel.toParamCase(), expectedValue);
    });

    it('should transform pascal case strings to param case strings', () => {
      assert.equal(pascal.toParamCase(), expectedValue);
    });

  });

  describe('#toSnakeCase', () => {

    const expectedValue = 'testing_string101_hello';

    it('should transform space seperated strings to snake case strings', () => {
      assert.equal(space.toSnakeCase(), expectedValue);
    });

    it('should transform param case strings to snake case strings', () => {
      assert.equal(param.toSnakeCase(), expectedValue);
    });

    it('should transform snake case strings to snake case strings', () => {
      assert.equal(snake.toSnakeCase(), expectedValue);
    });

    it('should transform dot case strings to snake case strings', () => {
      assert.equal(dot.toSnakeCase(), expectedValue);
    });

    it('should transform camel case strings to snake case strings', () => {
      assert.equal(camel.toSnakeCase(), expectedValue);
    });

    it('should transform pascal case strings to snake case strings', () => {
      assert.equal(pascal.toSnakeCase(), expectedValue);
    });

  });

  describe('#toDotCase', () => {

    const expectedValue = 'testing.string101.hello';

    it('should transform space seperated strings to dot case strings', () => {
      assert.equal(space.toDotCase(), expectedValue);
    });

    it('should transform param case strings to dot case strings', () => {
      assert.equal(param.toDotCase(), expectedValue);
    });

    it('should transform snake case strings to dot case strings', () => {
      assert.equal(snake.toDotCase(), expectedValue);
    });

    it('should transform dot case strings to dot case strings', () => {
      assert.equal(dot.toDotCase(), expectedValue);
    });

    it('should transform camel case strings to dot case strings', () => {
      assert.equal(camel.toDotCase(), expectedValue);
    });

    it('should transform pascal case strings to dot case strings', () => {
      assert.equal(pascal.toDotCase(), expectedValue);
    });

  });

  describe('#toPascalCase', () => {

    const expectedValue = 'TestingString101Hello';

    it('should transform space seperated strings to pascal case strings', () => {
      assert.equal(space.toPascalCase(), expectedValue);
    });

    it('should transform param case strings to pascal case strings', () => {
      assert.equal(param.toPascalCase(), expectedValue);
    });

    it('should transform snake case strings to pascal case strings', () => {
      assert.equal(snake.toPascalCase(), expectedValue);
    });

    it('should transform dot case strings to pascal case strings', () => {
      assert.equal(dot.toPascalCase(), expectedValue);
    });

    it('should transform camel case strings to pascal case strings', () => {
      assert.equal(camel.toPascalCase(), expectedValue);
    });

    it('should transform pascal case strings to pascal case strings', () => {
      assert.equal(pascal.toPascalCase(), expectedValue);
    });

  });

  describe('#toCamelCase', () => {

    const expectedValue = 'testingString101Hello';

    it('should transform space seperated strings to camel case strings', () => {
      assert.equal(space.toCamelCase(), expectedValue);
    });

    it('should transform param case strings to camel case strings', () => {
      assert.equal(param.toCamelCase(), expectedValue);
    });

    it('should transform snake case strings to camel case strings', () => {
      assert.equal(snake.toCamelCase(), expectedValue);
    });

    it('should transform dot case strings to camel case strings', () => {
      assert.equal(dot.toCamelCase(), expectedValue);
    });

    it('should transform camel case strings to camel case strings', () => {
      assert.equal(camel.toCamelCase(), expectedValue);
    });

    it('should transform pascal case strings to camel case strings', () => {
      assert.equal(pascal.toCamelCase(), expectedValue);
    });
  });

  describe('#equals', () => {

    it('should compare caseConverter buffers', () => {
      assert.isTrue(space.equals(param));
      assert.isTrue(space.equals(snake));
      assert.isTrue(space.equals(dot));
      assert.isTrue(space.equals(camel));
      assert.isTrue(space.equals(pascal));
      assert.isTrue(space.equals(mixed));
    });

    it('should compare caseConverter Case CAMELCASE standardized', () => {
      assert.isTrue(space.equals(param, CaseType.CAMELCASE));
      assert.isTrue(space.equals(snake, CaseType.CAMELCASE));
      assert.isTrue(space.equals(dot, CaseType.CAMELCASE));
      assert.isTrue(space.equals(camel, CaseType.CAMELCASE));
      assert.isTrue(space.equals(pascal, CaseType.CAMELCASE));
      assert.isTrue(space.equals(mixed, CaseType.CAMELCASE));
    });

    it('should compare caseConverter buffers using UPPER', () => {
      assert.isTrue(space.equals(param, CaseType.UPPER));
      assert.isTrue(space.equals(snake, CaseType.UPPER));
      assert.isTrue(space.equals(dot, CaseType.UPPER));
      assert.isTrue(space.equals(camel, CaseType.UPPER));
      assert.isTrue(space.equals(pascal, CaseType.UPPER));
      assert.isTrue(space.equals(mixed, CaseType.UPPER));
    });

    it('should compare caseConverter buffers using LOWER', () => {
      assert.isTrue(space.equals(param, CaseType.LOWER));
      assert.isTrue(space.equals(snake, CaseType.LOWER));
      assert.isTrue(space.equals(dot, CaseType.LOWER));
      assert.isTrue(space.equals(camel, CaseType.LOWER));
      assert.isTrue(space.equals(pascal, CaseType.LOWER));
      assert.isTrue(space.equals(mixed, CaseType.LOWER));
    });

  });

});