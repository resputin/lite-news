/* global store */
'use strict';

const uuid = require('uuid/v1');

const hacky = (function() {
  function handleTopClick() {
    $('.tablink-top').on('click', () => {
      grab('https://hacker-news.firebaseio.com/v0/topstories.json');
    });
  }

  function handleBestClick() {
    $('.tablink-best').on('click', () => {
      grab('https://hacker-news.firebaseio.com/v0/beststories.json');
    });
  }

  function handleShowClick() {
    $('.tablink-show').on('click', () => {
      grab('https://hacker-news.firebaseio.com/v0/showstories.json');
    });
  }

  function handleAskClick() {
    $('.tablink-ask').on('click', () => {
      grab('https://hacker-news.firebaseio.com/v0/askstories.json');
    });
  }

  function handleJobsClick() {
    $('.tablink-jobs').on('click', () => {
      grab('https://hacker-news.firebaseio.com/v0/jobstories.json');
    });
  }

  function resetPage() {
    clearStories();
    store.page = 1;
    newPageUpdate();
  }

  function grab(address) {
    resetPage();
    $.get(address).then(response => {
      populateStore(response);
    });
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
    if (localStorage.stories === undefined) {
      localStorage['stories'] = JSON.stringify({});
    }
    store.storyArray = response;
    const cachedStories = JSON.parse(localStorage.stories);
    clearStories();
    store.currentStoryHTML = [];
    response.forEach((itemId, index) => {
      if (index < 30 * (store.page + 1) && index > store.page * 30 - 31) {
        if (!cachedStories[itemId]) {
          cachedStories[itemId] = {};
          const item = cachedStories[itemId];
          createNewItemPromise(itemId).then(response => {
            item.body = response;
            item.lastAccessed = Date.now();
            item.html = generateListItem(response);
            localStorage['stories'] = JSON.stringify(cachedStories);
            if (index < 30 * store.page) {
              addStoryToPage(item.html, index);
            }
          });
        } else if (index < 30 * store.page) {
          addStoryToPage(cachedStories[itemId].html, index);
        }
      }
    });
  }

  function addStoryToPage(storyHTML, index) {
    store.currentStoryHTML.splice(
      index % 30,
      0,
      `<li value="${index + 1}">${storyHTML}</li>`
    );
    $('.js-content').html(store.currentStoryHTML);
  }

  function generateListItem(story) {
    return `
      ${story.score} <a href="${story.url}" target="_blank">${story.title}</a>
      <p>${story.descendants} comments Posted by: ${story.by}</p>
    `;
  }

  class Component {
    constructor(htmlContent, parent, children = {}) {
      this.htmlContent = htmlContent;
      this.shouldRender = true;
      this.parent = parent;
      this.children = children;
    }

    render() {
      $(`#${this.parent}`).append(this.htmlContent);
      if (this.children) {
        for (const child in this.children) {
          this.children[child].render();
        }
      }
    }
  }

  function populateComponents(response) {
    if (!localStorage['components']) {
      localStorage['components'] = JSON.stringify({});
    }
    const cachedComponents = JSON.parse(localStorage.components);
    response.forEach((story, index) => {
      if ( !cachedComponents[story] ) {
        createNewItemPromise(story)
          .then(response => {
            const contentHTML = generateListItem(response);
            const contentId = uuid();
            cachedComponents[contentId] = new Component(contentHTML, `${story}`);
            const storyHTML = `<li value="${index + 1}" id="${story}"></li>`;
            cachedComponents[story] = new Component(storyHTML, 'js-story-list', {contentId: cachedComponents[contentId]});
            cachedComponents[story].render();
          });
      }
    });
  }

  function handleNextPageClick() {
    $('.js-next-page').on('click', () => {
      store.page++;
      $('.js-prev-page').prop('disabled', false);
      if (store.page * 30 > store.storyArray.length) {
        $('.js-next-page').prop('disabled', true);
      }
      newPageUpdate();
    });
  }

  function handlePreviousPageClick() {
    $('.js-prev-page').on('click', () => {
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
    store.currentStoryHTML = [];
    populateStore(store.storyArray);
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
    grab
  };
})();
