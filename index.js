'use strict';

const apiKey = 'B4RHUamIJK5Be3GGTBPea7jc550SvdHMLhFXzVdx';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  if (responseJson.limit > responseJson.total) {
    for (let i = 0; i < responseJson.total; i++) {
      $('#results-list').append(
        `<li><h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <a href='${responseJson.data[i].url}'>Website URL</a>
        </li>`
      );
    }
  } else {
    for (let i = 0; i < responseJson.limit; i++) {
      $('#results-list').append(
        `<li><h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <a href='${responseJson.data[i].url}'>Website URL</a>
        </li>`
      );
    }
  }
  $('#results').removeClass('hidden');
}

function getParks(stateCode, maxResults) {
  const params = {
    api_key: apiKey,
    stateCode: stateCode,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $('#results-list').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit((event) => {
    event.preventDefault();
    const state = $('#js-state').val();
    const maxResults = $('#js-max-results').val();
    getParks(state, maxResults);
  });
}

$(watchForm);
