'use strict'; //weather

const weatherBlock = document.querySelector('#weather');

async function loadWeather() {
  weatherBlock.innerHTML = `<pre class="loading"><pre>`;
  let blockLoading = document.querySelectorAll('pre')[1];
  let timerID = loading(blockLoading);
  const server = "https://api.openweathermap.org/data/2.5/weather?q=Mogilev&lang=ru&units=metric&appid=YOUR_ID";
  const response = await fetch(server, {
    method: 'GET'
  });
  const responseResult = await response.json();

  if (response.ok) {
    getWeather(responseResult, timerID);
  } else {
    weatherBlock.innerHTML = responseResult.message;
  }
}

function getWeather(data, timerID) {
  let name = data.name;
  let status = data.weather[0].main;
  let icon = data.weather[0].icon;
  let temp = Math.round(data.main.temp);
  let feelsLike = Math.round(data.main.feels_like);
  let template = `
    <div class="weather__header">
        <div class="weather__main">
            <div class="weather__city">${name}</div>
            <div class="weather__status">${status}</div>
        </div>
        <div class="weather__icon">
            <img src="http://openweathermap.org/img/w/${icon}.png" alt="${status}">
        </div>
    </div>
    <div class="weather__temp">${temp}°C</div>
    <div class="weather__feels-like">Feels like: ${feelsLike}°C</div>
    `;
  weatherBlock.innerHTML = template;
  clearTimeout(timerID);
}

if (weatherBlock) {
  loadWeather();
} //exchange-rate


const exchangeRateBlock = document.querySelector('#exchange-rate');

async function loadRate() {
  exchangeRateBlock.innerHTML = `<pre class="loading"><pre>`;
  let blockLoading = document.querySelectorAll('pre')[0];
  let timerID = loading(blockLoading);
  const server = 'https://www.nbrb.by/api/exrates/rates/431';
  const response = await fetch(server, {
    method: 'GET'
  });
  const responseResult = await response.json();

  if (response.ok) {
    getRate(responseResult, timerID);
  } else {
    exchangeRateBlock.innerHTML = responseResult.message;
  }
}

function getRate(data, timerID) {
  const Cur_OfficialRate = data.Cur_OfficialRate;
  const template = `
    <div class="foreign-currency currency">
    <div class="foreign-currency__title currency__title">USD</div>
    <input type="text" class="foreign-currency__amount currency__amount" value="1">
    </div>
    <div class="our-currency currency">
        <div class="our-currency__title currency__title">BYN</div>
        <input type="text" class="our-currency__amount currency__amount" value="${Cur_OfficialRate}">
    </div>
   `;
  exchangeRateBlock.innerHTML = template;
  clearTimeout(timerID);
  const ourAmount = document.querySelector('.our-currency__amount');
  const foreignAmount = document.querySelector('.foreign-currency__amount');
  foreignAmount.addEventListener("input", () => ourAmount.value = Cur_OfficialRate * foreignAmount.value);
  ourAmount.addEventListener("input", () => foreignAmount.value = ourAmount.value / Cur_OfficialRate);
}

if (exchangeRateBlock) {
  loadRate();
} //loading


function loading(blockLoading) {
  const text = 'loading...';
  let count = 0;
  let result = '';

  function typeLine() {
    let interval = setTimeout(() => {
      result += text[count];
      blockLoading.innerHTML = result + '|';
      count++;

      if (count >= text.length) {
        count = 0;
        clearTimeout(interval);
        blockLoading.innerHTML = result;
        result = '';
      }

      typeLine();
    }, 250);
    return interval;
  }

  return typeLine();
}