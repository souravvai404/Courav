const os = require("os");

function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs} hours, ${mins} minutes, ${secs} seconds`;
}

module.exports = {
  config: {
    name: "rtm",
    aliases: [],
    version: "2.0",
    author: "Jubayer",
    countDown: 5,
    role: 0,
    shortDescription: "Show live bot/system info",
    longDescription: "Displays current bot and system statistics like uptime, RAM usage, OS info, etc.",
    category: "info",
    guide: "{pn}"
  },

  onStart: async function ({ message, api }) {
    const botName = " JUBAYER~~~ ";
    const botPrefix = ".";
    const botVersion = "2.0";
    const botDescription = "This bot can help you with various tasks including managing the server, providing information, and more.";

    const systemUptime = formatTime(os.uptime());
    const processUptime = formatTime(process.uptime());
    const totalMem = formatBytes(os.totalmem());
    const freeMem = formatBytes(os.freemem());
    const usedMem = formatBytes(os.totalmem() - os.freemem());

    const cpus = os.cpus();
    const cpuModel = cpus?.[0]?.model || "N/A";
    const cpuCores = cpus.length || "N/A";

    const platform = os.platform() + " " + os.release();
    const arch = os.arch();
    const hostname = os.hostname();
    const homedir = os.homedir();

    const loadAvg = os.loadavg().map(l => l.toFixed(2)).join(", ");

    const users = global.data?.allUserID?.length || "Unknown";
    const threads = global.data?.allThreadID?.length || "Unknown";

    const ping = Date.now() - global.GoatBotStartTimestamp;

    const info = `
╭─✦ 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 ✦─
├‣ 🤖 Bot Name: ${botName}
├‣ ⏰ Bot Prefix: ${botPrefix}
├‣ 📌 Bot Version: ${botVersion}
├‣ 📄 Bot Description: ${botDescription}
╰───────────⊙

╭─✦ 𝗨𝗣𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢 ✦─
├‣ 🕒 System Uptime: ${systemUptime}
├‣ ⏱ Process Uptime: ${processUptime}
╰───────────⊙

╭─✦ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢 ✦─
├‣ 📡 OS: ${platform}
├‣ 🖥 CPU: ${cpuModel} (${cpuCores} cores)
├‣ 📈 Total Memory: ${totalMem}
├‣ 📉 Free Memory: ${freeMem}
├‣ 📊 RAM Usage: ${usedMem}
├‣ 👥 Total Users: ${users}
├‣ 📂 Total Threads: ${threads}
├‣ 🔄 Ping: ${ping} ms
├‣ 🔧 Load Average: ${loadAvg}
├‣ ⚙ Architecture: ${arch}
├‣ 🔹 Hostname: ${hostname}
├‣ 🏠 Home Directory: ${homedir}
╰─────────────⊙`;

    message.reply(info);
  }
};
