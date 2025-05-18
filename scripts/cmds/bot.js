const axios = require("axios");

const getAPIBase = async () => {
  const { data } = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return data.bs;
};

const sendMessage = (api, threadID, message, messageID) =>
  api.sendMessage(message, threadID, messageID);

const cError = (api, threadID, messageID) =>
  sendMessage(api, threadID, "error🦆💨", messageID);

const teachBot = async (api, threadID, messageID, senderID, teachText) => {
  const [ask, answers] = teachText.split(" - ").map(text => text.trim());
  if (!ask || !answers) {
    return sendMessage(api, threadID, "Invalid format. Use: {pn} teach <ask> - <answer1, answer2, ...>", messageID);
  }
  
  const answerArray = answers.split(",").map(ans => ans.trim()).filter(ans => ans !== "");
  
  try {
    const apiBase = await getAPIBase();
    if (!apiBase) return cError(api, threadID, messageID);
    
    const res = await axios.get(
      `${apiBase}/bby/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(answerArray.join(","))}&uid=${senderID}`
    );
    
    const responseMsg = res.data?.message === "Teaching recorded successfully!" ?
      `Successfully taught the bot!\n📖 Teaching Details:\n- Question: ${res.data.ask}\n- Answers: ${answerArray.join(", ")}\n- Your Total Teachings: ${res.data.userStats.user.totalTeachings}` :
      res.data?.message || "Teaching failed.";
    
    return sendMessage(api, threadID, responseMsg, messageID);
  } catch {
    return cError(api, threadID, messageID);
  }
};

const talkWithBot = async (api, threadID, messageID, senderID, input) => {
  try {
    const apiBase = await getAPIBase();
    if (!apiBase) return cError(api, threadID, messageID);
    
    const res = await axios.get(
      `${apiBase}/bby?text=${encodeURIComponent(input)}&uid=${senderID}&font=1`
    );
    
    const reply = res.data?.text || "Please teach me this sentence!🦆💨";
    const react = res.data.react || "";
   
    return api.sendMessage(reply+react, threadID, (error, info) => {
      if (error) return cError(api, threadID, messageID);
      if (!global.GoatBot.onReply) global.GoatBot.onReply = new Map();
      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        type: "reply",
        author: senderID,
        msg: reply,
      });
    }, messageID);
  } catch {
    return cError(api, threadID, messageID);
  }
};

const botMsgInfo = async (api, threadID, messageID, senderID, input) => {
  try {
    const apiBase = await getAPIBase();
    if (!apiBase) return cError(api, threadID, messageID);
    
    const res = await axios.get(
      `${apiBase}/bby/msg?ask=${encodeURIComponent(input)}&uid=${senderID}`
    );
    
    if (!res.data || res.data.status !== "Success" || !Array.isArray(res.data.messages) || res.data.messages.length === 0) {
      return sendMessage(api, threadID, "No matching messages found!🦆💨", messageID);
    }
    
    const askText = `📜 Ask: ${res.data.ask}\n\n`;
    const answers = res.data.messages.map(msg => `🎀 [${msg.index}] ${msg.ans}`).join("\n");
    
    return sendMessage(api, threadID, `${askText}${answers}`, messageID);
  } catch {
    return cError(api, threadID, messageID);
  }
};

const deleteMessage = async (api, threadID, messageID, senderID, input) => {
  try {
    const parts = input.split(" - ").map(part => part.trim());
    
    if (!parts[0]) {
      return sendMessage(api, threadID, "Invalid format. Use: {pn} delete <text> OR {pn} delete <text> - <index>", messageID);
    }
    
    const text = parts[0];
    const index = parts[1] && !isNaN(parts[1]) ? parseInt(parts[1], 10) : null;
    
    const apiBase = await getAPIBase();
    if (!apiBase) return cError(api, threadID, messageID);
    
    let url = `${apiBase}/bby/delete?text=${encodeURIComponent(text)}&uid=${senderID}`;
    if (index !== null) url += `&index=${index}`;
    
    const res = await axios.get(url);
    
    return sendMessage(api, threadID, res.data?.status === "Success" ?
      `✅ Successfully deleted ${index !== null ? `answer at index ${index} of` : "all answers related to"}: ${text}` :
      res.data?.message || "❌ Failed to delete the message!", messageID);
  } catch {
    return cError(api, threadID, messageID);
  }
};

const editMessage = async (api, threadID, messageID, senderID, input) => {
  try {
    const parts = input.split(" - ").map(part => part.trim());
    
    if (parts.length < 2) {
      return sendMessage(api, threadID, "Invalid format. Use:\n1. {pn} edit <ask> - <newAsk>\n2. {pn} edit <ask> - <index> - <newAnswer>", messageID);
    }
    
    const [ask, newAskOrIndex, newAns] = parts;
    const apiBase = await getAPIBase();
    if (!apiBase) return cError(api, threadID, messageID);
    
    if (!isNaN(newAskOrIndex) && newAns) {
      const index = parseInt(newAskOrIndex, 10);
      
      const res = await axios.get(
        `${apiBase}/bby/edit?ask=${encodeURIComponent(ask)}&index=${index}&newAns=${encodeURIComponent(newAns)}&uid=${senderID}`
      );
      
      return sendMessage(api, threadID, res.data?.status === "Success" ?
        `✅ Successfully updated answer at index ${index} to: ${newAns}` :
        res.data?.message || "❌ Failed to update the answer!", messageID);
    } else {
      const res = await axios.get(
        `${apiBase}/bby/edit?ask=${encodeURIComponent(ask)}&newAsk=${encodeURIComponent(newAskOrIndex)}&uid=${senderID}`
      );
      
      return sendMessage(api, threadID, res.data?.status === "Success" ?
        `✅ Successfully updated question to: ${newAskOrIndex}` :
        res.data?.message || "❌ Failed to update the question!", messageID);
    }
  } catch {
    return cError(api, threadID, messageID);
  }
};

