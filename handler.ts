import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import { Trekin } from "trekin";

const isObject = (x: unknown): x is any =>
  x !== null && (typeof x === "object" || typeof x === "function");

export const webhook: APIGatewayProxyHandler = async (event, _context) => {
  const response: APIGatewayProxyResult = {
    statusCode: 500,
    body: "",
  };

  if (event.httpMethod === "HEAD") {
    // TrelloにWebhookを登録すると、TrelloがまずHEADで疎通確認を行うため
    response.statusCode = 200;
    return response;
  }

  if (event.body === undefined) {
    // 不正なリクエストならエラーを返す
    console.error("ERROR\n" + event);
    return response;
  }

  console.info("EVENT\n" + event.body);
  const action = isObject(event.body)
    ? (event.body as any).action
    : JSON.parse(event.body).action;

  const trekin = new Trekin({
    baseUrl: "",
    cards: { id: "", token: "" },
    defaultKintoneUserCode: "",
    labels: { id: "", token: "" },
    lists: { id: "", token: "" },
    members: { id: "", token: "" },
  });
  const result = await trekin.operationKintone(action);
  console.info(result);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "OK",
      },
      null,
      2
    ),
  };
};
