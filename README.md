# trekin-sample
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin-sample.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin-sample?ref=badge_shield)

WIP!

## Setup
### Install kintone apps
WIP

### Generate kintone API tokens
WIP

### Deploy
Authenticate to AWS first.

```shell script
npx serverless deploy
```

### Register webhook of Trello

```
curl -X GET --url "https://api.trello.com/1/members/me/boards/?token=$TRELLO_API_TOKEN&key=$TRELLO_API_KEY" | jq
```
`.id`: $TRELLO_BOARD_ID_MODEL

```
curl -X POST -H "Content-Type: application/json" \
https://api.trello.com/1/tokens/$TRELLO_API_TOKEN/webhooks/ -d @- << EOS
{
  "key": "$TRELLO_API_KEY",
  "callbackURL": "$AWS_API_GATEWAY_ENDPOINT",
  "idModel":"$TRELLO_BOARD_ID_MODEL",
  "description": "Trekin"
}
EOS
```

`.id`: $WEBHOOK_ID

```
curl --request DELETE --url "https://api.trello.com/1/webhooks/$WEBHOOK_ID?key=$TRELLO_API_KEY&token=$TRELLO_API_TOKEN"
```


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin-sample.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin-sample?ref=badge_large)