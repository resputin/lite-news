/* global main*/
'use strict';

$(document).ready(function(){
  main.clearDom();
  main.grab('https://hacker-news.firebaseio.com/v0/topstories.json');
  main.bindEventListeners();
});