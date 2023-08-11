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

function parseProperty(property, fixture: Record<string, number | boolean | string>) {
  const propName = property.name.escapedText;
  const propType: SupportedPrimitiveName = property.type.getText().split(' | ')[0];

  // bare type (string, number, boolean)
  if (defaultValues[propType] !== undefined) {
    fixture[propName] = defaultValues[propType];
    return;
  }

  // some other type
  if (propType.startsWith("components['schemas']")) {
    fixture[propName] = `TBD type for ${propName} schema`;
    return;
  }

  // string in quotes -- inline enumeration (use the first option)
  const firstOfOptions = propType.match(/'(\w+)'/)?.[1];
  if (firstOfOptions) {
    fixture[propName] = firstOfOptions;
    return;
  }

  const errStr = `Error: no default value for ${propType}`;
  fixture[propName] = errStr;
  console.error(errStr);
}

export function parse(filePath: string) {
  const text = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
  const ast = tsQuery.ast(text);
  const [schemaTree] = tsQuery.query(ast, 'PropertySignature:has(Identifier[name="schemas"]) > TypeLiteral');
  if (!schemaTree) {
    throw "Couldn't find node called 'schemas'";
  }

  const allFixtures: Record<string, any> = {};
  const complex = [] as string[];
  const problems = [] as string[];

  // @ts-ignore (there is definitely a property called members.
  // Debugger gets the type right but TS gets it wrong???
  schemaTree.members.forEach(type => {
    const typeName: string = type.name.escapedText;

    // enumerations are only to help with building other types, not for fixtures
    if (typeName.endsWith('Enumeration')) {
      return;
    }

    const fixture: Record<string, SupportedPrimitive> = {};

    const properties = type.type.members;
    if (!properties) {
      if (type.type.types) {
        console.log(`${typeName} appears to be a more complex type`);
        complex.push(typeName);
      } else {
        console.log(`Hm, no properties for ${typeName}`);
        problems.push(typeName);
      }
      return;
    }
    properties.forEach(property => parseProperty(property, fixture));

    allFixtures[typeName] = fixture;
  });

  console.log(allFixtures);
  return allFixtures;
}

parse('../fixtures/index.d.ts');
