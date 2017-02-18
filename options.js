document.getElementById("myBtn").addEventListener("click", validateForm);

function validateForm() {
    console.log("fdsafdfdasfdsafdfdsafdasfdsafdsfdasfadsfafdsfdsa");
    chrome.storage.local.set({
        "info": {
            "email": document.getElementById("id").value,
            "password": document.getElementById("pass").value,
            "childName": document.getElementById("childName").value
        }
    });

}
