/* global store*/
'use strict';

function handleTopClick() {
  $('.tablink-top').on('click', event => {
    grabTop();
  });
}

function handleBestClick() {
  $('.tablink-best').on('click', event => {
    $.get('https://hacker-news.firebaseio.com/v0/beststories.json').then(response => {
      populateStore(response);
    });
  });
}

function grabTop() {
  $.get('https://hacker-news.firebaseio.com/v0/topstories.json').then(
    response => {
      populateStore(response);
    }
  );
}

function createNewItemPromise(itemID) {
  return new Promise((resolve, reject) => {
    $.get(`https://hacker-news.firebaseio.com/v0/item/${itemID}.json`).then(
      response => {
        resolve(response);
      }
    ).catch(err => {
      reject(err);
    });
  });
}

function populateStore(response) {
  const promiseArray = [];
  if(store.stories.length > 1){
    store.stories.splice(0, store.stories.length);
  }
  response.forEach(itemID => {
    promiseArray.push(createNewItemPromise(itemID));
  });

  Promise.all(promiseArray).then(result => {
    store.stories = result;
    render();
  });
}

function render() {
  $('.js-content').html('');
  for (let i = 0; i < 30; i++){
    
    $('.js-content').append(`<li>
            ${store.stories[i].score} <a href="${store.stories[i].url}">${store.stories[i].title}</a>
            <p>${store.stories[i].descendants} comments Posted by: ${store.stories[i].by}</p>
          </li>`);
  }
}

function bindEventListeners(){
  handleTopClick();
  handleBestClick();
}


$(document).ready(function(){
  grabTop();
  bindEventListeners();
});