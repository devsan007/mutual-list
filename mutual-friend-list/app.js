const express = require('express');
const request = require('request');
const util = require('util');
const app = express();
const Twitter = require('twitter');
const config = require('./config.js');
const T = new Twitter(config);
const fs = require('fs');
let arrayOne = [];
let arrayTwo = [];
let intersection = [];

app.use(express.json())
app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
  res.render('index');
  
});

app.post('/find-mutual-friends',(req,res)=>{
  console.log(req.body);
  var account_one_name = req.body.account_one;
  var account_second_name = req.body.account_two;
  if(account_one_name != '' && account_second_name != ''){
      let prmiseOne = new Promise((resolve,reject)=>{
      T.get(`https://api.twitter.com/1.1/friends/list.json?cursor=-1&screen_name=${account_one_name}&skip_status=true&include_user_entities=false`,(err,data)=>{
      if(err){
        console.log(err);
        return false;
      }
      data.users.forEach(element => {
          let friendNameOne = `${element.id} - ${element.name}`;
          arrayOne.push(friendNameOne);
        });
        resolve(arrayOne);
      });
    });

    let prmiseTwo = new Promise((resolve,reject)=>{
      T.get(`https://api.twitter.com/1.1/friends/list.json?cursor=-1&screen_name=${account_second_name}&skip_status=true&include_user_entities=false`,(err,data1)=>{
        if(err){
          console.log(err);
          return false;
        }
        data1.users.forEach(element => {
          let friendNameTwo = `${element.id} - ${element.name}`;
          arrayTwo.push(friendNameTwo);
        });
        resolve(arrayTwo);
      });
    });

    prmiseOne
    .then((responseOne)=>{
      console.log("Start");
      console.log(responseOne);
      console.log("break");
    })
    .then(()=>{
      prmiseTwo.then((responseTwo)=>{
        console.log(responseTwo);
        console.log("end");
      });
    }).then(()=>{
      intersection = arrayOne.filter(element => arrayTwo.includes(element));
      console.log("Mutual friend list :");
      console.log(intersection);
      res.render('show-mutual-friend-lists',
      {
        responseParam : intersection
      });
    });
  }else{
    console.log("Plese provide account names");
    res.render('show-mutual-friend-lists',
      {
        responseParam : []
      });
  }
});

app.listen(3000);


