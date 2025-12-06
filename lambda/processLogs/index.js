export const handler = async (event) => {
  for (const record of event.Records) {
    console.log("Log recebido:", record.body);
  }

  return { statusCode: 200 };
};
