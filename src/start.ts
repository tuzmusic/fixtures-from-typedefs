import * as fs from 'fs';
import path from 'path';
import * as tsQuery from '@phenomnomnominal/tsquery';

console.log('App running');

const defaultValues = {
  boolean: false,
  number: 42,
  string: 'abcdefg',
};

export function parse(filePath: string) {
  const { ...q } = tsQuery;
  const text = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');

  const ast = tsQuery.ast(text);

  const [schemaTree] = tsQuery.query(ast, 'PropertySignature:has(Identifier[name="schemas"]) > TypeLiteral');

  if (!schemaTree) {
    throw "Couldn't find node called 'schemas'";
  }

  // @ts-ignore (there is definitely a property called members. Debugger gets the type right but TS gets it wrong???
  const all16Schemas = schemaTree.members;
  const allFixtures: Record<string, any> = {};
  all16Schemas.forEach(type => {
    console.log(type);
    const typeName = type.name.escapedText;
    const fixture: Record<string, (typeof defaultValues)[keyof typeof defaultValues]> = {};

    const properties = type.type.members;
    if (!properties) {
      console.log(`Hm, no properties for ${typeName}`);
      return;
    }
    properties.forEach(property => {
      console.log(property);
      const propName = property.name.escapedText;
      const propType: keyof typeof defaultValues = property.type.getText().split(' | ')[0];

      if (defaultValues[propType]) {
        fixture[propName] = defaultValues[propType];
      } else {
        fixture[propName] = `TBD (no default value for "${propType}")`;
      }
    });

    allFixtures[typeName] = fixture;
  });

  console.log(allFixtures);
}

parse('../fixtures/index.d.ts');
