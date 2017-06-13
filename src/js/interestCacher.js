var str=document.location.href;
if(str=="smoething something"){
  console.log("interest page found!");

  var flag=false;
  chrome.storage.local.get(['cachedInterests'],function(items){
    if(items.cachedInterests.websearch[0] || items.cachedInterests.images[0] || items.cachedInterests.videos[0]){
      flag=true;
    }
    if(flag==false && ){
      var websearch=[], images=[], videos=[];

      $(function() {
          var params = {
              // Request parameters
              "q":"<%= q1%>",
              "count": "2",
              "offset": "0",
              "mkt": "en-us",
              "safesearch": "Strict"
          };

          $.ajax({
              url: "https://api.cognitive.microsoft.com/bing/v5.0/search?" + $.param(params),
              beforeSend: function(xhrObj){
                  // Request headers
                  xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","f4b31d43688c44d8a13fc369ff774cd7");
              },
              type: "GET"
              // Request body
              //data: "{body}",
          })
          .done(function(data) {
              //console.log(JSON.stringify(data));
              if (data.webPages) {
                  console.log("webpages true");

                  var max = data.webPages.value.length > 2 ? 2 : data.webPages.value.length;

                  for (var i = 0; i < max; i++) {

                      var newData ='<div class="card animated fadeInDown"><a href="'+data.webPages.value[i].contentUrl+'" target="_blank" class="color_inherit"><div class="card-text"><p class="color_inherit">'+data.webPages.value[i].name+'</p></div></a><div class="card-description"><p>'+data.webPages.value[i].snippet+'</p></div></div><br>';
                      var obj={
                        contentUrl:data.webPages.value[i].contentUrl,
                        name:data.webPages.value[i].name,
                        snippet:data.webPages.value[i].snippet
                      };
                      webpages.push(obj);
                      if(i%2==0){
                          document.getElementById("webSearchRow").innerHTML += newData;
                      }
                      else{
                          document.getElementById("webSearchRow1").innerHTML += newData;
                      }

                  }


              } else {
                  //no webpages at all
                  console.log("webpages false");
              }
              if (data.images) {
                  console.log("images true");
                  var max = data.images.value.length > 2 ? 2 : data.images.value.length;
                  for (var i = 0; i < max; i++) {

                      var newData =
                          '<div class="col-sm-4"><div class="card animated fadeInUp"id="card_1"><div class="cross" id="cross_1" onClick="intRemove(this)"><div class="cross-text"><p class="inline">Not Interested</p></div><div class="icon"><p class="inline">X</p> </div></div><div class="card-media"><div style="background-image: url(' +
                          data.images.value[i].thumbnailUrl + ');" class="image-card" id="img_1"></div></div><a href="' + data.images.value[i].contentUrl +
                          '" target="_blank" class="color_inherit" id="title_1"><div class="card-text"><p class="color_inherit">' + data.images.value[i].name + '</p></div></a></div><br></div>';
                      var obj={
                        thumbnailUrl:data.images.value[i].thumbnailUrl,
                        contentUrl:data.images.value[i].contentUrl,
                        name:data.images.value[i].name
                      };
                      images.push(obj);
                      document.getElementById("imagesRow").innerHTML += newData;

                  }
              } else {
                  // no images at all
                  console.log("images false");
              }
              if (data.videos) {
                  console.log("videos true");
                  var max = data.images.value.length > 1 ? 1 : data.images.value.length;
                  for (var i = 0; i < max; i++) {
                      if(data.videos.value[i].publisher[0].name=="YouTube"){
                      var obj={
                        contentUrl=data.videos.value[i].contentUrl;
                      };
                      videos.push(obj);
                      var url=data.videos.value[i].contentUrl;
                      url=url.split("watch?v=")[1];
                      url="http://www.youtube.com/embed/"+url+"?autoplay=0";
                      console.log("url="+url);
                      var newData ='<div class="card animated fadeInRight"><div class="card-media" style="height: auto;"><iframe width="100%" height="270px" src="'+url+'" frameborder="0"></iframe></div><a href="'+data.videos.value[i].contentUrl+'" target="_blank" class="color_inherit"><div class="card-text"><p class="color_inherit">'+data.videos.value[i].name+'</p></div></a><div class="push-top4"></div></div><br>';

                      document.getElementById("videosRow").innerHTML += newData;
                      }
                      else{
                          i--;
                      }
                  }

              } else {
                  console.log("videos false");
              }
             // alert("success");
             chrome.storage.local.get(['cachedInterests'],function(items){
               items.cachedInterests.websearch=websearch;
               items.cachedInterests.images=images;
               items.cachedInterests.videos=videos;
               chrome.storage.local.set({
                 cachedInterests:items.cachedInterests
               });
             });

          })
          .fail(function() {
              alert("error");
          });
      });
    }
    else{
      var websearch, images, videos;
      chrome.local.storage.get(['global'],function(items){
        // declare cachedInterest as an object and rest as arrays inside it.
        websearch=  items.global.cachedInterests.websearch;
        images=     items.global.cachedInterests.images;
        videos=     items.global.cachedInterest.videos;
      });
      if (websearch[0]) {
          console.log("webpages2 true");

          var max = webPages.length > 2 ? 2 : data.length;
          for (var i = 0; i < max; i++) {

              var newData ='<div class="card animated fadeInDown"><a href="'+ webseach[i].contentUrl+'" target="_blank" class="color_inherit"><div class="card-text"><p class="color_inherit">'+ websearch[i].name+'</p></div></a><div class="card-description"><p>'+ websearch[i].snippet+'</p></div></div><br>';
              if(i%2==0){
                  document.getElementById("webSearchRow").innerHTML += newData;
              }
              else{
                  document.getElementById("webSearchRow1").innerHTML += newData;
              }
          }


      } else {
          //no webpages at all
          console.log("webpages2 false");
      }
      if (images[0]) {
          console.log("images2 true");
          var max = images.length > 2 ? 2 : images.length;
          for (var i = 0; i < max; i++) {

              var newData =
                  '<div class="col-sm-4"><div class="card animated fadeInUp"id="card_1"><div class="cross" id="cross_1" onClick="intRemove(this)"><div class="cross-text"><p class="inline">Not Interested</p></div><div class="icon"><p class="inline">X</p> </div></div><div class="card-media"><div style="background-image: url(' +
                  images[i].thumbnailUrl + ');" class="image-card" id="img_1"></div></div><a href="' + images[i].contentUrl +
                  '" target="_blank" class="color_inherit" id="title_1"><div class="card-text"><p class="color_inherit">' + images[i].name + '</p></div></a></div><br></div>';

              document.getElementById("imagesRow").innerHTML += newData;

          }
      } else {
          // no images at all
          console.log("images2 false");
      }
      if (videos[0]) {
          console.log("videos2 true");
          var max = videos.length > 1 ? 1 : videos.length;
          for (var i = 0; i < max; i++) {
              if(videos[i].publisher[0].name=="YouTube"){


              var url=videos[i].contentUrl;
              url=url.split("watch?v=")[1];
              url="http://www.youtube.com/embed/"+url+"?autoplay=0";
              console.log("url="+url);
              var newData ='<div class="card animated fadeInRight"><div class="card-media" style="height: auto;"><iframe width="100%" height="270px" src="'+url+'" frameborder="0"></iframe></div><a href="'+data.videos.value[i].contentUrl+'" target="_blank" class="color_inherit"><div class="card-text"><p class="color_inherit">'+data.videos.value[i].name+'</p></div></a><div class="push-top4"></div></div><br>';

              document.getElementById("videosRow").innerHTML += newData;
              }
              else{
                  i--;
              }
          }

      } else {
          console.log("videos2 false");
      }
    }

  });

}
else{
  console.log("interest page not found ");
}
