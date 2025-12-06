const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const db = new DynamoDBClient({ region: "sa-east-1" });

async function get(option) {
  const res = await db.send(new GetItemCommand({
    TableName: "votingapp-Votes",
    Key: { option: { S: option }}
  }));
  return res.Item && res.Item.votes ? Number(res.Item.votes.N) : 0;
}

exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      A: await get("A"),
      B: await get("B")
    })
  };
};
