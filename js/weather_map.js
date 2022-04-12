$(document).ready(function () {

    console.log('ready');

    //MAP
    mapboxgl.accessToken = MAPBOX_KEY;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 12
    });
    geocode('San Antonio, TX', MAPBOX_KEY).then(function (results) {
        map.setCenter(results)
    });
    //DEFAULT MARKER
    const marker = new mapboxgl.Marker({
        color: "FFFFFF",
        draggable: 'true'
    })
        .setLngLat([-98.4936, 29.4241])
        .addTo(map)
    // DEFAULT CARDS
    $.get("https://api.openweathermap.org/data/2.5/onecall", {
        APPID: OPEN_WEATHER_KEY,
        lat: 29.4241,
        lon: -98.4936,
        exclude: "hourly",
        units: "imperial",
    }).done(function (data) {
        updateCards(data);
    })

    // UPDATING WITH THE MARKER EVERYTIME YOU DRAG IT
    marker.on('dragend', function () {
        $('#forecasts').empty()
        // OPEN WEATHER FORECAST CARDS
        let lnglat = marker.getLngLat()
        console.log(lnglat)
        map.flyTo({
            center: lnglat,
            zoom: 12,
            speed: 1.2,
            curve: 1
        })
        $.get("https://api.openweathermap.org/data/2.5/onecall", {
            APPID: OPEN_WEATHER_KEY,
            lat: lnglat.lat,
            lon: lnglat.lng,
            exclude: "hourly",
            units: "imperial",
        }).done(function (data) {
            updateCards(data);
        });
        console.log('hello?')
    });// END OF MY MARKER DRAG END FUNCTION

    // SEARCH BUTTON FUNCTIONALITY
    $("#searchbtn").click(function () {
        $('#forecasts').empty()
        geocode($('#searchedcity').val(), MAPBOX_KEY).then(function (results) {
            console.log(results);
            marker.setLngLat(results);
            $.get("https://api.openweathermap.org/data/2.5/onecall", {
                APPID: OPEN_WEATHER_KEY,
                lat: results[1],
                lon: results[0],
                exclude: "hourly",
                units: "imperial",
            }).done(function (data) {
                updateCards(data);
            });

            map.flyTo({
                center: results,
                zoom: 12,
                speed: 1.2,
                curve: 1
            })
        })
    })

    //DARK MODE

    $("#darkmode").click(function () {
        console.log('hello');
        $('.card').toggleClass('background-dark text-light')
        $('body').toggleClass('background-dark')
        $('#searchedcity').toggleClass('background-dark')
// console.log(map.getStyle().name)
        if (map.getStyle().name === "Mapbox Light") {
            map.setStyle('mapbox://styles/mapbox/dark-v10')
        } else if (map.getStyle().name === "Mapbox Dark") {
            map.setStyle('mapbox://styles/mapbox/light-v10')
        }
    })


    function updateCards(data) {
        console.log(data)
        for (i = 0; i < 5; i++) {
            // EACH CARD

            let forecastCard = document.createElement("div");
            if (map.getStyle().name === "Mapbox Light") {
                forecastCard.className = "card m-2 p-0 text-center";
            } else if (map.getStyle().name === "Mapbox Dark") {
                forecastCard.className = "background-dark card m-2 p-0 text-center text-light";
            }
            // forecastCard.className = "card m-2 text-center";
            forecastCard.style.width = "18.5%";
            forecastCard.style.float = "left";
            // DATE
            let date = document.createElement("div");
            let dateString = new Date(data.daily[i].dt * 1000).toString().slice(0, 10);
            let dateText = document.createTextNode(dateString);
            date.className = "card-header"
            date.appendChild(dateText);
            //TEMP
            let temp = document.createElement("div");
            let tempText = document.createTextNode(data.daily[i].temp.min + ' / ' + data.daily[i].temp.max);
            temp.appendChild(tempText);
            //ICON
            let img = document.createElement("i")
            let imgcode = data.daily[i].weather[0].icon

            switch (imgcode) {
                case "01d":
                    img.className = "fas fa-sun fa-3x m-3";
                    break;
                case "01n":
                    img.className = "fas fa-sun fa-3x m-3";
                    break;
                case "02d":
                    img.className = "fas fa-cloud-sun fa-3x m-3";
                    break;
                case "02n":
                    img.className = "fas fa-cloud-moon fa-3x m-3";
                    break;
                case "03d":
                case "03n":
                    img.className = "fas fa-cloud fa-3x m-3";
                    break;
                case "04d":
                case "04n":
                    img.className = "fas fa-cloud-meatball fa-3x m-3";
                    break;
                case "09d":
                case "09n":
                    img.className = "fas fa-cloud-showers-heavy fa-3x m-3";
                    break;
                case "10d":
                    img.className = "fas fa-cloud-sun-rain fa-3x m-3";
                    break;
                case "10n":
                    img.className = "fas fa-cloud-moon-rain fa-3x m-3";
                    break;
                case "11d":
                case "11n":
                    img.className = "fas fa-poo-storm fa-3x m-3";
                    break;
                case "13d":
                case "13n":
                    img.className = "fas fa-snowflake fa-3x m-3";
                    break;
                case "50d":
                case "50n":
                    img.className = "fas fa-smog fa-3x m-3";
                    break;
            }


            //DESCRIPTION
            let description = document.createElement("div");
            let descriptionText = document.createTextNode("Description: " + data.daily[i].weather[0].description);
            description.appendChild(descriptionText);
            //HUMIDITY
            let humidity = document.createElement("div");
            let humidityText = document.createTextNode("Humidity: " + data.daily[i].humidity + "%")
            humidity.appendChild(humidityText)
            //WIND
            let wind = document.createElement("div");
            let windText = document.createTextNode("Wind: " + data.daily[i].wind_gust);
            wind.appendChild(windText);
            //PRESSURE
            let pressure = document.createElement("div");
            let pressureText = document.createTextNode("Pressure: " + data.daily[i].pressure);
            pressure.appendChild(pressureText);
            //ADDING EVERYTHING TO THE CARD
            forecastCard.appendChild(date);
            forecastCard.appendChild(temp);
            forecastCard.appendChild(img);
            forecastCard.appendChild(description);
            forecastCard.appendChild(humidity);
            forecastCard.appendChild(wind);
            forecastCard.appendChild(pressure);
            //ADDING CARD TO THE DIV
            $('#forecasts').append(forecastCard);
        } // END OF MY FOR LOOP
    } //END OF FUNCTION

})// END OF MY DOCUMENT READY FUNCTION