let apiKey = '08977aa39193a995a23d906d8a27f8dc77ac8805';
let search = document.getElementById('search');
let city = document.getElementById('city');
let pm = document.getElementById('pm');
let aqi = document.getElementById('aqi');
let info = document.getElementById('info');

/* Map */
const map = L.map('mapid', 14);

const showMap = (lat, lng) => {
  const icon = L.icon({
    iconUrl: './icons/icon-location.svg',
    iconSize: [30, 40],
    iconAnchor: [20, 25],
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.setView([lat, lng], 14);
  L.marker([lat, lng], { icon: icon }).addTo(map);
};

/* Input */
search.onclick = function () {
  let location = document.getElementById('input').value;
  let url = 'https://api.waqi.info/feed/' + location + '/?token=' + apiKey;
  axios.get(url).then((response) => {

    // City
    if (response.data.data.city === undefined) {
      city.innerHTML = 'Sorry, we didn\'t find your city!';
    } else if (response.data.data.city.name !== undefined) {
      let city_name = response.data.data.city.name;
      city.innerHTML = city_name;
    }

    // Dati
    if (response.data.data.iaqi === undefined) {
      pm.innerHTML = 'no city, no pm';
      aqi.innerHTML = 'no pm, no aqi';
      info.innerHTML = 'no aqi, no info';
    }

    if (response.data.data.iaqi.pm25 === undefined) {
      pm.innerHTML = 'no city, no pm';
    } else if (response.data.data.iaqi.pm25.v !== undefined) {
      let fine_dust = response.data.data.iaqi.pm25.v;
      pm.innerHTML = fine_dust;
    }

    let air_quality = response.data.data.aqi;
    aqi.innerHTML = air_quality;
    let good = 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
    let moderate = 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
    let unhealty_sensitive = 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
    let unhealthy = 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.';
    let very_unhealthy = 'Health alert: The risk of health effects is increased for everyone.';
    let hazardous = 'Health warning of emergency conditions: everyone is more likely to be affected.';

    if (air_quality <= 50) {
      info.innerHTML = good;
      aqi.style.backgroundColor = '#019701';
    } else if (air_quality > 50 && air_quality <= 100) {
      info.innerHTML = moderate;
      aqi.style.backgroundColor = '#ffee00';
    } else if (air_quality > 100 && air_quality <= 150) {
      info.innerHTML = mid;
      aqi.style.backgroundColor = '#f08903';
    } else if (air_quality > 150 && air_quality <= 200) {
      info.innerHTML = unhealthy;
      aqi.style.backgroundColor = '#f30b3d';
    } else if (air_quality > 200 && air_quality <= 300) {
      info.innerHTML = very_unhealthy;
      aqi.style.backgroundColor = '#790d79';
    } else if (air_quality > 300) {
      info.innerHTML = poison;
      aqi.style.backgroundColor = '#8d0909';
    }

    let lat = response.data.data.city.geo[0];
    let lng = response.data.data.city.geo[1];
    showMap(lat, lng);
  });
};

showMap(41.9109, 12.4818); // Rome Map