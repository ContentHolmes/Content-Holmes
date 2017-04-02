function BlockURL() {
    /*
          WORKING OF THIS FUNCTION:
          1. Get the settings and global elements from chrome local storage
                for all the elements in bannedElementsArray, check if any of the string matches the "urlString".
                  If "yes":
                    set blocked it to true ,
                    block the page cause its a porn site,
                    send the blocked site url to the server for storing the data,
                  (TO DO)  put the URL in the bannedurls array in global items
                    Break out of the loop
          2. Check the presence of urlstring in dyanmic array stored locally in chrome : bannedURLs
            if "yes" block it.
          3. Check if the child's parent has blocked any site explicitly
    */

    var urlString = getName(document.location.href);
    //console.log('url string' + urlString);
    var blockedit = false; var i;
    for(i=0;i<urlString.length&&!blockedit;i++) {
        // console.log("checking");
        blockedit = checkPresenceInTrusted(urlString[i]);
    }
    if (blockedit) {
        //console.log('trust');
        document.getElementsByTagName('body')[0].style.visibility = 'visible';
        return;
    } else {
        //console.log('nudecheck');
        checkNudeImages();
    }
}

function getName(str) {
    if(str.indexOf("//")!=-1) {
        str = str.substring(str.indexOf("//")+2);
    }
    const regex = /w{0,3}\.?(.*)\.\w{1,4}\/.*/gi;
    newstr = str + "/";
    var name = regex.exec(newstr);
    if(name) {
        return name[1].split(".");
    } else {
        return [str]
    }
}