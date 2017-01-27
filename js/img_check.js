function imagecheck(imageurl, image){
  var params  =  {
    "language" : "en",
    "detectOrientation" : "true",
  };

  var body = {
    "url" : imageurl,
  }

  $.ajax({
    url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr?" + $.param(params),
    beforeSend: function(xhrObj){
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "{%subscription key%}");
    },
    type : "POST",
    data : $.param(body),
  })
  .done(function(data){
        console.log("success");
        // parsing the data
        // actualdata = JSON.stringify(data);
        // jsonparse(actualdata, image);
  })
  .fail(function(){
    alert("fail");
  });
}
