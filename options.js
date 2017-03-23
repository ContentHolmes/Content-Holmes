$("#forms").submit(function(e) {
    //content.log("validate form");
    var email = document.getElementById("id").value;
    var password = document.getElementById("pass").value;
    var childName = document.getElementById("childName").value.toLowerCase();
    var sendobj = {
        email: email,
        password: password,
        childName: childName
    }
    $('.loading').addClass('front');
    $.ajax({
            url: "https://contentholmes.com/user/new",
            beforeSend: function(XhrObj) {
                XhrObj.setRequestHeader("Content-Type", "application/json");
            },
            type: "POST",
            data: JSON.stringify(sendobj)
            // Request body
        })
        .done(function(data) {
            var parse = JSON.parse(data);
            //content.log('request data ' + data);
            //content.log('request sent ' + parse.success);
            if (parse.success) {
                //content.log('successful');
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
                window.location = "https://www.google.co.in";
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
