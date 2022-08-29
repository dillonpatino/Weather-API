var searchHistory = []
var lastCitySearch = ""

var cityWeather = function(city) {
    var geoLocation = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=33a442ce0b1dad52f9352616c57d9d69"
    fetch(geoLocation)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        console.log(data);
        getoneCall(data, city);
    })
};
function getoneCall(data, city) {
    var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data[0].lat + "&lon=" + data[0].lon + "&appid=33a442ce0b1dad52f9352616c57d9d69&units=imperial"
    fetch(oneCall)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        console.log(data);
        displayWeather(data, city);
        displayForecast(data, city);
    })
}

var citySearch = function(event) {
    event.preventDefault();
    var cityName = $("#cityname").val().trim()
    if (cityName) {
        cityWeather(cityName);
        $("#cityname").val("");
    } else {
        alert("Enter a city name");
    }
};


var displayWeather = function(weatherData, city) {
    $("#city-name").text(`${city} (${moment.unix(weatherData.current.dt).format("MM-DD-YYYY")})`);
    $("#city-temp").text(`Temp: ${weatherData.current.temp}` + "°F");
    $("#city-wind").text(`Wind Speed: ${weatherData.current.wind_speed}` + " mph");
    $("#city-humid").text(`Humidity: ${weatherData.current.humidity}` + "%");
    $("#city-uv").text(`UV Index: ${weatherData.current.uvi}`);

if (weatherData.current.uvi >= 11) {
    $("#city-uv").css("background-color", "purple")
    } else if (weatherData.current.uvi < 11 && weatherData.current.uvi >= 8) {
    $("#city-uv").css("background-color", "red")
    } else if (weatherData.current.uvi < 8 && weatherData.current.uvi >= 6) {
    $("#city-uv").css("background-color", "orange")
    } else if (weatherData.current.uvi < 6 && weatherData.current.uvi >= 3) {
        $("#city-uv").css("background-color", "yellow")
    } else {
        $("#city-uv").css("background-color", "green")
    }
}

var displayForecast = function(weatherData, city) {

    $("#5-day").empty();
    
    for (var i=0; i < 5; i++) {
    var forecastCard = $("<div class='card mt-3'></div>");
    var forecastBody = $("<div class='card-body'></div>");
    var date = $("<h6 class='card-title'></h6>");
    date.text(moment.unix(weatherData.daily[i].dt).format("MM-DD-YYYY"));
    var icon = $(`<img src='https://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}.png'>`)
    var forecastTemp = $(`<p class='card-text'>Temp: ${weatherData.hourly[i].temp} °F</p>`);
    var forecastWind = $(`<p class='card-text'>Wind: ${weatherData.daily[i].wind_speed} MPH</p>`);
    var forecastHumid = $(`<p class='card-text'>Humidity: ${weatherData.daily[i].humidity} %</p>`);
    $("#5-day").append(forecastCard);
    forecastCard.append(forecastBody);
    forecastBody.append(date, icon, forecastTemp, forecastWind, forecastHumid);
    }

lastCitySearch = city;
saveSearchHistory(city);
}
var saveSearchHistory = function(city) {

        var searchedCity = $(`<a href='#' class='list-group-item list-group-item-action' id='${city}'>${city}</a>`);
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        $("#search-history").append(searchedCity);
    }

    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));

    localStorage.setItem("lastCitySearch", JSON.stringify(lastCitySearch));

    loadSearchHistory();
}


var loadSearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    lastCitySearch = JSON.parse(localStorage.getItem("lastCitySearch"));


    if (!searchHistory) {
        searchHistory = [];
    }

    if (!lastCitySearch) {
        lastCitySearch = "";
    }
    $("#search-history").empty();

  
    for (var i=0; i < searchHistory.length; i++) {

        var searchedCityLink = $(`<a href='#' class='list-group-item list-group-item-action' id='${searchHistory[i]}'>${searchHistory[i]}</a>`)
        $("#search-history").append(searchedCityLink);
    }
}

   loadSearchHistory();

if (lastCitySearch != "") {
    cityWeather(lastCitySearch);
}

$("#search").on("click", citySearch);
$("#search-history").on("click", function(event) {

    var prevCity = $(event.target).closest("a").attr("id");

    cityWeather(prevCity);
});