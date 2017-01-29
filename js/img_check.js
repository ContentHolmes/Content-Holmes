function imagecheck(imageurl, image){
  var params  =  {
    "language" : "unk",
    "detectOrientation" : "true",
  };

  var url = { url : "http://img.tfd.com/cde/_LSYJPG2.JPG" };
  console.log(JSON.stringify(url) );
  console.log(params);

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
        jsonparse(actualdata, image);
  })
  .fail(function(){
    console.log("fail");
  });

  var temp = document.getElementById(image);
  var width = temp.style.width;
  var height = temp.style.height;
  temp.style.width = 400;
  temp.style.height = 400;
  nudecheck(image);
  temp.style.width = width;
  temp.style.height = height;
}

function nudecheck(image){
  // nude.init();
  console.log('initalized');
  nude.load(image);
  nude.scan(function(result){
    if(result == true){
      console.log('nude image');
      document.getElementById(image).style.visibility = "hidden";
    }else{
      console.log('not nude');
      document.getElementById(image).style.visibility = "visible";
    }
  });
}

function testnude(){
  image1 = document.createElement("img");
  document.getElementsByTagName("body")[0].appendChild(image1);
  image1.width = "400";
  image1.height = "400";
  image1.id = "test4";
  image1.style.visibility = "hidden";
  image1.src = "./../js/images/4.jpg";
  console.log(image1.id);
  nudecheck(image1.id);
}

function testimage(){
  image1 = document.createElement("img");
  document.getElementsByTagName("body")[0].appendChild(image1);
  image1.width = "400";
  image1.height = "400";
  image1.id = "test4";
  image1.crossOrigin = "Anonymus";
  // image1.style.visibility = "hidden"
  image1.src = "http://img.tfd.com/cde/_LSYJPG2.JPG";
  console.log(image1.id);
  imagecheck(image1.src, image1.id);
}

// testimage();
// testnude();
