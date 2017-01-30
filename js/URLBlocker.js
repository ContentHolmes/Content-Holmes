var bannedElementsArray=[
  "toppornsites",
  "xvideos",
  "pornhub",
  "xhamster",
  "xnxx",
  "youporn",
  "youjizz",
  "hclips",
  "tnaflix",
  "tube8",
  "spankbang",
  "drtuber",
  "spankwire",
  "keezmovies",
  "nuvid",
  "sunporno",
  "mofosex",
  "bravotube",
  "pornhd",
  "eporner",
  "sexvid",
  "xxxbunker",
  "pornhost",
  "thenewporn",
  "freshpornclips",
  "imzog",
  "freesafeporn",
  "alohatube",
  "theporndude",
  "porndreamer",
  "xbabe",
  "updatetube",
  "befuck",
  "pornroxxx",
  "hdmovz",
  "x18",
  "pornmaki",
  "inxporn",
  "wankoz",
  "topfreepornvideos",
  "slutload",
  "proporn",
  "vpornvideos",
  "softcoretube",
  "myxvids",
  "pornicom",
  "dansmovies",
  "wetplace",
  "fuckuh",
  "wankflix",
  "88fuck",
  "fapdu",
  "pervclips",
  "freudbox",
  "pornheed",
  "hdporn",
  "orgasm",
  "pornrabbit",
  "madthumbs",
  "userporn",
  "fux",
  "eroxia",
  "deviantclip",
  "h2porn",
  "porn-wanted",
  "apetube",
  "metaporn",
  "porntitan",
  "tjoob",
  "alotporn",
  "yourlustmovies",
  "elephanttube",
  "pornerbros",
  "tubegalore",
  "pron",
  "pornplanner",
  "mypornbible",
  "badjojo",
  "findtubes",
  "pornmd",
  "nudevista",
  "pornmaxim",
  "adultvideofinder",
  "new.livejasmin",
  "imlive",
  "evilangellive",
  "liveprivates",
  "joyourself",
  "xlovecam",
  "streamate",
  "cams",
  "pornication",
  "delhisexchat",
  "webcams",
  "sexier",
  "privatefeeds",
  "rivcams",
  "camcrush",
  "fantasti",
  "pornxs",
  "watchmygf",
  "youramateurporn",
  "join.thestripperexperience",
  "iknowthatgirl",
  "bigmouthfuls",
  "join.spizoo",
  "daredorm",
  "crazycollegegfs",
  "pervsonpatrol",
  "streetblowjobs",
  "erotica7",
  "sexforums",
  "erooups",
  "imagearn",
  "totallynsfw",
  "anotherpornblog.tumblr",
  "funpic",
  "thongsaroundtheworld",
  "celebuzz",
  "perezhilton",
  "thehollywoodgossip",
  "justjared",
  "laineygossip",
  "hollywoodlife",
  "nakednews",
  "toppornsites",
  "extremetube",
  "bdsmstreak",
  "zzcartoon",
  "hentaihaven",
  "simply-hentai",
  "hentaigasm",
  "fakku",
  "gelbooru",
  "hentaischool",
  "chan.sankakucomplex",
  "hentai4manga",
  "myhentai",
  "justicehentai",
  "lolhentai",
  "hentairules",
  "hentai-foundry",
  "3dbadgirls",
  "efukt",
  "daftporn",
  "uselessjunk",
  "wtfpeople",
  "smutty",
  "punchpin",
  "vintagepinupgirls",
  "lustpin",
  "pornpin",
  "myporngay",
  "zzgays",
  "en.gay-lounge",
  "justusboys",
  "pornolab",
  "iptorrents",
  "pussytorrents",
  "bootytape",
  "pornbits",
  "porn",
  "bestpornstardb",
  "babepedia",
  "kindgirls",
  "nurglesnymphs",
  "thechive",
  "mandatory",
  "ebaumsworld",
  "playindianporn",
  "desikahani",
  "viewdesisex",
  "hotsouthindiansex",
  "watchindianporn",
  "xpaja",
  "lesbian8",
  "avn",
  "maxim",
  "playboy",
  "menshealth",
  "zimbio",
  "69games",
  "playporngames",
  "sexyfuckgames",
  "playforceone",
  "secure.thegfnetwork",
  "rk",
  "mofosnetwork",
  "track.braincash.com",
  "join.teamskeet",
  "join.alljapanesepass",
  "momsbangteens",
  "linkfame",
  "gfrevenge",
  "videosz",
  "digitalplayground",
  "join.wickedpictures",
  "brazzers",
  "enter.brazzersnetwork",
  "twistysnetwork",
  "join.perfectgonzo",
  "bangbrosnetwork",
  "secure.hustler",
  "enter.javhd",
  "join.ddfnetwork",
  "linkfame",
  "join.pornprosnetwork",
  "join.puffynetwork",
  "nubiles-porn",
  "join.allofgfs",
  "best-paypornsites",
  "adultfriendfinder",
  "xxxdating",
  "getiton",
  "nostringsattached",
  "xhookups",
  "passion",
  "hornymatches.com",
  "dirtyrottenwhore",
  "apina",
  "babe-lounge",
  "fuskator",
  "forum.xnxx",
  "the-pork",
  "pornbb",
  "planetsuzy",
  "forumophilia",
  "freeones",
  "phun",
  "forum.oneclickchicks",
  "peachyforum",
  "pornusers.com",
  "actual-porn",
  "freehindisexstories",
  "readindiansexstories",
  "pinkcherryaffiliate",
  "edenfantasys",
  "mediadetective",
  "hide-porn.winsite"
];
var trustedElementsArray=[];
var imagesArray=document.getElementsByTagName("img");
var checkedImagesArray=[];
var hiddenImagesArray=[];
var checkCount=0;
var globalBadCount=0;
var globalGoodCount=0;
var qualifiedImagesArray=[];




