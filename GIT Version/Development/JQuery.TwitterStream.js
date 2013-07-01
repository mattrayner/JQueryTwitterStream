(function($){
    $.fn.extend({ 
        //Plugin Name - twitterStream
        twitterStream: function(options) {
        
            //Settings list and the default values
            var defaults = {
                searchString: "#kentlife",
				numOfTweets: 20,
				resultsType: "mixed",
				title: "Get Social",
				blockedAccounts: [],
				socialDOM: "#main-homepage-social"
            };
            
            //Either set the options to our defaults of overwrite them
            var options = $.extend(defaults, options);
        
			//Set a loading class
			$("#social-tweets").html('<div id="social-tweet-bottomFade"></div>');
			$("#social-tweets").addClass("loading-tweets");
        
			//Use AJAX to query the twitter 1.1 API for our search string
			var request = $.ajax({
			  url: "http://www.kentuniononline.co.uk/projects/twitter/twitterServer.php",
			  type: "GET",
			  data: {q : options.searchString.replace("#", "%23"), count: options.numOfTweets, include_entities: true, result_type: options.resultsType},
			  dataType: "jsonp"
			});
			 
			request.done(function(e) {
				//Using the data returned split out the tweets
				var tweets = e.statuses;
				
				//Create a htmlString which will be written into our DOM element
				var htmlString = "<header>\n	<h1>"+options.title+"</h1>\n	<span>"+options.searchString+'</span>\n</header>\n\n<section id="social-tweets">\n	<div id="social-tweet-bottomFade"></div>';
				htmlString+=generateTweets(tweets);	//Go through all of our tweets and generate their HTML
				htmlString+="</section>";
					
				//Set our HTML
				$(options.socialDOM).html(htmlString)
				
				return this
			});
			 
			request.fail(function(jqXHR, textStatus) {
				console.log("Twitter API connection failed: "+textStatus);
				
				return this
			});
			
			/**
			 * Generate a string of tweet HTML
			 *
			 * @param	Array	Tweets from the Twitter search API
			 **/
			function generateTweets(tweets){
				var tweetHTML="";
				
				//Get out list of blocked accounts
				var blockList=options.blockedAccounts;
				
				//Iterate over each of the tweets in our array and add it to our string
				for(var i=0;i<tweets.length;i++){
					var tweet=tweets[i];						//Get the current working tweet
					var screenName=tweet.user.screen_name;		//What's the username of the tweeter 	@mattrayner
					var name=tweet.user.name;				//What's there actual name 				Matthew Rayner
					var imageURL=tweet.user.profile_image_url;	//What's the tweeter's image url		http://img.twitter.com/abc.png
					var createdAt=tweet.created_at;				//What's the tweet's date stamp	(ms)	Mon Sep 24 03:35:21 +0000 2012
					var text=tweet.text;					//What's the text						I really love cake! #food
					var relT=relTime(createdAt);				//Generate a relative time stamp		1 hour ago
					
					//Iterate over all of the tweets and generate text
					if($.inArray(screenName,blockList)==-1){
						tweetHTML+='<article><div><img src="'+imageURL+'" alt="'+name+'" ></img></div><p><a href="http://www.twitter.com/'+screenName+'">'+name+"</a>: "+text+"</p><footer><p>"+relT+"</p></footer></article>"
					}
				}
				
				return tweetHTML
			}
			
			/**
			 * Take a twitter date string and return a relative time version
			 *
			 * @param	String	Date stamp from a tweet
			 * @return	String	Relative time string
			 **/
			function relTime(dateStamp){
				dateStamp=dateStamp.replace(/(\+[0-9]{4}\s)/ig,"");
				
				var tweetDate=Date.parse(dateStamp);
				
				var nowDate=arguments.length>1?arguments[1]:new Date;
				var r=parseInt((nowDate.getTime()-tweetDate)/1e3);
				
				if(r<60)
					return"less than a minute ago";
				else if(r<120)
					return"about a minute ago";
				else if(r<45*60)
					return parseInt(r/60).toString()+" minutes ago";
				else if(r<90*60||parseInt(r/3600)=="1")
					return"about an hour ago";
				else if(r<24*60*60)
					return"about "+parseInt(r/3600).toString()+" hours ago";
				else if(r<48*60*60)
					return"1 day ago";
				else
					return parseInt(r/86400).toString()+" days ago"
			}
        }
    });
})(jQuery);
function cycleTheHomePage(){
	$("#homepagebanner").children(".killfloat").remove();
	$("#homepagebanner").children(".news_all").remove();
	$("#homepagebanner").cycle({fx:"scrollHorz",timeout:"7000",speed:"800",next:"#bannernext",prev:"#bannerprev"});
	$(".fade").fadeOut();
	if($("#homepagebanner .news_image").length>1){
		$("#bannerwrapper").hover(
			function(){
				$(".fade").fadeIn()
			},
			function(){
				$(".fade").fadeOut()
			}
		);
	}
}
window.onload = function(){
	cycleTheHomePage();
	
	$("#main-homepage-social").twitterStream({searchString: "#kentlife", blockedAccounts: ["jonPT4781","F4LCanterbury","UFreshers","ClubChemistry","AyeJayFreak15", "blaineandersex_", "Bamsy7", "MohonaB"] });
};