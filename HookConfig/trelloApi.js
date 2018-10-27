const request = require("request-promise-native");

exports.getBoardId = (payload) => new Promise((resolve, reject) => {

  const options = {
    method: 'GET',
    url: 'https://api.trello.com/1/search',
    qs:
      {
        query: payload.boardName,
        idBoards: 'mine',
        modelTypes: 'boards',
        board_fields: 'name',
        partial: 'false',
        key: payload.apiKey,
        token: payload.apiToken
      }
  };

  return request(options)
    .then((response) => {
      const results = JSON.parse(response);
      const boardId = results.boards[0].id;

      console.log(`Found board named: '${payload.boardName}' as ID: '${boardId}'`);
      resolve({...payload, boardId});
    })
    .catch((err) => {
      console.log(`Failed to create getBoardId`, err);
      reject(err);
    })
});

exports.getListId = (payload) => new Promise((resolve, reject) => {

  const options = {
    method: 'GET',
    url: `https://api.trello.com/1/boards/${payload.boardId}/lists`,
    qs:
      {
        query: payload.boardName,
        idBoards: 'mine',
        modelTypes: 'boards',
        board_fields: 'name',
        partial: 'false',
        key: payload.apiKey,
        token: payload.apiToken
      }
  };

  return request(options)
    .then((response) => {
      const results = JSON.parse(response);
      const listId = results.find(list => list.name === payload.listName).id;
      console.log(`Found list named: '${payload.listName}' as ID: '${listId}'`);
      resolve({...payload, listId});
    })
    .catch((err) => {
      console.log(`Failed to create getListId`, err);
      reject(err);
    })
});

exports.findExistingWebhook = (payload) => new Promise((resolve, reject) => {

  const options = {
    method: 'GET',
    url: `https://api.trello.com/1/tokens/${payload.apiToken}/webhooks`,
    qs:
      {
        key: payload.apiKey
      }
  };

  return request(options)
    .then((response) => {
      const results = JSON.parse(response);
      let didFindExisting = false;
      if (Array.isArray(results) && results.length > 0) {
        console.log(`Found ${results.length} total webhooks for API Token.`);
        for (const result of results) {
          if (result.idModel === payload.listId && result.callbackURL === payload.callbackUrl) {
            didFindExisting = true;
            console.log(`Found existing webhook ID: '${result.id}'`);
            resolve({...payload, webhookId: result.id})
          }
        }
      }
      if (!didFindExisting) {
        console.log(`Did not find an existing webhook`);
        resolve(payload);
      }
    })
    .catch((err) => {
      console.log(`Failed to setupWebhook`, err);
      reject(err);
    })
});

exports.createWebhook = (payload) => new Promise((resolve, reject) => {

  const options = {
    method: 'POST',
    url: `https://api.trello.com/1/webhooks`,
    qs:
      {
        description: `events for list ${payload.listId} on board ${payload.boardId}`,
        callbackURL: payload.callbackUrl,
        idModel: payload.listId,
        active: true,
        key: payload.apiKey,
        token: payload.apiToken
      }
  };

  return request(options)
    .then((response) => {
      const results = JSON.parse(response);
      const webhookId = results.id;
      console.log(`Created webhook ID: '${webhookId}'`);
      resolve({...payload, webhookId});
    })
    .catch((err) => {
      console.log(`Failed to createWebhook`, err);
      reject(err);
    })
});

exports.updateWebhook = (payload) => new Promise((resolve, reject) => {

  const options = {
    method: 'PUT',
    url: `https://api.trello.com/1/webhooks/${payload.webhookId}`,
    qs:
      {
        description: `events for list ${payload.listId} on board ${payload.boardId}`,
        callbackURL: payload.callbackUrl,
        idModel: payload.listId,
        active: true,
        key: payload.apiKey,
        token: payload.apiToken
      }
  };

  return request(options)
    .then((response) => {
      const results = JSON.parse(response);
      const webhookId = results.id;
      console.log(`Updated webhook ID: '${webhookId}'`);
      resolve(payload);
    })
    .catch((err) => {
      console.log(`Failed to updateWebhook`, err);
      reject(err);
    })
});
