/* global hacky*/
'use strict';

$(document).ready(function(){
  hacky.grab('https://hacker-news.firebaseio.com/v0/topstories.json');
  hacky.bindEventListeners();
});