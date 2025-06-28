var playlistElem=$(".playlist"),
    listItems=["title","poster","publishTime","addTime","ID"];
playlistElem.empty();
playlistElem.html("<tr><th>Video</th><th>Publisher</th><th>Publish date</th><th>Add date</th><th>ID</th></tr>");
$.each(playlist,function(num,item)
    {var addElem=$("<tr></tr>");
    $.each(listItems,function(run,name)
        {addElem.append("<td>"+item[name]+"</td>")});
    playlistElem.append(addElem)})