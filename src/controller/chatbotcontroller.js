require("dotenv").config();
import request from "request";
var truyvan;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_VERIFY_TOKEN = process.env.PAGE_VERIFY_TOKEN;

let getHomePage = (req, res) => {
  return res.send("KẾT QUẢ :"+truyvan);
  
};
let postWebhook = (req, res) =>{
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

          // Gets the body of the webhook event
          let webhook_event = entry.messaging[0];
          console.log(webhook_event);


          // Get the sender PSID
          let sender_psid = webhook_event.sender.id;
          console.log('Sender PSID: ' + sender_psid);

          // Check if the event is a message or postback and
          // pass the event to the appropriate handler function
          if (webhook_event.message) {
              handleMessage(sender_psid, webhook_event.message);
          } else if (webhook_event.postback) {
              handlePostback(sender_psid, webhook_event.postback);
          }

      });

      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');

  } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
  }
};

function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
      response = { "text": "Thanks!" }
  } else if (payload === 'no') {
      response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);

}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
         "recipient": {"id": sender_psid},
        "messaging_type": "RESPONSE",
        "message": {"text": "ahihi"}
  };

  // Send the HTTP request to the Messenger Platform
  request({
     "uri": "https://graph.facebook.com/v16.0/116259271419513/messages",
      "qs": { "access_token": PAGE_VERIFY_TOKEN },
      "method": "POST",
      "json": request_body
        
      
  }, (err, res, body) => {
      if (!err) {
          console.log('----------------------message sent!');
      } else {
          console.error("Unable to send message:" + err);
      }
  });
}
 

function handleMessage(sender_psid, received_message) {
  let response;
  if (received_message.text) {
    console.log("-----------------------------")
    console.log(received_message.text)
    console.log(truyvan +"|"+received_message.text)
   
    console.log("-----------------------------")
    response = {
      "text": `chào bạn tin nhắn ---------:"${received_message.text}".không hợp lệ`
    }
  }
  callSendAPI(sender_psid, response);
}
let getWebhook = (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};
module.exports = {
  getHomePage: getHomePage,
  getWebhook: getWebhook,
  postWebhook: postWebhook,
};