module.exports.config = {
  name: "bot",
  aliases: ["robot", "sim"],
  version: "1.6.9",
  author: "Nazrul",
  role: 0,
  description: "Talk with the bot or teach it new responses",
  category: "talk",
  countDown: 3,
  guide: {
    en: `{pn} <text> - Ask the bot something\n{pn} teach <ask> - <answer> - Teach the bot a new response\n\nExamples:\n1. {pn} Hello\n2. {pn} teach hi - hello\n3. {pn} delete <text> - Delete all answers related to text\n4. {pn} delete <text> <index> - Delete specific answer at index\n5. {pn} edit <Ask> <New Ask> to update the ask query\n6. {pn} edit <ask> <index>  <new ans> update specific answer at index`,
  },
};

module.exports.onStart = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  if (args.length === 0) {
    return sendMessage(api, threadID, "Please provide text or teach the bot!", messageID);
  }
  
  const input = args.join(" ").trim();
  const [command, ...rest] = input.split(" ");
  
  switch (command.toLowerCase()) {
    case "teach":
      return teachBot(api, threadID, messageID, senderID, rest.join(" ").trim());
    case "msg":
      return botMsgInfo(api, threadID, messageID, senderID, rest.join(" ").trim());
    case "edit":
      return editMessage(api, threadID, messageID, senderID, rest.join(" ").trim());
    case "delete":
    case "remove":
      return deleteMessage(api, threadID, messageID, senderID, rest.join(" ").trim());
    default:
      return talkWithBot(api, threadID, messageID, senderID, input);
  }
};

module.exports.onChat = async ({ api, usersData, event }) => {
  const { threadID, messageID, body, senderID } = event;
  const name = ((await usersData.get(senderID)).name)
  const cMessages = ["✨ তোর সাথে কথা নাই কারণ তুই অনেক লুচ্চা 💔", " 😑 দূরে যাইয়া মুরি খাঁ, তোর কোনো কাজ কাম নাই", "🍹 এই নাও জুস খাও, বট বলতে বলতে হাপায় গেছো না 🥲","এই বলদ কি বলবি বল😾","চুপ চাপ Propose কর আমারে🫢","Gf de amar boss re🌊 m.me/61573052122735","🤖 Hi, I am bot, can I help you?","😒 এত বট বট না করে টাকা ও পাঠাতে পারো 😏","⚠ এইখানে লুচ্চামি করলে লাথি দিবো কিন্তু 😤","🤨🐸🌊","হাই জানু, তুমি কি Single😛","😍 Chumma dew Janu 😘","😍 হুম জান বলো 😎","😏 হ্যাঁ জানু, এইদিকে আসো, এইদিকে কিস দেই 😘","💬 Bolo ki korte pari tomar jonno","- চলো চলে যাই বিদেশ্যে🤥","😘 উম্মাহ দিলাম, love you কমু কিন্তু 😑","🍹 এই নাও জুস খাও, বট বলতে বলতে হাপায় গেছো না 🥲","What adventures await us today? 🌈","𝐤𝐢𝐫𝐞 𝐭𝐨𝐫 𝐌𝐚𝐭𝐡𝐚𝐢 𝐓𝐨 𝐝𝐞𝐤𝐡𝐢 𝐊𝐨𝐧𝐨 𝐁𝐫𝐚𝐢𝐧 𝐧𝐞𝐢 🌚","🪄 তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই, তাতে যা হই হোক 🤧🥱"];
  const userInput = body.toLowerCase().trim();
  
  const keywords = ["bot", "Bot", "bot", "বট", "বড"];
  
  if (keywords.some((keyword) => userInput.startsWith(keyword))) {
    const isQuestion = userInput.split(" ").length > 1;
    if (isQuestion) {
      const question = userInput.slice(userInput.indexOf(" ") + 1).trim();
      
      try {
        const res = await axios.get(
          `${await getAPIBase()}/bby?text=${encodeURIComponent(question)}&uid=${senderID}&font=1`
        );
        const replyMsg = res.data?.text || "Please teach me this sentence!🦆💨";
        const react = res.data.react || "";
        
        return api.sendMessage(replyMsg+react, threadID, (error, info) => {
          if (!error) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: module.exports.config.name,
              type: "reply",
              author: senderID,
              replyMsg
            });
          }
        }, messageID);
      } catch (error) {
        return api.sendMessage("error🦆💨", threadID, messageID);
      }
    } else {
      const rMsg = cMessages[Math.floor(Math.random() * cMessages.length)];
      return api.sendMessage(`♡  ${name} ✨\n\n${rMsg}`, threadID, (error, info) => {
        if (!error) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            type: "reply",
            author: senderID,
          });
        }
      }, messageID);
    }
  }
};

module.exports.onReply = async ({ api, event, Reply }) => {
  const { threadID, messageID, senderID, body } = event;
  return talkWithBot(api, threadID, messageID, senderID, body);
};
