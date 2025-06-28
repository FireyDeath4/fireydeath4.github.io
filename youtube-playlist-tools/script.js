/**
 * Sample JavaScript code for youtube.playlists.list
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/code-samples#javascript
 */
var playlistAPIData=[],playlistData=[],gapi;
gapi.load("client:auth2",function()
  {gapi.auth2.init({client_id:"356313565823-nbce13idsqm9q992heo700ikjpris7re.apps.googleusercontent.com"})})

/*function authenticate()
  {return gapi.auth2.getAuthInstance().signIn({scope:
    "https://www.googleapis.com/auth/youtube.readonly"})
    .then(function(){console.log("Sign-in successful")},
      function(err){console.error("Error signing in",err)})}*/

function loadClient(key)
  {gapi.client.setApiKey(key);
  return gapi.client.load("https://www.googleapis.com/"
    +"discovery/v1/apis/youtube/v3/rest")
    .then(function(){console.log("GAPI client loaded for API");
        $("#api-key button").html("Done!");
        collapseAndExpand($("#api-key"),$("#playlist-tools"))},
      function(err){console.error
        ("Error loading GAPI client for API",err)})}

function fetchItems(playlistID,pageToken,cycle=0)
  {if(!pageToken)playlistAPIData=[];
  return gapi.client.youtube.playlistItems.list
    ({"part":["contentDetails","id","snippet","status"],
      "maxResults":50,
      "pageToken":pageToken,
      "playlistId":playlistID})
    .then(function(response)
        {playlistAPIData.push(response.result);
        if(response.result.nextPageToken)
          {if(cycle==100){console.warn("100 pages of 50 items have already been catalogued. Either there is an error in the program, API or database, or YouTube made the playlist length limit over 5000. But I'm gonna stop so this program doesn't chow through hundreds of unnecessary API requests");
          reorganisePlaylist(playlistAPIData)}
          else{fetchItems
            (playlistID,response.result.nextPageToken)}}
        else reorganisePlaylist(playlistAPIData)},
      function(err){console.error("Execute error",err)})}

function reorganisePlaylist(playlist)
  {playlistData=[];
  var thumbSizes=["maxres","standard","high","medium","default"];
  for(var page of playlist)
    {for(var item of page.items)
      {var publishTime=item.contentDetails?.videoPublishedAt,
        maxThumbSize="",
        thumbnails=Object.keys(item.snippet.thumbnails);
      if(publishTime!=undefined)
        publishTime=new Date(publishTime).getTime();
      var maxThumbSize="";
      if(item.snippet?.thumbnails!=undefined){maxThumbSize=
          thumbSizes.find(thumb=>thumbnails.includes(thumb))||
          thumbnails.find(thumb=>!thumbSizes.includes(thumb))}
      playlistData.push
        ({ID:item.contentDetails.videoId,
        title:item.snippet.title,
        poster:item.snippet?.videoOwnerChannelTitle,
        posterID:item.snippet?.videoOwnerChannelId,
        status:item.status.privacyStatus,
        maxThumbSize:maxThumbSize,
        publishTime:publishTime,
        addTime:new Date(item.snippet.publishedAt).getTime()/*,
        description:item.snippet.description*/})}}}

function collapseAndExpand(collapsers,expanders)
  {if(!collapsers)expand(expanders)
  else{$(collapsers).each(function(elem)
        {if($(this).hasClass("collapsible"))
          {$(this).addClass("collapsed")}});
    if(expanders)setTimeout(function()
      {expand(expanders)},650)}}

function expand(expanders)
  {$(expanders).removeClass("collapsed")}