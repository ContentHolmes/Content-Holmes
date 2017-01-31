$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});


$('#forms').submit(function(ev) {
    ev.preventDefault(); // to stop the form from submitting
    console.log("here too");
    chrome.storage.sync.set({
	 	login: document.getElementById("id").value
	 }, function() {
	 	console.log("saved");
	 })
    this.submit(); // If all the validations succeeded
});
console.log("running");