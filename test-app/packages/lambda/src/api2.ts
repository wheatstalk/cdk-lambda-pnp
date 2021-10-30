import type * as lambda from 'aws-lambda';

export async function handler(): Promise<lambda.APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify('hello world'),
  };
}

if (require.main === module) {
  handler()
    .then(res => {
      console.log(JSON.stringify(res));
    })
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
}