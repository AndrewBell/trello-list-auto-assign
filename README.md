# Trello List Auto Assigner

Assigns Trello card to a user when they move it to a particular list.

HookConfig - Local npm module to configure a Trello webhook for the subscribed list

CallbackListener - [Google Cloud Function](https://cloud.google.com/functions/) callback to add users to the card they add to lists, and remove them from the card when they remove it.

## Requirements

[Node](https://nodejs.org/en/download/) - Tested on v8.11.3

[npm](https://www.npmjs.com/package/npm) - (Bundled with Node) Tested on v6.1.0

[Bash](https://www.gnu.org/software/bash/)
  * [Windows via Git for Windows](http://gitforwindows.org/)  
  * OSX - Users should already have Bash via the Terminal app
  * Linux - Many distrubutions include Bash, if not, you likely know what you're doing anyway

### Optional 

[git](https://git-scm.com/downloads) - Alternatively, download a zip of this GitHub repo.

## Trello Configuration

Get an [API Key and Token](https://trello.com/app-key)

## Deploying This Project

### Deploy Cloud Functions

Push the Trello Callback Listener to GCP:

`gcloud beta functions deploy handleTrelloHook --source ./CallbackListener --runtime nodejs8 --trigger-http --set-env-vars TRELLO_API_KEY=$TRELLO_API_KEY,TRELLO_API_TOKEN=$TRELLO_API_TOKEN`

Once deployed, get the deployed URL:

`gcloud functions describe handleTrelloHook`

Updating can be reduced (although the above is idempodent)

`gcloud functions deploy handleTrelloHook --source ./CallbackListener --runtime nodejs8  `

### Configure Trello

Run the webhook configure script:

`cd HookConfig`

`npm install`

`npm start -- --key mykey --token mytoken --board myBoardName --list myListName --callback https://myCallbackUrl/handleTrelloHook`

Alternatively, you can set your Trello API Key and Token as environment variables instead of passing them via flag

```bash
export TRELLO_API_KEY='myapikey'
export TRELLO_API_TOKEN='myapitoken'
```

## Clean Up

To delete your Trello webhooks:

[Search All Webhooks](https://developers.trello.com/v1.0/reference#tokenstokenwebhooks)

`curl https://api.trello.com/1/tokens/$TRELLO_API_TOKEN/webhooks?key=$TRELLO_API_KEY`

[Delete By Id](https://developers.trello.com/v1.0/reference#webhooksid-1)

`curl -X "DELETE" https://api.trello.com/1/webhooks/<webhookId>?key=$TRELLO_API_KEY`

Delete your GCP Function

`gcloud functions delete handleTrelloHook`

## Resources

[Trello API Docs](https://developers.trello.com/v1.0/reference)

## TODO

* Pass secrets via KMS https://cloud.google.com/kms/docs/secret-management
* Update HookConfig to use npm `trello` module
* Interactive HookConfig
* Validate webhook signature: https://developers.trello.com/page/webhooks#section-webhook-signatures

## Contributing

If you would like to make an update to this project, fork and open a pull request. If you have any questions, please feel free to reach out (contact info below)

## Contact Me

### Andrew "Doc" Bell ###

homepage: www.recursivechaos.com

email: andrew@recursivechaos.com

twitter: @recursive_chaos
