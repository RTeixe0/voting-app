const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const db = new DynamoDBClient({ region: "sa-east-1" });
const sqs = new SQSClient({ region: "sa-east-1" });

exports.handler = async (event) => {
  let body;

  // API Gateway HTTP API envia body como BASE64 se for binário ou se não definir content-type corretamente
  try {
    if (event.isBase64Encoded) {
      const decoded = Buffer.from(event.body, "base64").toString();
      body = JSON.parse(decoded);
    } else {
      body = JSON.parse(event.body);
    }
  } catch (err) {
    console.error("Erro ao fazer parse do JSON:", err, event.body);
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const option = body.option;
  if (!["A", "B"].includes(option)) {
    return { statusCode: 400, body: "Option must be A or B" };
  }

  // incrementa voto
  await db.send(new UpdateItemCommand({
    TableName: "votingapp-Votes",
    Key: { option: { S: option } },
    UpdateExpression: "ADD votes :inc",
    ExpressionAttributeValues: { ":inc": { N: "1" } }
  }));

  // envia log
  await sqs.send(new SendMessageCommand({
    QueueUrl: process.env.LOG_QUEUE_URL,
    MessageBody: JSON.stringify({ option, timestamp: Date.now() })
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
