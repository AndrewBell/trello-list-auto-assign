const {findExistingWebhook, getBoardId, getListId, updateWebhook, createWebhook} = require("./trelloApi");
const argv = require('minimist')(process.argv.slice(2));

const getPayload = (argv) => {
  let payload = {};

  payload.apiKey = argv.key || process.env.TRELLO_API_KEY;
  if (!payload.apiKey)
    throw new Error("No API Key configured. Pass --key or set an env `TRELLO_API_KEY`");

  payload.apiToken = argv.token || process.env.TRELLO_API_TOKEN;
  if (!payload.apiToken)
    throw new Error("No API Token configured. Pass --token or set an env `TRELLO_API_TOKEN`");

  payload.boardName = argv.board;
  if (!payload.boardName)
    throw new Error("No board name configured. Pass --board`");

  payload.listName = argv.list;
  if (!payload.listName)
    throw new Error("No list name configured. Pass --list`");

  payload.callbackUrl = argv.callback;
  if (!payload.callbackUrl)
    throw new Error("No board name configured. Pass --board`");

  return payload;
};

const setupWebhook = (payload) => {
  if (payload.webhookId) {
    return updateWebhook(payload)
  } else {
    return createWebhook(payload)
  }
};

getBoardId(getPayload(argv))
  .then(payload => getListId(payload))
  .then(payload => findExistingWebhook(payload))
  .then(payload => setupWebhook(payload))
  .then(({webhookId}) => console.log(`Webhook successfully configured: '${webhookId}'`))
  .catch(err => console.error(`Could not query and configure webhooks`, err));
