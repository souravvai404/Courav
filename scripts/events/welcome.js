function hi() {
  console.log("Hello World!");
}
hi();
const {
  getTime
} = global.utils;
const moment = require("moment-timezone");
const fs = require('fs');
const path = require("path");
const request = require('request');
if (!global.temp.welcomeEvent) {
  global.temp.welcomeEvent = {};
}
module.exports = {
  'config': {
    'name': "welcome",
    'version': "1.7",
    'author': "Aminulsordar",
    'category': "events"
  },
  'langs': {
    'vi': {
      'session1': "sáng",
      'session2': "trưa",
      'session3': "chiều",
      'session4': "tối",
      'welcomeMessage': "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
      'multiple1': 'bạn',
      'multiple2': "các bạn",
      'defaultWelcomeMessage': "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!\nCurrent date and time in Manila: {dateTime}\nBạn là thành viên thứ {position} của nhóm này.\nTổng số thành viên: {membersCount}\nTổng số quản trị viên: {adminsCount}"
    },
    'en': {
      'session1': 'morning',
      'session2': "noon",
      'session3': "afternoon",
      'session4': "evening",
      'welcomeMessage': "╭━─━─≪𝐖𝐄𝐋𝐂𝐎𝐌𝐄≫─━─━❯❯\n│\n├─❯【•𝐁𝐎𝐓-𝐎𝐖𝐍𝐄𝐑: 𝚂𝙾𝚄𝚁𝙰𝚅 】\n│\n├─❯【𝚂𝙾𝚄𝚁𝙰𝚅】\n│\n├─❯【•𝐁𝐎𝐓-𝐏𝐑𝐄𝐅𝐈𝐗:【/】\n│\n├─❯ 【•𝐓𝐘𝐏𝐄: . help 𝐔𝐒𝐄 𝐂𝐌𝐃•】\n│\n├─❯【•𝐎𝐖𝐍𝐄𝐑+𝐀𝐃𝐌𝐈𝐍】\n\n├─❯https://www.facebook.com/s.o.u.r.a.v.tsu.941375\n│\n├─❯m.me/100075964867229\n│\n╰━─━─≪𝚂𝙾𝚄𝚁𝙰𝚅≫─━─━❯❯",
      'multiple1': "you",
      'multiple2': "you guys",
      'defaultWelcomeMessage': "Hello {userName}.\nWelcome {multiple} to the chat group: {boxName}.\nHave a nice {session} 😊\nCurrent date and time: {dateTime}.\nYou are the {position} member in this group.\nTotal members: {membersCount}.\nTotal admins: {adminsCount}."
    }
  },
  'onStart': async ({
    threadsData: _0x555721,
    message: _0x19e0ba,
    event: _0x29014c,
    api: _0x1d10ca,
    getLang: _0x4c29c8,
    usersData: _0x2901b2
  }) => {
    if (_0x29014c.logMessageType !== 'log:subscribe') {
      return;
    }
    const {
      threadID: _0x228558
    } = _0x29014c;
    const {
      nickNameBot: _0x3175e7
    } = global.GoatBot.config;
    const _0x1096c4 = global.utils.getPrefix(_0x228558);
    const _0x1185a5 = _0x29014c.logMessageData.addedParticipants;
    if (_0x1185a5.some(_0x2c6734 => _0x2c6734.userFbId === _0x1d10ca.getCurrentUserID())) {
      if (_0x3175e7) {
        _0x1d10ca.changeNickname(_0x3175e7, _0x228558, _0x1d10ca.getCurrentUserID());
      }
      return _0x19e0ba.send(_0x4c29c8("welcomeMessage", _0x1096c4));
    }
    if (!global.temp.welcomeEvent[_0x228558]) {
      global.temp.welcomeEvent[_0x228558] = {
        'joinTimeout': null,
        'dataAddedParticipants': []
      };
    }
    global.temp.welcomeEvent[_0x228558].dataAddedParticipants.push(..._0x1185a5);
    clearTimeout(global.temp.welcomeEvent[_0x228558].joinTimeout);
    global.temp.welcomeEvent[_0x228558].joinTimeout = setTimeout(async () => {
      const _0xdeb11b = await _0x555721.get(_0x228558);
      if (_0xdeb11b.settings.sendWelcomeMessage === false) {
        return;
      }
      const _0x4db04a = global.temp.welcomeEvent[_0x228558].dataAddedParticipants;
      const _0x47c816 = _0xdeb11b.data.banned_ban || [];
      const _0x3233d8 = _0xdeb11b.threadName;
      const _0x2ac654 = await _0x1d10ca.getThreadInfo(_0x228558);
      const _0x4b1905 = _0x4db04a.filter(_0xf2faf0 => !_0x47c816.some(_0x4d4d01 => _0x4d4d01.id === _0xf2faf0.userFbId));
      if (_0x4b1905.length === 0x0) {
        return;
      }
      const _0x5f3bc1 = path.resolve(__dirname, "cache");
      if (!fs.existsSync(_0x5f3bc1)) {
        fs.mkdirSync(_0x5f3bc1);
      }
      const _0x24c853 = () => {
        const _0x98700 = getTime('HH');
        return _0x98700 <= 0xa ? _0x4c29c8("session1") : _0x98700 <= 0xc ? _0x4c29c8("session2") : _0x98700 <= 0x12 ? _0x4c29c8("session3") : _0x4c29c8("session4");
      };
      const _0xe8ed9d = _0xb3ecc5 => {
        const _0x1dd526 = _0xb3ecc5 % 0xa;
        const _0x335cfb = _0xb3ecc5 % 0x64;
        if (_0x1dd526 == 0x1 && _0x335cfb != 0xb) {
          return _0xb3ecc5 + 'st';
        }
        if (_0x1dd526 == 0x2 && _0x335cfb != 0xc) {
          return _0xb3ecc5 + 'nd';
        }
        if (_0x1dd526 == 0x3 && _0x335cfb != 0xd) {
          return _0xb3ecc5 + 'rd';
        }
        return _0xb3ecc5 + 'th';
      };
      const _0x3b03cb = async (_0x29e76a, _0x10e062) => {
        const _0xc0731c = _0x29e76a.fullName;
        const _0x15c7da = _0x29e76a.userFbId;
        const _0x34d7b2 = moment().tz("Asia/Dhaka").format("MMMM Do YYYY, h:mm:ss a");
        const _0x39e112 = _0x2ac654.participantIDs.length;
        const _0x234ba3 = _0x2ac654.adminIDs.length;
        let _0x54fc32 = _0xdeb11b.data.welcomeMessage || _0x4c29c8('defaultWelcomeMessage');
        _0x54fc32 = _0x54fc32.replace(/\{userName\}|\{userNameTag\}/g, _0xc0731c).replace(/\{boxName\}|\{threadName\}/g, _0x3233d8).replace(/\{multiple\}/g, _0x4c29c8("multiple1")).replace(/\{session\}/g, _0x24c853()).replace(/\{dateTime\}/g, _0x34d7b2).replace(/\{membersCount\}/g, _0x39e112).replace(/\{adminsCount\}/g, _0x234ba3).replace(/\{position\}/g, _0xe8ed9d(_0x10e062));
        const _0x282a35 = {
          'body': _0x54fc32,
          'mentions': [{
            'tag': _0xc0731c,
            'id': _0x15c7da
          }]
        };
        const _0xf21676 = await _0x2901b2.getAvatarUrl(_0x15c7da);
        const _0x237af7 = "https://api.popcat.xyz/welcomecard?background=" + encodeURIComponent("https://i.ibb.co.com/yB6wpfj5/1739928582113.jpg") + '&text1=' + encodeURIComponent(_0xc0731c) + "&text2=Welcome%20To%20" + encodeURIComponent(_0x3233d8) + "&text3=Member%20" + encodeURIComponent(_0x10e062) + "&avatar=" + encodeURIComponent(_0xf21676);
        const _0x28fa39 = path.resolve(_0x5f3bc1, _0x15c7da + ".jpg");
        request(_0x237af7).pipe(fs.createWriteStream(_0x28fa39)).on("close", () => {
          _0x282a35.attachment = [fs.createReadStream(_0x28fa39)];
          _0x19e0ba.send(_0x282a35);
        }).on("error", _0x59859d => console.error(_0x59859d));
      };
      for (const [_0x21dfd0, _0x12d3ef] of _0x4b1905.entries()) {
        await _0x3b03cb(_0x12d3ef, _0x2ac654.participantIDs.length - _0x4b1905.length + _0x21dfd0 + 0x1);
      }
      delete global.temp.welcomeEvent[_0x228558];
    }, 0x5dc);
  }
};
