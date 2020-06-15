$(document).ready(function(){
  $('.sidenav').sidenav();
  $('.collapsible').collapsible();
  $('.modal').modal();

    if (localStorage.getItem('firstvisit') === null) {
        document.getElementById("license").click();
        localStorage.setItem('firstvisit', 'false');
    }

// Online Check
      if (!navigator.onLine) {
        M.toast({html: 'Du musst online sein um diese app zu benutzen :)'})
      } else {
        M.toast({html: `<span class="material-icons">
wifi
</span> Online check succeeded :)`})
      }



});

function reload() {
  console.log('Loading...');
  M.toast({html: '<span class="material-icons">priority_high</span> Loading... Please wait :)'})
  navigator.geolocation.getCurrentPosition(function(location) {
    const lat = location.coords.latitude;
    const lng = location.coords.longitude;
    var tmpbtn = " ";
    const apiKey = '0acb8f5c-3294-5cee-f000-ed4d460c8747';
    const api = 'https://creativecommons.tankerkoenig.de/json/list.php';
    // using template strings for this
    // TODO: add ? after api

    // console.log(lat, lng, apiKey, api);

      $.ajax({
        url: api,
        data: {
          lat: lat,
          lng: lng,
          rad: 3,
          sort: "price",
          type: "e5",
          apikey: apiKey,
        },
        success: function(response) {
          if (!response.ok) {
            alert(response.message)
          } else {
            $.each(response.stations, function(i, data) {
              console.log(data.id);
                tmpbtn += ('<div class=\"collapsible-header\" id=\"'+data.id+'\" onclick=\'detail('+JSON.stringify(data.id)+')\'><p><i class="material-icons">local_gas_station</i>'+data.brand+'</p></div>');
            });
            $('.canvas').html(tmpbtn);
          }
        }
      });

  });
};

function detail(gpad_id) {
      let apiKey = '0acb8f5c-3294-5cee-f000-ed4d460c8747';
      let apiUrl = "https://creativecommons.tankerkoenig.de/json/detail.php";
      $.ajax({
        url: apiUrl,
        data: {
          id: gpad_id,
          apikey: apiKey,
        },
        success: function(response) {
          if (!response.ok) {
            alert(response.message)
          } else {
            let diesel = response.station.diesel.toFixed(2);
            let superE5 = response.station.e5.toFixed(2);
            let superE10 = response.station.e10.toFixed(2);
            /*
              https://routing.openstreetmap.de/?z=16&center=47.894715%2C10.619241&loc=47.892953%2C10.613823&loc=47.901778%2C10.639684&hl=de&alt=0&srv=1
            */
            $('#'+gpad_id).html(`<div class=collapsible-header><i class="material-icons">local_gas_station</i> ${response.station.brand}: Diesel: ${diesel} € \n Super: ${superE5} € \n E10: ${superE10} \n\n Adresse: ${response.station.street} ${response.station.houseNumber}</div><span onclick="showOnMap(${response.station.lat}, ${response.station.lng})"><span class="material-icons">
directions
</span> Auf OpenStreetMap anzeigen</span>`);
          }
        }
      });

};
function showOnMap(lat, lng) {
  console.log(`${lat}:${lng}`);
  // WARNING: ALPHA CODE TERRITORY
  window.open(`https://routing.openstreetmap.de/?z=16&center=${lat}%2C${lng}&loc=${lat}%2C${lng}&hl=de&alt=0&srv=1`)
};
