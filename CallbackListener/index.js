/**
 * Created by Andrew Bell 10/26/18
 * www.recursivechaos.com
 * andrew@recursivechaos.com
 * Licensed under MIT License 2018. See LICENSE.txt for details.
 *
 * Assigns card to user when moved to a subscribed list.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */

let trello;
if (process.env.TRELLO_API_KEY && process.env.TRELLO_API_TOKEN) {
  const Trello = require("trello");
  trello = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_API_TOKEN);
} else {
  res.status(500).send({error: 'Oops.'});
}

exports.handleTrelloHook = (req, res) => {

  // Check if we have a valid action body
  if (req.body && req.body.action && req.body.action.display.translationKey && req.body.action.idMemberCreator && req.body.action.data.card && req.body.model.id) {
    console.log(`Processing '${req.method}' request with body '${JSON.stringify(req.body, null, 2)}'`);
    const action = req.body.action;
    const model = req.body.model;

    // Update by type of action
    switch (action.display.translationKey) {
      case "action_move_card_from_list_to_list":
        // Add to user to card when added to list, otherwise remove
        if (model.id === action.data.card.idList) {
          trello
            .addMemberToCard(action.data.card.id, action.idMemberCreator)
            .catch((res) => {
              console.log(`Failed add user: '${action.idMemberCreator}' to card: '${action.data.card.id}' and res: ${JSON.stringify(res, null, 2)}`);
            });
        } else {
          trello
            .makeRequest('delete', `/1/cards/${action.data.card.id}/idMembers/${action.idMemberCreator}`)
            .catch((res) => {
              console.log(`Failed delete user: '${action.idMemberCreator}' from card: '${action.data.card.id}' and res: ${JSON.stringify(res, null, 2)}`);
            });
        }
        break;
      case "action_copy_card":
        trello
          .addMemberToCard(action.data.card.id, action.idMemberCreator)
          .catch((res) => {
            console.log(`Failed add user: '${action.idMemberCreator}' to card: '${action.data.card.id}' and res: ${JSON.stringify(res, null, 2)}`);
          });
        break;
      case "action_create_card":
        trello
          .makeRequest('delete', `/1/cards/${action.data.card.id}/idMembers/${action.idMemberCreator}`)
          .catch((res) => {
            console.log(`Failed delete member: '${action.idMemberCreator}' from card: '${action.data.card.id}' and res: ${JSON.stringify(res, null, 2)}`);
          });
        break;
      default:
        console.log(`Didn't care about action: '${action.display.translationKey}' and card: card: ${JSON.stringify(action.data.card, null, 2)}`);
    }
    res.sendStatus(200);
  } else {
    res.status(400).send({error: 'Not a valid request.'});
  }
};