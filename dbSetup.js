const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/omnimood';
const connection = mongoose.connect(MONGO_URL);
const data = require('./json/newCountryList.json');
const Country = require('./models/countries');
const Emoji = require('./models/emoji');
const emojiData = require('./json/emoji.json');
const bluebird = require('bluebird');
const emojiCode = require('./json/codeEmoji.json');
var sendData = [];
data.forEach((element)=>{
  sendData.push({name: element.name, code: element.code, codeNum: parseInt(element.codeNum)});
});
var list = {}
for(var face in emojiData){

  var inFace = emojiData[face];
  var nameFace = inFace.name;
  list[nameFace] = 0;
}
list.amount = 0;
var emojiArray = [];
for(var face in emojiData){
  emojiArray.push(emojiData[face]);
}

mongoose.connection.once('open', function() {
  Promise.all([
    Country.insertMany(sendData.map((element, index, array) =>{
      return {
        countryId: element.codeNum,
        name: element.name,
        code: element.code,
        GPS: '0,0',
        mood: 0,
        emoji: list
      }
    })),
    Emoji.insertMany(emojiArray.map((element,index, array) =>{
      return {
        name: inFace.name,
        code: inFace.code,
        value: inFace.value
      }
    }))
  ])
  .then(function() {
    mongoose.connection.close();
  });
});