var blockedit=false;
console.log("value of blocked it at initialization is: "+blockedit);

function BlockURL(){
  var urlString=getName(document.location.href);
  console.log("message #:"+ urlString);
  
  chrome.storage.local.get(['settings', 'global'], function(items){
    for(var i in bannedElementsArray){
      if(bannedElementsArray[i]==urlString){
        blockedit=true;
        console.log("value of blocked it is: "+blockedit);
        var arr=document.getElementsByTagName('body');
        for(var i in arr){
          arr[i].innerHTML="Not permitted to view this";  
        }
        if(items.global.historyOfBlockedURLS.length<5){
          var obj={"time":new Date(),"URL":document.location.href};
          items.global.historyOfBlockedURLS.push(obj);
          chrome.storage.local.set({ global: items.global });
          //console.log(items.global);
          console.log("From BLOCK URL 1:"+items.global.historyOfBlockedURLS);
        }
        else{
          items.global.historyOfBlockedURLS.shift();
          var obj={"time":new Date(),"URL":document.location.href};
          items.global.historyOfBlockedURLS.push(obj);
          chrome.storage.local.set({ global: items.global });
          //console.log(items.global);
          console.log("From BLOCK URL 2"+items.global.historyOfBlockedURLS);
          // so how do we send data to server
        } 
        break;
      }
    }
  });
  chrome.storage.local.get(['settings','global'],function(items){
    for(var u in items.global.bannedURLs){
      if(items.global.bannedURLs[u]==urlString){
        blockedit=true;
        console.log("value of blocked it is: "+blockedit);
        var arr=document.getElementsByTagName('body');
        for(var i in arr){
          arr[i].innerHTML="Not permitted to view this";  
        }
        if(items.global.historyOfBlockedURLS.length<5){
            var obj={"time":new Date(),"URL":document.location.href};
            items.global.historyOfBlockedURLS.push(obj);
            chrome.storage.local.set({ global: items.global });
            //console.log(items.global);
            console.log("From BLOCK URL 1:"+items.global.historyOfBlockedURLS);
          }
        else{
            items.global.historyOfBlockedURLS.shift();
            var obj={"time":new Date(),"URL":document.location.href};
            items.global.historyOfBlockedURLS.push(obj);
            chrome.storage.local.set({ global: items.global });
            //console.log(items.global);
            console.log("From BLOCK URL 2"+items.global.historyOfBlockedURLS);
            // so how do we send data to server
          } 
        break;
      }
    }
  });
  if(blockedit==false){
    console.log("This log you need to look for");
    console.log("value of blocked it is: "+blockedit);
    checkNudeImages();
    console.log("This is the second message you need to look for");
  }
}

function getName(str) {
  const regex = /\/\/w{0,3}\.?(.*)\.\w{1,4}\/.*/gi;
  str = str +"/";
  var name = regex.exec(str);
  //console.log(name[1]);
  return name[1];
}

