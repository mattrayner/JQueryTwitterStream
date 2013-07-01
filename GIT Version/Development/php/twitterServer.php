<?php
/**
 * Kent Union Twitter O-Auth - uses TwitterAPI by J7mbo https://github.com/J7mbo/twitter-api-php
 **/
require_once('libs/TwitterAPIExchange.php');

header('content-type: application/json; charset=utf-8');	//We are outputting JSON for the Jquery front end

if(isset($_GET['q']) && $_GET['q'] != null){	//Make sure that the query has been set (you can't search for nothing!)
	
	//TwitterAPI settings
	$settings = array(
	    'oauth_access_token' => "YOURS",
	    'oauth_access_token_secret' => "YOURS",
	    'consumer_key' => "YOURS",
	    'consumer_secret' => "YOURS"
	);
	
	//Which URL are qe querying?
	$url = 'https://api.twitter.com/1.1/search/tweets.json';
	
	//Set the fields that should be appended to our url
	$getfield = '?q='.$_GET['q'];
	
	//Iterate over each of the queries and add them if they are set (they should be)
	if(isset($_GET['count']))
		$getfield .= '&count='.$_GET['count'];
		
	if(isset($_GET['include_entities']))
		$getfield .= '&include_entities='.$_GET['include_entities'];
		
	if(isset($_GET['result_type']))
		$getfield .= '&result_type='.$_GET['result_type'];
	
	//It's geing to be done via GET
	$requestMethod = 'GET';
	
	//Actually perform the query
	$twitter = new TwitterAPIExchange($settings);
	$response = $twitter->setGetfield($getfield)
	                    ->buildOauth($url, $requestMethod)
	                   ->performRequest();
	
	

	//JSON if no callback is set
	if( ! isset($_GET['callback']))
    	exit($response);

	//JSONP if a valid callback is set
	if(is_valid_callback($_GET['callback']))
    	exit("{$_GET['callback']}($response)");
}

//All else fails, bad request
header('status: 400 Bad Request', true, 400);

/**
 * If JSONP is being used make sure that the callback is a valid JSONP callback
 **/
function is_valid_callback($subject)
{
    $identifier_syntax
      = '/^[$_\p{L}][$_\p{L}\p{Mn}\p{Mc}\p{Nd}\p{Pc}\x{200C}\x{200D}]*+$/u';

    $reserved_words = array('break', 'do', 'instanceof', 'typeof', 'case',
      'else', 'new', 'var', 'catch', 'finally', 'return', 'void', 'continue', 
      'for', 'switch', 'while', 'debugger', 'function', 'this', 'with', 
      'default', 'if', 'throw', 'delete', 'in', 'try', 'class', 'enum', 
      'extends', 'super', 'const', 'export', 'import', 'implements', 'let', 
      'private', 'public', 'yield', 'interface', 'package', 'protected', 
      'static', 'null', 'true', 'false');

    return preg_match($identifier_syntax, $subject)
        && ! in_array(mb_strtolower($subject, 'UTF-8'), $reserved_words);
}
?>