$("#forms").submit(function(e) {
    console.log("validate form");
    var email = document.getElementById("id").value;
    var password = document.getElementById("pass").value;
    var childName = document.getElementById("childName").value;
    var sendobj = {
        email: email,
        password: password,
        childName: childName
    }
    $.ajax({
            url: "http://tfoxtrip.com/user/new",
            beforeSend: function(XhrObj) {
                XhrObj.setRequestHeader("Content-Type", "application/json");
            },
            type: "POST",
            data: JSON.stringify(sendobj)
            // Request body
        })
        .done(function(data) {
            var parse = JSON.parse(data);
            console.log('request data ' + data);
            console.log('request sent ' + parse.success);
            if (parse.success) {
                console.log('successful');
                chrome.storage.local.set({
                    "info": {
                        "email": email,
                        "password": password,
                        "childName": childName
                    }
                });
                chrome.runtime.setUninstallURL("http://tfoxtrip.com/uninstall/?email=" + email + "&childName=" + childName);
                window.location = "https://www.google.co.in";
            } else {
                var msg = parse.message;
                console.log('error message is' + msg);
                $("#hidden").css("visibility", "visible");
                $("#error_text").text(msg);
            }
            // console.log("data sent to server");
        })
        .fail(function() {
            console.log('error');
            // console.log("error in request to server");
        });
    e.preventDefault();
});
