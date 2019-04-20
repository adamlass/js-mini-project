const {login} = require("../../facade/loginFacade")
const router = require("express").Router()
const { Expo } = require("expo-server-sdk")

router.post("/", async function (req, res, next) {
    try {
        console.log(req.body)
        const { userName, password, latitude, longitude, distance, pushToken } = req.body
        const friends = await login(userName, password, longitude, latitude, distance, pushToken)
        console.log("friends:", friends)
        let msg = {
            userName,
            latitude,
            longitude,
            pushToken
        }
        notifyUsers(friends, msg, "user-login")
        res.send({friends: friends})
    } catch (err) {
        console.log("error:",err)
        res.send(403, JSON.stringify(err))
    }
})

async function notifyUsers(users, msg, type) {
    let expo = new Expo();
    let messages = [];
    for (let user of users) {
      if (!Expo.isExpoPushToken(user.pushToken)) {
        console.error(`Push token ${user.pushToken} is not a valid Expo push token`);
        continue;
      }
      msg.msgType = type;
      messages.push({
        to: user.pushToken,
        sound: 'default',
        body: type == "text" ? msg : `User ${msg.userName} logged in nearby you!`,
        data: msg,
      })
      console.log(user)
    }
    // console.log("messages", messages)
    let chunks = expo.chunkPushNotifications(messages);
    console.log("Chunks", chunks.length)
    let tickets = [];
  
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk); //Not used in this example
      } catch (error) {
        console.error(error);
      }
    };
  }

module.exports = router