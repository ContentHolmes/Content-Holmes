document.getElementById("myBtn").addEventListener("click", validateForm);

function validateForm() {
    console.log("validate form");
    var email = document.getElementById("id").value;
    var password = document.getElementById("pass").value;
    var childName = document.getElementById("childName").value;
    chrome.storage.local.set({
        "info": {
            "email": email,
            "password": password,
            "childName": childName
        }
    });
    chrome.runtime.setUninstallURL("http://tfoxtrip.com/uninstall/?email=" + email + "&password=" + password + "&childName=" + childName);
}
