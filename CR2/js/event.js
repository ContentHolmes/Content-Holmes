chrome.management.onDisabled.addListener(function(details){
    if(details.name=="Content Rectifier 2"){
        console.log("Content Rectifier 2 was disabled");
        var sendObj={"email":"email@gmail.com","childName":"Name of the child"};
        $.ajax({
                url: "http://tfoxtrip.com/appDisabled",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                type: "POST",
                data: JSON.stringify(sendObj),
            })
            .done(function(data){

            })
            .fail(function(){
                console.log("diabled get route request failed");
            });
    }    
        
});