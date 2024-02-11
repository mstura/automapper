import { assert } from 'chai';
import { CaseType as ParameterConvention } from "../src/CaseConverter";
import { AutoMapper } from '../src/AutoMapper';
import { defineType } from '../src/metadata';
import { fromObjectToArray } from '../src/DataTransforms';

class GrandParent {
  death: null;

  constructor() {
    this.death = null;
  }
}

class Parent extends GrandParent {
  id: null;
  constructor() {
    super();
    this.id = null;
  }
}

class Son extends Parent {
  age: null;

  constructor() {
    super();
    this.age = null;
  }
}

class ConvertedObj {
  value: string | null;
  name: string | null;

  constructor() {
    this.name = null;
    this.value = null;
  }
}

class TestObject {
  id: number | null;
  value: number | null;
  message: string;
  @defineType(Date)
  date: Date | null;

  constructor() {
    this.id = null;
    this.value = null;
    this.message = '';
    this.date = null;
  }
}

class CamelCaseConventionTest {
  initialType: null;
  someValue: null;
  mesageOne: null;
  opts: ConvertedObj[];

  constructor() {
    this.initialType = null;
    this.someValue = null;
    this.mesageOne = null;
    this.opts = [];
  }
}

class PascalCaseConventionTest {
  InitialType: null;
  SomeValue: null;
  MesageOne: null;
  constructor() {
    this.InitialType = null;
    this.SomeValue = null;
    this.MesageOne = null;
  }
}

class RecursiveModel {
  id: string;
  value: number;
  // @defineType(CamelCaseConventionTest)
  param: any;
  @defineType(CamelCaseConventionTest)
  params: CamelCaseConventionTest[];
  @defineType(CamelCaseConventionTest)
  noSerialize: any;

  constructor() {
    this.id = '';
    this.value = 0;
    this.param = null; 

    this.params = [];

    this.noSerialize = null; 
  }
}

defineType(CamelCaseConventionTest)(RecursiveModel.prototype, "param");

class RegisterModel {
  id: null;
  value: number;
  @defineType(CamelCaseConventionTest)
  param: null;
  @defineType(CamelCaseConventionTest)
  params: CamelCaseConventionTest[];

  constructor() {
    this.id = null;
    this.value = 0;
    this.param = null;

    this.params = [];
  }
}

