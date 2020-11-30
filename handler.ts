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

  const trekin = new Trekin(
    {
      baseUrl: process.env.KINTONE_API_BASE_URL,
      defaultKintoneUserCode: process.env.DEFAULT_KINTONE_USER_ID,
      cards: {
        id: process.env.KINTONE_APP_ID_CARDS,
        token: process.env.KINTONE_API_TOKEN_CARDS,
      },
      labels: {
        id: process.env.KINTONE_APP_ID_LABELS,
        token: process.env.KINTONE_API_TOKEN_LABELS,
      },
      lists: {
        id: process.env.KINTONE_APP_ID_LISTS,
        token: process.env.KINTONE_API_TOKEN_LISTS,
      },
      members: {
        id: process.env.KINTONE_APP_ID_MEMBERS,
        token: process.env.KINTONE_API_TOKEN_MEMBERS,
      },
    },
    {
      apiKey: process.env.TRELLO_API_KEY,
      apiToken: process.env.TRELLO_API_TOKEN,
    }
  );
  trekin.guardian.setting = {
    prefixRecordId: "EPTRE",
    excludes: [
      {
        charactersOrLess: 12,
      },
    ],
    isAddDoneTime: true,
    doneListName: "Done🎉",
  };

  const result = await trekin.operation(action);
  console.info("Operation\n" + JSON.stringify(result));
  const postResult = await trekin.postOperation(action);
  console.info("Post operation\n" + JSON.stringify(postResult));

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
