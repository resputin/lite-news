/* global store*/
'use strict';

function handleTopClick() {
  $('.tablink-top').on('click', event => {
    resetPage();
    grabTop();
  });
}

function handleBestClick() {
  $('.tablink-best').on('click', event => {
    resetPage();
    $.get('https://hacker-news.firebaseio.com/v0/beststories.json').then(response => {
      populateStore(response);
    });
  });
}

function handleShowClick() {
  $('.tablink-show').on('click', event => {
    resetPage();
    $.get('https://hacker-news.firebaseio.com/v0/showstories.json').then(response => {
      populateStore(response);
    });
  });
}

function handleAskClick() {
  $('.tablink-ask').on('click', event => {
    resetPage();
    $.get('https://hacker-news.firebaseio.com/v0/askstories.json').then(
      response => {
        populateStore(response);
      }
    );
  });
}

function handleJobsClick() {
  $('.tablink-jobs').on('click', event => {
    resetPage();
    $.get('https://hacker-news.firebaseio.com/v0/jobstories.json').then(
      response => {
        populateStore(response);
      }
    );
  });
}

function resetPage() {
  store.page = 1;
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
    clearStories();
  }
  response.forEach(itemID => {
    promiseArray.push(createNewItemPromise(itemID));
  });

  promiseArray.forEach(promise => promise.then(result => {
    store.stories.push(result);
    if (store.stories.length <= 30){
      addStoryToPage(store.stories.length - 1);
    }
  }));
}

// function populateStore(response) {
//   const promiseArray = [];
//   if (store.stories.length > 1) {
//     store.stories.splice(0, store.stories.length);
//     clearStories();
//   }
//   response.forEach(itemID => {
//     createNewItemPromise(itemID).then(result => {
//       store.stories.push(result);
//       if (store.stories.length < 30) {
//         addStoryToPage(store.stories.length - 1);
//       }
//     });
//   });
// }

function addStoryToPage(storyNumber) {
  $('.js-content').append(`
    <li value=${storyNumber + 1}>
      ${store.stories[storyNumber].score} <a href="${store.stories[storyNumber].url}" target="_blank">${store.stories[storyNumber].title}</a>
      <p>${store.stories[storyNumber].descendants} comments Posted by: ${store.stories[storyNumber].by}</p>
    </li>`);
}

function handleNextPageClick() {
  $('.js-next-page').on('click', event => {
    store.page++;
    newPageUpdate();
  });
}

function handlePreviousPageClick() {
  $('.js-prev-page').on('click', event => {
    store.page--;
    newPageUpdate();
  });
}

function newPageUpdate() {
  $('.page-number').html(`Page ${store.page}`);
  clearStories();
  for (let i = store.page * 30 - 30; i < store.page * 30; i++) {
    addStoryToPage(i);
  }
}

function clearStories() {
  $('.js-content').html('');
}

function bindEventListeners(){
  handleTopClick();
  handleBestClick();
  handleShowClick();
  handleAskClick();
  handleJobsClick();
  handleNextPageClick();
  handlePreviousPageClick();
}


$(document).ready(function(){
  grabTop();
  bindEventListeners();
});