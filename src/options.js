$(document).ready(function() {
    chrome.storage.local.get('info', function(item) {
        if (item.info) {
            window.location = "https://www.contentholmes.com/";
        }
    });
});

$("#forms").submit(function(e) {
    //content.log("validate form");
    var email = document.getElementById("id").value;
    var password = document.getElementById("pass").value;
    var childName = document.getElementById("childName").value.toLowerCase();
    var sendobj = {
        email: email,
        password: password,
        childName: childName,
        token: randomString(30)
    }
    $('.loading').addClass('front');
    $.ajax({
            url: "http://localhost:3000/user/new",
            beforeSend: function(XhrObj) {
                XhrObj.setRequestHeader("Content-Type", "application/json");
            },
            type: "POST",
            data: JSON.stringify(sendobj)
            // Request body
        })
        .done(function(data) {
            var parse = JSON.parse(data);



/*
  You have to store this token and all furhter commmunication will hapeen with this token only
*/





            //content.log('request data ' + data);
            //content.log('request sent ' + parse.success);
            if (parse.success) {
                //content.log('successful');
                console.log(parse.token);
                chrome.storage.local.set({
                    "info": {
                        "email": email,
                        "password": password,
                        "childName": childName
                    }
                });
                chrome.runtime.sendMessage({
                    type: "messaging",
                    email: email,
                    childName: childName
                });
                chrome.storage.local.get(['global'], function(items) {
                    items.global.sentimentThings = [];
                    chrome.storage.local.set({
                        global: items.global
                    });
                });
                chrome.runtime.setUninstallURL("https://contentholmes.com/uninstall/?email=" + email + "&childName=" + childName);
                window.alert("Successful Login");
                window.location = "https://www.contentholmes.com/gettingstarted";
            } else {
                var msg = parse.message;
                //content.log('error message is' + msg);
                $('.loading').removeClass('front');
                $("#hidden").css("visibility", "visible");
                $("#error_text").text(msg);
            }
            // //content.log("data sent to server");
        })
        .fail(function() {
            $('.loading').removeClass('front');
            //content.log('error');
            $("#hidden").css("visibility", "visible");
            $("#error_text").text("Server Not Reachable");
            // //content.log("error in request to server");
        });
    e.preventDefault();
});
var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
