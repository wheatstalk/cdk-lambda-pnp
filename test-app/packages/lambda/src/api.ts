import type * as lambda from 'aws-lambda';
import { muglify } from 'lib';

export async function handler(): Promise<lambda.APIGatewayProxyResult> {
  try {
    const value = muglify('function foobeard() { /* REMOVED */ }');
    return {
      statusCode: 200,
      body: JSON.stringify(value),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
}