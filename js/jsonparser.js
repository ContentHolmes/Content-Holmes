function jsonparse(jsonfile, image){
  JSON.parse(jsonfile, (key, value) => {
    if(key == "text"){
      console.log(key + " - " + value);
      // if(condition to check){
      //   document.getElementById(image).style.visibility = "hidden";
      // }
    }
  });
}
//just a test function
$.getJSON("./../js/sample.json", function(data){
    actualdata = JSON.stringify(data);
    jsonparse(actualdata, "");
});
console.log("hello");
