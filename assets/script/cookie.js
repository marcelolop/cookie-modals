"use strict";

import { onEvent, select, getElement, sleep } from "./utils/general.js";

/*
!--------------------------------------------------
!                DOM ELEMENTS                     |
!--------------------------------------------------
*/

//*modals
const modalAccept = select(".modal-accept");
const modalSettings = select(".modal-settings");

//*Accept Modal buttons
const acceptBtn = getElement("accept");
const settingsBtn = getElement("settings");

//*Settings Modal buttons
const saveBtn = getElement("save");

//*Settings Modal inputs
const browserInput = select(".browser");
const osInput = select(".os");
const widthInput = select(".width");
const heightInput = select(".height");

/*
!--------------------------------------------------
!                DIALOG FUNCTIONS                 |
!--------------------------------------------------
*/

function initializePage() {
  const inputs = [browserInput, osInput, widthInput, heightInput];
  inputs.forEach((input) => (input.checked = true));
  const browserCookie = getCookie(browserKey);
  const osCookie = getCookie(osKey);
  const widthCookie = getCookie(widthKey);
  const heightCookie = getCookie(heightKey);
  const allCookiesRejected = getCookie("allCookiesRejected");
  if (browserCookie === undefined && osCookie === undefined && widthCookie === undefined && heightCookie === undefined && allCookiesRejected === undefined ) {
    sleep(3000).then(() => {
      modalAccept.classList.add("visible");
    });
    console.log("page loaded, accept modal shown, cookies checked");
  }
  if (browserCookie !== undefined) {
    console.log(`Browser: ${browserCookie}`);
  }
  if (osCookie !== undefined) {
    console.log(`Operating System: ${osCookie}`);
  }
  if (widthCookie !== undefined) {
    console.log(`Screen Width: ${widthCookie}`);
  }
  if (heightCookie !== undefined) {
    console.log(`Screen Height: ${heightCookie}`);
  }
}

onEvent("load", window, initializePage);


function handleSettingsClick() {
  modalSettings.classList.add("visible");
  modalAccept.classList.remove("visible");
  console.log("settings clicked");
}

onEvent("click", settingsBtn, handleSettingsClick);

/*
!--------------------------------------------------
!                COOKIE FUNCTIONS                  |
!--------------------------------------------------
*/

let browserKey = encodeURIComponent("browser");
let osKey = encodeURIComponent("os");
let widthKey = encodeURIComponent("width");
let heightKey = encodeURIComponent("height");

function setCookie(key, value) {
  let encodedValue = encodeURIComponent(value);
  document.cookie = `${key}=${encodedValue}; SameSite=Lax; Secure; max-age=20`;
}

function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function getBrowserName() {
  const userAgent = window.navigator.userAgent;
  const browsers = [
    { name: "Edge", regex: /(Edg)\/([\d.]+)/ },
    { name: "Chrome", regex: /(Chrome)\/([\d.]+)/ },
    { name: "Firefox", regex: /(Firefox)\/([\d.]+)/ },
    { name: "Safari", regex: /(Safari)\/([\d.]+)/ },
    { name: "Opera", regex: /(OPR)\/([\d.]+)/ },
  ];

  for (let browser of browsers) {
    const match = userAgent.match(browser.regex);
    if (match) {
      return browser.name;
    }
  }

  return "Current browser: Unknown";
}

function getOSName() {
  const userAgent = window.navigator.userAgent;
  const osMap = {
    Win: "Windows",
    Mac: "MacOS",
    Android: "Android",
    "like Mac": "iOS",
    Linux: "Linux",
  };

  for (let os in osMap) {
    if (userAgent.indexOf(os) > -1) {
      return osMap[os];
    }
  }

  return "Current OS: Unknown";
}

function getScreenWidth() {
  const screenWidth = window.screen.width;
  return screenWidth;
}

function getScreenHeight() {
  const screeHeight = window.screen.height;
  return screeHeight;
}

function storeInfoInCookies() {
  const browserName = getBrowserName();
  const osName = getOSName();
  const screenWidth = getScreenWidth();
  const screenHeight = getScreenHeight();

  setCookie(browserKey, browserName);
  setCookie(osKey, osName);
  setCookie(widthKey, screenWidth);
  setCookie(heightKey, screenHeight);
}

function acceptAllCookies() {
  storeInfoInCookies();
  modalAccept.classList.remove("visible");
  console.log("Cookies accepted");
}

onEvent("click", acceptBtn, acceptAllCookies);

function saveSettings() {
  const inputs = [browserInput, osInput, widthInput, heightInput];
  const keys = [browserKey, osKey, widthKey, heightKey];
  const getters = [getBrowserName, getOSName, getScreenWidth, getScreenHeight];

  let allCookiesRejected = true;

  inputs.forEach((input, index) => {
    if (input.checked) {
      const value = getters[index]();
      setCookie(keys[index], value);
      console.log(`${keys[index]} saved`);
      allCookiesRejected = false;
    } else {
      console.log(`${keys[index]} not saved`);
    }
  });

  if (allCookiesRejected) {
    setCookie("allCookiesRejected", "true");
    console.log("All cookies rejected");
  }

  modalSettings.classList.remove("visible");
}

onEvent("click", saveBtn, saveSettings);


