import * as fs from 'fs';
import path from 'path';
import {ast as astParser, match, query} from '@phenomnomnominal/tsquery';

console.log('App running');

export function parse(filePath: string) {
  const text = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');

  const ast = astParser(text);
  const $ = (selector: string, tree = ast) => query(tree, selector);

  const [schemas] = query(ast, 'PropertySignature:has(Identifier[name="schemas"])');
  // const allSchemas = query(schemas!, 'PropertySignature');
  const allSchemas = query(
    ast,
    'PropertySignature:has(Identifier[name="schemas"])' + ' > TypeLiteral > PropertySignature'
  );

  // 12 types that aren't enums?
  const typeLiterals = query(schemas!, 'TypeLiteral'); // length = 12

  const first = typeLiterals[0]!;
  // typeLiterals[0].members.length = 16
  //                .members[0].name = BillingInformation
  //                .members[1].name = Customer
  //
  // typeLiterals[0].children[1].children[0].name = BillingInformation

  // typeLiterals[1].members[0].name = addressLineOne ( = BillingInformation.addressLineOne

  console.log(schemas);
}

parse('../fixtures/index.d.ts');