describe('lib/util/auto-mapper', () => {
  describe('#map', () => {
    it('should map an object into a model following return model parameter convention (camel case) from snake case', () => {
      const mapper = new AutoMapper({ convention: ParameterConvention.SNAKECASE });
      const data = { initial_type: 1, some_value: 555, mesage_one: 'first message' };
      const instance = mapper.map(data, CamelCaseConventionTest);

      assert.instanceOf(instance, CamelCaseConventionTest);
      assert.equal(instance.initialType, 1);
      assert.equal(instance.someValue, 555);
      assert.equal(instance.mesageOne, 'first message');
    });

    it('should map an object into a model following return model parameter convention (camel case) from param case', () => {
      const mapper = new AutoMapper({ convention: ParameterConvention.PARAMCASE });
      const data = { 'initial-type': 1, 'some-value': 555, 'mesage-one': 'first message' };
      const instance = mapper.map(data, CamelCaseConventionTest);

      assert.instanceOf(instance, CamelCaseConventionTest);
      assert.equal(instance.initialType, 1);
      assert.equal(instance.someValue, 555);
      assert.equal(instance.mesageOne, 'first message');
    });

    it('should map an object into a model following return model parameter convention (camel case) from camel case', () => {
      const mapper = new AutoMapper({ convention: ParameterConvention.CAMELCASE });
      const data = { initialType: 1, someValue: 555, mesageOne: 'first message' };
      const instance = mapper.map(data, CamelCaseConventionTest);

      assert.instanceOf(instance, CamelCaseConventionTest);
      assert.equal(instance.initialType, 1);
      assert.equal(instance.someValue, 555);
      assert.equal(instance.mesageOne, 'first message');
    });

    it('should map an object into a model following return model parameter convention (camel case) from pascal case', () => {
      const mapper = new AutoMapper({ convention: ParameterConvention.PASCALCASE });
      const data = { InitialType: 1, SomeValue: 555, MesageOne: 'first message' };
      const instance = mapper.map(data, CamelCaseConventionTest);

      assert.instanceOf(instance, CamelCaseConventionTest);
      assert.equal(instance.initialType, 1);
      assert.equal(instance.someValue, 555);
      assert.equal(instance.mesageOne, 'first message');
    });

    it('should map an object into a model following return model parameter convention from snake case', () => {
      const mapper = new AutoMapper({ convention: ParameterConvention.SNAKECASE });
      const data = { initial_type: 1, some_value: 555, mesage_one: 'first message' };
      const instance = mapper.map(data, PascalCaseConventionTest);

      assert.instanceOf(instance, PascalCaseConventionTest);
      assert.equal(instance.InitialType, 1);
      assert.equal(instance.SomeValue, 555);
      assert.equal(instance.MesageOne, 'first message');
    });

    it('should map an object into a model following return model parameter convention from param case', () => {
      const mapper = new AutoMapper({ convention: ParameterConvention.PARAMCASE });
      const data = { 'initial-type': 1, 'some-value': 555, 'mesage-one': 'first message' };
      const instance = mapper.map(data, PascalCaseConventionTest);

      assert.instanceOf(instance, PascalCaseConventionTest);
      assert.equal(instance.InitialType, 1);
      assert.equal(instance.SomeValue, 555);
      assert.equal(instance.MesageOne, 'first message');
    });

    it('should map an object into a model following return model parameter convention from camel case', () => {
      const mapper = new AutoMapper({ convention: ParameterConvention.CAMELCASE });
      const data = { initialType: 1, someValue: 555, mesageOne: 'first message' };
      const instance = mapper.map(data, PascalCaseConventionTest);

      assert.instanceOf(instance, PascalCaseConventionTest);
      assert.equal(instance.InitialType, 1);
      assert.equal(instance.SomeValue, 555);
      assert.equal(instance.MesageOne, 'first message');
    });

    it('should map an object into a model following return model parameter convention from pascal case', () => {
      const mapper = new AutoMapper({ convention: ParameterConvention.PASCALCASE });
      const data = { InitialType: 1, SomeValue: 555, MesageOne: 'first message' };
      const instance = mapper.map(data, PascalCaseConventionTest);

      assert.instanceOf(instance, PascalCaseConventionTest);
      assert.equal(instance.InitialType, 1);
      assert.equal(instance.SomeValue, 555);
      assert.equal(instance.MesageOne, 'first message');
    });

    it('should map an array of objects into an array of models regadless of source parameter convension', () => {
      const mapper = new AutoMapper({ convention: ParameterConvention.CAMELCASE, keyAutoMatch: true });
      const data = [
        { initial_type: 1, some_value: 555, mesage_one: 'first message' },
        { 'initial-type': 2, 'some-value': 666, 'mesage-one': 'second message' },
        { initialType: 3, someValue: 777, mesageOne: 'third message' },
        { InitialType: 4, SomeValue: 877, MesageOne: 'forth message' },
        { initial_type: 5, SomeValue: 887, 'mesage-one': 'fifth message' },
      ];

      const models = mapper.map(data, CamelCaseConventionTest);

      assert.isArray(models);

      for (const mdl of models) {
        assert.instanceOf(mdl, CamelCaseConventionTest);
        assert.isNumber(mdl.initialType);
        assert.isNumber(mdl.someValue);
        assert.isTrue(typeof mdl.mesageOne === 'string');
      }
    });

    it('should map an object into a model and recursively serialize properties if those properties are newable', () => {
      const mapper = new AutoMapper({ keyAutoMatch: true });
      const paramsData = [
        { initial_type: 1, some_value: 555, mesage_one: 'first message' },
        { 'initial-type': 2, 'some-value': 666, 'mesage-one': 'second message' },
        { initialType: 3, someValue: 777, mesageOne: 'third message' },
        { InitialType: 4, SomeValue: 877, MesageOne: 'forth message' },
        { initial_type: 5, SomeValue: 887, 'mesage-one': 'fifth message' },
      ];
      const paramData = { initial_type: 1, some_value: 555, mesage_one: 'first message' };
      const data = {
        id: 'my id',
        value: 5,
        param: paramData,
        params: paramsData,
        noSerialize: [
          new CamelCaseConventionTest(),
          new CamelCaseConventionTest(),
          new CamelCaseConventionTest(),
        ],
      };

      const model = mapper.map(data, RecursiveModel);

      assert.instanceOf(model, RecursiveModel);
      assert.equal(model.id, data.id);
      assert.equal(model.value, data.value);
      assert.instanceOf(model.param, CamelCaseConventionTest);
      assert.isNumber(model?.param?.initialType);
      assert.isNumber(model?.param?.someValue);
      assert.isString(model?.param?.mesageOne);
      assert.isArray(model.params);

      for (const mdl of model?.params) {
        assert.instanceOf(mdl, CamelCaseConventionTest);
        assert.isNumber(mdl.initialType);
        assert.isNumber(mdl.someValue);
        assert.isString(mdl.mesageOne);
      }

      for (const mdl of model.noSerialize) {
        assert.instanceOf(mdl, CamelCaseConventionTest);
        assert.isNull(mdl.initialType);
        assert.isNull(mdl.someValue);
        assert.isNull(mdl.mesageOne);
      }
    });

    it('should map an object a registered type', () => {
      const mapper = new AutoMapper({ keyAutoMatch: true });

      mapper.register(RecursiveModel);
      const paramsData = [
        { initial_type: 1, some_value: 555, mesage_one: 'first message' },
        { 'initial-type': 2, 'some-value': 666, 'mesage-one': 'second message' },
        { initialType: 3, someValue: 777, mesageOne: 'third message' },
        { InitialType: 4, SomeValue: 877, MesageOne: 'forth message' },
        { initial_type: 5, SomeValue: 887, 'mesage-one': 'fifth message' },
      ];
      const paramData = { initial_type: 1, some_value: 555, mesage_one: 'first message' };
      const data = {
        id: 'my id',
        value: 5,
        param: paramData,
        params: paramsData,
      };

      const model = mapper.map(data, RecursiveModel);

      assert.instanceOf(model, RecursiveModel);
      assert.equal(model.id, data.id);
      assert.equal(model.value, data.value);
      assert.instanceOf(model.param, CamelCaseConventionTest);
      assert.isNumber(model.param.initialType);
      assert.isNumber(model.param.someValue);
      assert.isString(model.param.mesageOne);
      assert.isArray(model.params);

      for (const mdl of model.params) {
        assert.instanceOf(mdl, CamelCaseConventionTest);
        assert.isNumber(mdl.initialType);
        assert.isNumber(mdl.someValue);
        assert.isString(mdl.mesageOne);
      }

      assert.isNull(model.noSerialize);
    });

    it('should map an object a registered type, and map a key with specific mapping instructions to another key', () => {
      const mapper = new AutoMapper({ keyAutoMatch: true });

      mapper.register(RecursiveModel);
      mapper.register(CamelCaseConventionTest).define('foo', 'mesageOne');
      const paramsData = [
        { initial_type: 1, some_value: 555, foo: 'first message' },
        { 'initial-type': 2, 'some-value': 666, foo: 'second message' },
        { initialType: 3, someValue: 777, foo: 'third message' },
        { InitialType: 4, SomeValue: 877, foo: 'forth message' },
        { initial_type: 5, SomeValue: 887, foo: 'fifth message' },
      ];
      const paramData = { initial_type: 1, some_value: 555, mesage_one: 'first message' };
      const data = {
        id: 'my id',
        value: 5,
        param: paramData,
        params: paramsData,
      };

      const model = mapper.map(data, RecursiveModel);

      assert.instanceOf(model, RecursiveModel);
      assert.equal(model.id, data.id);
      assert.equal(model.value, data.value);
      assert.instanceOf(model.param, CamelCaseConventionTest);
      assert.isNumber(model.param.initialType);
      assert.isNumber(model.param.someValue);
      assert.isString(model.param.mesageOne);
      assert.isArray(model.params);

      for (const mdl of model.params) {
        assert.instanceOf(mdl, CamelCaseConventionTest);
        assert.isNumber(mdl.initialType);
        assert.isNumber(mdl.someValue);
        assert.isString(mdl.mesageOne);
      }

      assert.isNull(model.noSerialize);
    });

    it('should throw and error if registered type mapped key doesn\'t exist on target', () => {
      const mapper = new AutoMapper();

      mapper.register(RegisterModel);

      assert.throws(function () {
        mapper.register(CamelCaseConventionTest).define('foo', 'doesn\'t exist');
      }, ReferenceError);
    });

    it('should map a class that contains inheritence', () => {
      const mapper = new AutoMapper();
      const data = { death: 44, id: '123902klas', age: 18 };
      const model = mapper.map(data, Son);

      assert.instanceOf(model, Son);
      assert.instanceOf(model, Parent);
      assert.instanceOf(model, GrandParent);

      assert.equal(model.id, data.id);
      assert.equal(model.death, data.death);
      assert.equal(model.age, data.age);
    });

    it('should map a primitive value to a newable class', () => {
      const mapper = new AutoMapper();
      mapper.register(TestObject).define("date", Date,);
      const data = {
        id: 777,
        value: 56,
        message: "message-one",
        date: '2023-03-08T16:33:04.844Z',
      };
      const model = mapper.map(data, TestObject);

      assert.instanceOf(model, TestObject);
      assert.instanceOf(model.date, Date);
      assert.typeOf(model.id, 'number');
      assert.typeOf(model.value, 'number');
      assert.typeOf(model.message, 'string');

      assert.equal(model.id, data.id);
      assert.equal(model.value, data.value);
      assert.equal(model.message, data.message);
      assert.equal(model.date?.toISOString(), data.date);
    });

    it('should convert incoming data type from object to array before mapping', () => {
      const mapper = new AutoMapper();

      mapper.register(RecursiveModel);
      mapper.register(ConvertedObj);
      mapper.register(CamelCaseConventionTest, { keyAutoMatch: true })
        .define('foo', 'mesageOne')
        .define('opts', ConvertedObj)
        .transform('opts', fromObjectToArray((key, value) => ({
          name: key,
          value,
        })));
      const paramsData = [
        { initial_type: 1, some_value: 555, foo: 'first message', opts: { a: 'value', b: "value2" } },
        { 'initial-type': 2, 'some-value': 666, foo: 'second message', opts: { a: 'value', b: "value2" } },
        { initialType: 3, someValue: 777, foo: 'third message', opts: { a: 'value', b: "value2" } },
        { initial_type: 1, some_value: 555, foo: 'first message', opts: { a: 'value', b: "value2" } },
        { InitialType: 4, SomeValue: 877, foo: 'forth message', opts: { a: 'value', b: "value2" } },
        { initial_type: 1, some_value: 555, foo: 'first message', opts: { a: 'value', b: "value2" } },
        { initial_type: 5, SomeValue: 887, foo: 'fifth message', opts: { a: 'value', b: "value2" } },
        { initial_type: 1, some_value: 555, foo: 'first message', opts: { a: 'value', b: "value2" } },
      ];
      const paramData = { initial_type: 1, some_value: 555, mesage_one: 'first message' };
      const data = {
        id: 'my id',
        value: 5,
        param: paramData,
        params: paramsData,
      };

      const model = mapper.map(data, RecursiveModel);

      assert.instanceOf(model, RecursiveModel);
      assert.equal(model.id, data.id);
      assert.equal(model.value, data.value);
      assert.instanceOf(model.param, CamelCaseConventionTest);
      assert.isNumber(model.param.initialType);
      assert.isNumber(model.param.someValue);
      assert.isString(model.param.mesageOne);
      assert.isArray(model.params);
      assert.lengthOf(model.params, 8)

      for (const mdl of model.params) {
        assert.instanceOf(mdl, CamelCaseConventionTest);
        assert.isNumber(mdl.initialType);
        assert.isNumber(mdl.someValue);
        assert.isString(mdl.mesageOne);
        assert.lengthOf(mdl.opts, 2);

        for (const opt of mdl.opts) {
          assert.instanceOf(opt, ConvertedObj);
          assert.isString(opt.name);
          assert.isString(opt.value);
        }
      }

      assert.isNull(model.noSerialize);
    });
  });
});
