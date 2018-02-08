/* global store */
'use strict';

const hacky = (function(){
  function handleTopClick() {
    $('.tablink-top').on('click', event => {
      resetPage();
      grabTop();
    });
  }

  function handleBestClick() {
    $('.tablink-best').on('click', event => {
      resetPage();
      $.get('https://hacker-news.firebaseio.com/v0/beststories.json').then(
        response => {
          populateStore2(response);
        }
      );
    });
  }

  function handleShowClick() {
    $('.tablink-show').on('click', event => {
      resetPage();
      $.get('https://hacker-news.firebaseio.com/v0/showstories.json').then(
        response => {
          populateStore2(response);
        }
      );
    });
  }

  function handleAskClick() {
    $('.tablink-ask').on('click', event => {
      resetPage();
      $.get('https://hacker-news.firebaseio.com/v0/askstories.json').then(
        response => {
          populateStore2(response);
        }
      );
    });
  }

  function handleJobsClick() {
    $('.tablink-jobs').on('click', event => {
      resetPage();
      $.get('https://hacker-news.firebaseio.com/v0/jobstories.json').then(
        response => {
          populateStore2(response);
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
        populateStore2(response);
        // populateStore(response);
      }
    );
  }

  function createNewItemPromise(itemID) {
    return new Promise((resolve, reject) => {
      $.get(`https://hacker-news.firebaseio.com/v0/item/${itemID}.json`)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  function populateStore(response) {
    const promiseArray = [];
    if (store.stories.length > 1) {
      store.stories.splice(0, store.stories.length);
      clearStories();
    }
    response.forEach(itemID => {
      promiseArray.push(createNewItemPromise(itemID));
    });

    promiseArray.forEach(promise => promise.then(result => {
      store.stories.push(result);
      if (store.stories.length <= 30) {
        addStoryToPage(store.stories.length - 1);
      }
    }));
  }

  function populateStore2(response) {
    store.storyArray = response;
    clearStories();
    response.forEach((itemId, index) => {
      if (!store.stories2[itemId]) {
        store.stories2[itemId] = {};
        const item = store.stories2[itemId];
        createNewItemPromise(itemId).then((response) => {
          item.body = response;
          item.lastAccessed = Date.now();
          item.html = generateListItem(response);
          if (index < 30){
            addStoryToPage(item.html, index);
          }
        }); 
        
      } 
      if (index < 30 && store.stories2[itemId].html !== undefined) {
        addStoryToPage(store.stories2[itemId].html, index);
      }
    });
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

  function addStoryToPage(storyHTML, index) {
    $('.js-content').append(`<li value="${index + 1}">${storyHTML}</li>`);
  }

  function generateListItem(story){
    return `
      ${story.score} <a href="${story.url}" target="_blank">${story.title}</a>
      <p>${story.descendants} comments Posted by: ${story.by}</p>
    `;
  }

  function handleNextPageClick() {
    $('.js-next-page').on('click', event => {
      store.page++;
      $('.js-prev-page').prop('disabled', false);
      if (store.page * 30 > store.storyArray.length) {
        $('.js-next-page').prop('disabled', true);
      }
      newPageUpdate();
    });
  }

  function handlePreviousPageClick() {
    $('.js-prev-page').on('click', event => {
      store.page--;
      $('.js-next-page').prop('disabled', false);
      if (store.page === 1) {
        $('.js-prev-page').prop('disabled', true);
      }
      newPageUpdate();
    });
  }

  function newPageUpdate() {
    $('.page-number').html(`Page ${store.page}`);
    clearStories();
    for (let i = store.page * 30 - 30; i < store.page * 30; i++) {
      addStoryToPage(store.stories2[store.storyArray[i]].html, i);
    }
  }

  function clearStories() {
    $('.js-content').html('');
  }

  function bindEventListeners() {
    handleTopClick();
    handleBestClick();
    handleShowClick();
    handleAskClick();
    handleJobsClick();
    handleNextPageClick();
    handlePreviousPageClick();
  }

  return {
    bindEventListeners,
    grabTop
  };
})();