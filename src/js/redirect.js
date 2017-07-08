$(document).ready(function() {
    // //console.log('ready');
    chrome.storage.local.get(['settings', 'global'], function(items) {
        var interests = items.global.interests;
        chrome.storage.local.get('info', function(item) {
            // ////console.log(item.info);
            if (!item.info) {
              //console.log("there you go 2");
              setTimeout(function() {
                  // //console.log('ya');
                  window.location = "https://www.google.co.in";
              }, 2000);
            }
            else{
              //console.log("there you go 1");
              //console.log("here are my interest ="+JSON.stringify(interests));
              if (interests.length >= 3) {
                //console.log("there you go 3");
                  var int1 = interests[interests.length - 1].trim().replace(" ", "+");
                  var int2 = interests[interests.length - 2].trim().replace(" ", "+");
                  var int3 = interests[interests.length - 3].trim().replace(" ", "+");
                  setTimeout(function() {
                      // //console.log('ya');
                      window.location = "https://www.contentholmes.com/search/?q1=" + int1 + "&q2=" + int2 + "&q3=" + int3+"&email="+item.info.email;
                  }, 2000);
              }
              else{
                setTimeout(function() {
                    // //console.log('ya');
                    window.location = "https://www.google.co.in";
                }, 2000);
              }
            }
        });

    });
});
