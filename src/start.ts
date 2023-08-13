import * as fs from 'fs';
import path from 'path';
import * as tsQuery from '@phenomnomnominal/tsquery';

console.log('App running');

export const defaultValues = {
  boolean: false,
  number: 42,
  string: 'abcdefg',
};

type SupportedPrimitiveName = keyof typeof defaultValues;
type SupportedPrimitive = (typeof defaultValues)[SupportedPrimitiveName];

function parseProperty(property) {
  const propName = property.name.escapedText;
  const propType: SupportedPrimitiveName = property.type.getText().split(' | ')[0];

  // bare type (string, number, boolean)
  if (defaultValues[propType] !== undefined) {
    return {[propName]: defaultValues[propType]};
  }

  // some other type
  if (propType.startsWith("components['schemas']")) {
    return {[propName]: `TBD type for ${propName} schema`};
  }

  // string in quotes -- inline enumeration (use the first option)
  const firstOfOptions = propType.match(/'(\w+)'/)?.[1];
  if (firstOfOptions) {
    return {[propName]: firstOfOptions};
  }

  const errStr = `Error: no default value for ${propType}`;
  console.error(errStr);
  return {[propName]: errStr};
}

const complex = [] as string[];
const problems = [] as string[];

function parseType(type): Record<string, string | Record<string, SupportedPrimitive>> {
  const typeName: string = type.name.escapedText;

  // enumerations are only to help with building other types, not for fixtures
  if (typeName.endsWith('Enumeration')) {
    return {};
  }

  const properties = type.type.members;

  if (!properties) {
    if (type.type.types) {
      complex.push(typeName);
      return {[typeName]: `${typeName} appears to be a more complex type`};
    }
    problems.push(typeName);
    return {[typeName]: `Hm, no properties for ${typeName}`};
  }

  const fixture = properties.reduce(
    (obj, property) => ({
      ...obj,
      ...parseProperty(property),
    }),
    {}
  );

  return {[typeName]: fixture};
}

export function parseFile(filePath: string) {
  const text = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
  const ast = tsQuery.ast(text);
  const [schemaTree] = tsQuery.query(ast, 'PropertySignature:has(Identifier[name="schemas"]) > TypeLiteral');
  if (!schemaTree) {
    throw "Couldn't find node called 'schemas'";
  }

  // @ts-ignore (there is definitely a property called members.
  // Debugger gets the type right but TS gets it wrong???)
  const allFixtures: Record<string, any> = schemaTree.members.reduce(
    (obj, type) => ({
      ...obj,
      ...parseType(type),
    }),
    {}
  );

  console.log(allFixtures);
  return allFixtures;
}

parseFile('../fixtures/index.d.ts');
