const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grandAccess = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-formContainer]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-conatiner");

const errorFound = document.querySelector("[data-NotFound]");
const API_KEY = "dcaf458ac8b7ab12b3d950a362a02158";
let currentTab = userTab;
currentTab.classList.add("current-tab");
grandAccess.classList.add("active");

function renderWeatherInfo(weatherInfo) {
    // Fetch Elements
    const cityName = document.querySelector("[data-cityName]");
    const countryFlag = document.querySelector("[data-countryFlag]");
    const description = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[ data-weahtherIcon]");
    const temerature = document.querySelector("[data-temperature]");
    const humidity = document.querySelector("[ data-humidity]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const cloudiness = document.querySelector("[ data-cloud]");

    //  Fetch value from  weatherInfo object and put it UI elements

    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temerature.innerText = `${weatherInfo?.main?.temp} °C`;
    humidity.innerText = `${weatherInfo?.main?.humidity}.00 % `;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} M/S`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}.00 %`;


}

async function fetchUserWeatherInfo(localCoordinates) {
    const { lat, lon } = localCoordinates;

    // make grantContainer invisible
    grandAccess.classList.remove("active");
    // make loader screen visible
    loadingScreen.classList.add("active");
    searchForm.classList.remove("active");
    errorFound.classList.remove("active");

    // API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (e) {
        loadingScreen.classList.remove("active");
    }
}


// check if coordinates are already present in seasion storage
function getFromSeasionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if (!localCoordinates) {
        grandAccess.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            grandAccess.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            // ma pehly search tab par tha ab your weather wala visible krna ha
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab ma your weather wali tab ma ah gaya hun tu weather b dislay krna pary gah , so let's check local storage
            // first for cordinates, if we haved saved them there.
            getFromSeasionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        //    agar feature support hu browser ma
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Browser Not supported");
    }
}


async function fetchSearchWeatherInfo(cityName) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grandAccess.classList.remove("active");
    errorFound.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        const data = await response.json();
        
        if (!data.main) {
            throw data;
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        //    userInfoContainer.classList.remove("active");
        errorFound.classList.add("active");
    }


}

const grantAccessBtn = document.querySelector("[data-grantAccessBtn]");
grandAccess.addEventListener('click', getCurrentLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName == "") {
        return;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }

});

