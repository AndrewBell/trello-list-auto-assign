# Trello Webhook Platform

Manage Trello webhooks and find examples 

## Goals

* Easily create and update webhooks
* Create a callback function to automatically assign cards to users based on list

## Requirements

[Node](https://nodejs.org/en/download/) - Tested on v8.11.3

[npm](https://www.npmjs.com/package/npm) - (Bundled with Node) Tested on v6.1.0

[Bash](https://www.gnu.org/software/bash/)

    * [Windows via Git for Windows](http://gitforwindows.org/)
    
    * OSX & (Most) Linux users should already have Bash

### Optional 

[git](https://git-scm.com/downloads) - Alternatively, download a zip of this GitHub repo.

## Trello Configuration

Get an [API Key and Token](https://trello.com/app-key)

## Deploying This Project

### Deploy Cloud Functions

Push the Trello Callback Listener to GCP:

`gcloud functions deploy handleTrelloCallback --source ./CallbackListener --runtime nodejs8 --trigger-http`

Once deployed, get the deployed URL:

`gcloud functions describe handleTrelloCallback`

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

## Resources

[Trello API Docs](https://developers.trello.com/v1.0/reference)

## Contributing

If you would like to make an update to this project, fork and open a pull request. If you have any questions, please feel free to reach out (contact info below)

## Contact Me

### Andrew "Doc" Bell ###

homepage: www.recursivechaos.com

email: andrew@recursivechaos.com

twitter: @recursive_chaos
