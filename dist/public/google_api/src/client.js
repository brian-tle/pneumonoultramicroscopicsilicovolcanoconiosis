function createTestMarker(){
  $.ajax({
    url : 'https://sfhacks2019-1551558382883.appspot.com/createTestMarker',
    method : 'GET',
    success : function(data){
      console.log(data);
    },

    error: function(err){
      console.log('Failed');
    }
  });
}

function getAllMarkers(map){
  $.ajax({
    url : 'https://sfhacks2019-1551558382883.appspot.com/getAllMarkers',
    method : 'GET',
    success : function(data){
      data.forEach(marker => {
        markerList.push(new Marker(map, marker.lat, marker.lng, (marker.upvote - marker.downvote) + 30, true, marker.des));
      });
    },

    error: function(err){
      console.log('Failed');
    }
  });
}


function createMarker(lat, lng, des, upvote, downvote) {
  data = { lat: lat, lng: lng, des: des, upvote: upvote, downvote: downvote };
  $.ajax({
    type: 'POST',
    url: "https://sfhacks2019-1551558382883.appspot.com/createMarker",
    async: true,
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {  process_cache_changes(data);  },
    error: function (xhr, ajaxOptions, thrownError) { }
  });
}

function upvoteMarker(lat, lng, val) {
  data = { lat: lat, lng: lng, val: val };
  $.ajax({
    type: 'POST',
    url: "https://sfhacks2019-1551558382883.appspot.com/upvoteMarker",
    async: true,
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {  process_cache_changes(data);  },
    error: function (xhr, ajaxOptions, thrownError) { }
  });
}

function downvoteMarker(lat, lng, val) {
  data = { lat: lat, lng: lng, val: val };
  $.ajax({
    type: 'POST',
    url: "https://sfhacks2019-1551558382883.appspot.com/downvoteMarker",
    async: true,
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {  process_cache_changes(data);  },
    error: function (xhr, ajaxOptions, thrownError) { }
  });
}