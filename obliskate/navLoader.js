var navList;
$.getJSON("/obliskate/navigation.json",function(json)
  {navList=json;
  for(run=0;run<navList.length;run++)
    {$("#navLinks").append("<a>"+navList[run].name+"</a>");
    $("#navLinks>a").last().prop("href","/obliskate"+navList[run].href)}})