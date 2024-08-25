// - - - - - - - - - - - -Tab Handling- - - - - - - - - - - -
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm ]");
const searchInp = document.querySelector("[data-searchInp]");
const apiErrorContainer = document.querySelector(".api-error-container");
const messageText = document.querySelector("[data-messageText]");
const loadingScreen=document.querySelector(".loading-container");

const errorApiMsg=document.querySelector("[data-apiErrorText]");
const errorApiBtn=document.querySelector("[data-apiErrorBtn]");

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// Setting default tab
currentTab.classList.add("current-tab");

function switchTab(clickedTab) {
  apiErrorContainer.classList.remove("active");
  if (clickedTab !== currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getFromSessionStorage();
    }
    // console.log("Current Tab", currentTab);
  }
}

userTab.addEventListener("click", () => {
    console.log("tab1 word");
  switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    console.log("tab2 word");
  switchTab(searchTab);
});

// - - - - - - - - - - - -User Weather Handling- - - - - - - - - - - -

//check user location stored or not
function getFromSessionStorage(){
    console.log("getfrom session work")
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

const grantAccessBtn=document.querySelector("[data-grantAccess]");

function getLocation(){
    console.log("get location work")
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        messageText.innerText = "Geolocation is not supported by this browser.";
        grantAccessBtn.style.display = "none";
    }
}

function showPosition(position){
    console.log("showposition func work");
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
      fetchUserWeatherInfo(userCoordinates);
}

getFromSessionStorage();
grantAccessBtn.addEventListener('click',getLocation);

async function fetchUserWeatherInfo(coordinates){
    console.log("fetch user weather fucn work");
    const{lat,lon}=coordinates;
    
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response=await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        if(!response.ok){
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        
    } catch (error) {
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        errorApiMsg.innerText=error?.message;
        errorApiBtn.addEventListener('click',fetchUserWeatherInfo);
    }
}

function renderWeatherInfo(weatherInfo){
    
    console.log("render func work");
    //fetch info tags
    // const cityName=document.querySelector("[data-cityName]");
    // const cityIcon=document.querySelector("[data-countryIcon]");
    // const temp=document.querySelector("[data-temp]");
    // const desc=document.querySelector("[data-weatherDesc]");
    // const weatherIcon=document.querySelector("[data-weatherIcon]");

    // const windSpeed=document.querySelector("[data-windspeed]");
    // const humidity=document.querySelector("[data-humidity]");
    // const cloudiness=document.querySelector("[data-cloudiness]");
    // console.log("render half work")
    // cityName.innerText=weatherInfo?.name;
    
    // countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    // desc.innerText = weatherInfo?.weather?.description;
    // weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    
    // temp.innerText = weatherInfo?.main?.temp;
    // windSpeed.innerText=weatherInfo?.wind?.speed;
    // humidity.innerText=weatherInfo?.main?.humidity;
    // cloudiness.innerText=weatherInfo?.clouds?.all;
    
    const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.main;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp}°C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    
    

    console.log("render fully work")

}
//search weather handling

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchInp.value=="") return;

    //not empty
    fetchSearchWeatherInfo(searchInp.value);
    searchInp.value = "";
});

async function fetchSearchWeatherInfo(city){
    userInfoContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          
        const data=await response.json();
        if (!response.ok) {
            throw data;
        }
        apiErrorContainer.classList.remove("active");
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);  
    } catch (error) {
        loadingScreen.classList.remove("active");
       
        apiErrorContainer.classList.add("active");
        
        errorApiMsg.innerText=`${error?.message}`;
        errorApiBtn.style.display="none";

    }
}

