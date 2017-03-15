/*
This contains OCR at the most preliminary stage
*/



function imagecheck(imageurl){
  var params  =  {
    "language" : "unk",
    "detectOrientation" : "true",
  };

  var url = { url : imageurl };
  // console.log(JSON.stringify(url) );
  // console.log(params);

  $.ajax({
    url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr?" + $.param(params),
    beforeSend: function(xhrObj){
      xhrObj.setRequestHeader("Content-Type","application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "82535cdc5d3849cea09575b48b3b1e98");
    },
    data: JSON.stringify(url),
    type: "POST",
  })
  .done(function(data){
    console.log("success");
    // parsing the data
    actualdata = JSON.stringify(data);
    parseText(actualdata);
  })
  .fail(function(){
    console.log("fail");
  });

  var params = {
    // Request parameters
    "visualFeatures": "Adult",
    "language": "en",
  };

  $.ajax({
    url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
    beforeSend: function(xhrObj){
      // Request headers
      xhrObj.setRequestHeader("Content-Type","application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","82535cdc5d3849cea09575b48b3b1e98");
    },
    type: "POST",
    // Request body
    data: JSON.stringify(url),
  })
  .done(function(data) {
    console.log("success");
    //sucess
    actualdata = JSON.stringify(data);
    parseAdult(actualdata);
  })
  .fail(function() {
    console.log("error");
  });
}

imagecheck("http://www.fullredneck.com/wp-content/uploads/2016/04/Funny-Russia-Meme-20.jpg");