function getImageName(str) {
  const regex = /\/\/.{1,3}\.([^\/]*)\.\w{1,4}\//g;
  var name = regex.exec(str);
  return name[1];
}

BlockURL();

//###################################################################################################################



// first check the URL of the image. 
//  first check if the safe search if true of not



function checkNudeImages(){
  for(var k in imagesArray){

    try{var url=getImageName(imagesArray[k].src);}
    catch(err){console.log(err);}
    console.log("URL is:" + url);
    if(checkPresenceInBanned(url)){
      imagesArray[k].style.visibility="hidden";
      console.log("Hid the image: "+imagesArray[k].src);
    }
    else if(!checkPresenceInTrusted(url)){
      if((imagesArray[k].clientWidth>300 || imagesArray[k].clientHeight>300) && checkCount<=10){
        console.log("IMAGE MUST BE CHECKED:\n"+imagesArray[k].src);
        NudeCheck(imagesArray[k]);
        checkCount++;
      }    
    }
  }
}

function NudeCheck(image){
  console.log("yo bro:"+image.src);
  console.log("The URL from Nude CHeck and get name:\n"+getName(image.src));
  var params = {
  // Request parameters
  "visualFeatures": "Adult",
  "language": "en",
  };
  var url = { url : image.src };
  console.log("From Nude Check:\n"+JSON.stringify(url));
  $.ajax({
  url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
  beforeSend: function(xhrObj){
    // Request headers
    xhrObj.setRequestHeader("Content-Type","application/json");
    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","82535cdc5d3849cea09575b48b3b1e98");
  },
  
  type: "POST",
  data: JSON.stringify(url),
  // Request body
  })
  .done(function(data){validateNudeResults(data,image);})
  .fail(function() {
    console.log("error");
  });
}
function validateNudeResults(data,image){
  // if bad -> blur using index increase badcount
  // if good ->increase good count
  // if globalBadCout==5, put it in local sotage usin getName
  // if put in local storage trusted  using getName
  console.log(JSON.stringify(data));
  console.log("image src from validate Nudes:"+image.src);
  if(data.adult.isAdultContent){
    globalBadCount++;
    console.log("hiding image: "+image.src);
    try{
      image.style.visibility="hidden";
    }
    catch(err){
      console.log(err);
    }
  }
  else{
    globalGoodCount++;
    try{
      console.log("visiblising image: "+ image.src);
      image.style.visibility="visible";
    }
    catch(err){
      console.log(err);
    }
  }
  if(globalBadCount==3){
    var bodyArr=document.getElementsByTagName("body");
    for(var x in bodyArr){
      bodyArr[x].innerHTML="Not permitted to view this";
    }     
    chrome.storage.local.get(['settings', 'global'], function(items){
      items.global.bannedURLs.push(getImageName(image.src));
      chrome.storage.local.set({ global: items.global });
      console.log("added a new URL to blocked sites: "+image.src);
      console.log(JSON.stringify(items.global.bannedURLs));
    });
  }
  else if(globalGoodCount==10){
    chrome.storage.local.get(['settings', 'global'], function(items){
      items.global.trustedURLs.push(getImageName(image.src));
      chrome.storage.local.set({ global: items.global });
      console.log("added a new URL in the trusted sites list: "+images.src);
      console.log(JSON.stringify(items.global.trustedURLs));
    });
  }

}

function checkPresenceInBanned(url){
  // take things from chrome local storage
  var str=url;
  var bad=false;
  for(var i in bannedElementsArray){
    if(bannedElementsArray[i]==str){
      bad=true;
      break;
    }
  }
  chrome.storage.local.get(['settings', 'global'], function(items){
    var localBannedArray=items.global.bannedURLs;
    for(var j in localBannedArray){
      console.log("inside step 1");
      if(str==localBannedArray[j]){
        bad=true;
        console.log("inside step 2");
        break;
      }
    }
  });
  console.log("present in bad: "+bad);
  return bad;
}
function checkPresenceInTrusted(url){
  // take things from chrome local storage
  var str=url;
  var good=false;
  for(var i in trustedElementsArray){
    if(trustedElementsArray[i]==str){
      good=true;
      break;
    }
  }
  chrome.storage.local.get(['settings', 'global'], function(items){
    var localTrustedArray=items.global.trustedURLs;
    for(var i in localTrustedArray){
      if(localTrustedArray[i]==str){
        good=true;
        break;
      }
    }
  });
  console.log("present in good: "+good);
  return good; 
}