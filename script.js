"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  countriesContainer.style.opacity = 1;
};

const renderCountry = function (data, className = "") {
  const languages = data.languages[Object.keys(data.languages)[0]];

  const currencies = data.currencies[Object.keys(data.currencies)[0]].name;

  const html = `
    <article class="country ${className}">
          <img class="country__img" src="${data.flags.svg}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}m people</p>
            <p class="country__row"><span>🗣️</span>${languages}</p>
            <p class="country__row"><span>💰</span>${currencies}</p>
          </div>
    </article>
    `;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then((position) => console.log(position));

const whereAmI = function () {
  getPosition()
    .then((position) => {
      const { latitude: lat, longitude: lng } = position.coords;

      return fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=148242640815718264297x10968`
      );
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      console.log(
        `You are in ${data.city}, State of ${data.state}, ${data.country}. Timezone: ${data.timezone}`
      );

      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);

      return res.json();
    })
    .then((data) => renderCountry(data[0]))
    .catch((err) => console.error(`${err.message} 💥`));
};

btn.addEventListener("click", whereAmI);
