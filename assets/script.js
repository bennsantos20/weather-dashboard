$(function () {
    const daysOfForecast = 5;
    var searchHistory = [];
    const apiKey = "31582d61efa9c65005afcaa92f09e717";
    const input = $("#city-input");
    var cityName;
    var todaysDate = moment().format("D MMMM YYYY");
    var inputSwitch;
    var listCity;
    if (localStorage.getItem("Weather search history")) {
      var arrayFromStorage = localStorage
        .getItem("Weather search history")
        .split(",");
    } else {
      var arrayFromStorage;
    }

    $("#search-btn").on("click", function () {
      event.preventDefault();
  
      if (input.val() === "") {
        return;
      } else {
        inputSwitch = true;
        showWeather();
      }
    });
  
    $("#clear-btn").on("click", function () {
      console.log("clear");
      localStorage.removeItem("Weather search history");
      location.reload();
    });
  
    $(document).on("click", ".list-group-item", function () {
      inputSwitch = false;
      listCity = $(this).text();
      showWeather();
    });
   
    function onLoad() {
      $("#search-history-items").empty();
  
      if (arrayFromStorage) {
        searchHistory = arrayFromStorage;
      }
  
      for (let i = 0; i < searchHistory.length; i++) {
        var aSearchTerm = $("<li>").text(searchHistory[i]);
        aSearchTerm.addClass("list-group-item");
        $("#search-history-items").prepend(aSearchTerm);
      }
    }
    onLoad();
  
    function showWeather() {
      event.preventDefault();
  
      if (inputSwitch) {
        cityName = input.val();
      } else {
        cityName = listCity;
      }
  
        
   