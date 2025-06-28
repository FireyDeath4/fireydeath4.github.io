var user=loadUser();
(function userSetup(){if(!user){user={prefs:{},tasks:[],lists:[]}}
  if(!user?.lists)user.lists=[];
  user.prefs={sysScheme:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",
      scheme:loadUser()?.prefs?.scheme||"sys",
      FPS:loadUser()?.prefs?.FPS||15,
      stick:loadUser()?.prefs?.stick==true,
      monthDisp:loadUser()?.prefs?.monthDisp||1,
      dayShowNum:loadUser()?.prefs?.dayShowNum||false,
      leadHour0s:loadUser()?.prefs?.leadHour0s||false,
      leadMinSec0s:loadUser()?.prefs?.leadMinSec0s||true,
      leadMilSec0s:loadUser()?.prefs?.leadMilSec0s||true};
  applyScheme(user.prefs.scheme);
  $("#scheme").val(user.prefs.scheme);
  $("#update").val(user.prefs.FPS);
  $("#sticky").prop("checked",user.prefs.stick);
  if(user.prefs.stick){$(".clockPanel").prop("style",
      "position:-webkit-sticky;position:sticky")}}());
var varLog=[],devVars={};
var oldDate,newDate,currentTime,testOffset=86400000*0;
refreshNewDate();
var text=['<text x="10" y="13" font-size="8" font-family="monospace" font-weight="bold" text-anchor="middle" text-baseline="middle" stroke="black" stroke-width="0.25" fill="hsl(',')">','</text>'],
dial=['<line x1="','" y1="','" x2="','" y2="','" style="stroke:hsl(',',100%,20%);stroke-width:0.25"/>'];
var dials366=[],dials365=[],dials60=[],dials24=[],
dials20=[],dials12=[],dials7=[],dialsM=[],
dialsF=[dial[0]+(10)+dial[1]+(0)+
  dial[2]+(10)+dial[3]+(3)+dial[4]+"0"+dial[5]],
days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
monthLengths=[31,28,31,30,31,30,31,31,30,31,30,31],
monthsAdd=[0,31,59,90,120,151,181,212,243,273,304,334,365],
times=["year","month","week","day","hour","minute","second","frame"],
timeOperators={year:"FullYear",month:"Month",week:"Date",day:"Day",hour:"Hours",minute:"Minutes",second:"Seconds",frame:"Milliseconds"},
separators=["/","/","|","|",":",":",'"'],
dials={amount:[20,12,function(){},28,24,60,60]}, 
clock={radius:10,padding:4,height:140,outline:0.25,     
//
//You should replace the height with a size multiplier
//
  ratio:function(width,num)
    {return ((this.radius*2+this.padding)*width+this.padding)
      /((this.radius*2+this.padding)*((num||8)/width)+this.padding)}},
clocks=[],selectedClock=[];
createClocks($(".clocks")[0],newDate,"time");
var frames=0;
window.addEventListener("resize",()=>{resizeClocks()});
//var render=setTimeout(tickRender(true),1000/user.prefs.FPS);
//addEventListener("keydown",keyDownEvent);
//Come back later - renderTaskList()//This is only meant for pages that actually have the list on it

/* _____ _      ____   _____ _  __                   CLOCK GENERATION
  / ____| |    / __ \ / ____| |/ /                                   
 | |    | |   | |  | | |    | ' /                                    
 | |    | |   | |  | | |    |  <                                     
 | |____| |___| |__| | |____| . \                                    
  \_____|______\____/ \_____|_|\_\         _______ _____ ____  _   _ 
  / ____|  ____| \ | |  ____|  __ \     /\|__   __|_   _/ __ \| \ | |
 | |  __| |__  |  \| | |__  | |__) |   /  \  | |    | || |  | |  \| |
 | | |_ |  __| | . ` |  __| |  _  /   / /\ \ | |    | || |  | | . ` |
 | |__| | |____| |\  | |____| | \ \  / ____ \| |   _| || |__| | |\  |
  \_____|______|_| \_|______|_|  \_\/_/    \_\_|  |_____\____/|_| \_|*/

//Roles are: time, stopwatch, timer, display
function createClocks(targElem,inDate,role)
  {var classList=$(targElem).attr('class').split(/\s+/);
  clocks.push({});
  var select=clocks.length-1;
  clocks[select].elem=targElem;
  clocks[select].primaryRole=role;
  clocks[select].time=inDate.getTime();
  clocks[select].offset=0;
  if(classList.includes("main"))
    {times.forEach(function(val,run)
        {clocks[select].width=times.length;
        clocks[select][val]={normX:run,normY:0}})}
  if(classList.includes("windowFit"))
    {var temp=[];
    temp[0]=window.innerWidth/window.innerHeight;
    temp[1]=Math.log2(temp[0]);
    temp[2]=[1,2,4,8],temp[3]=[],temp[4]=[];
    temp[2].forEach(num=>temp[3].push(clock.ratio(num)));
    temp[3].forEach(num=>temp[4].push(Math.log2(num)));
    temp[5]=NaN;
    for(run=0;run<temp[4].length;run++)
      {if(!(Math.abs(temp[1]-temp[4][run])>temp[5]))
        {temp[5]=Math.abs(temp[1]-temp[4][run]);temp[6]=run}
      times.forEach(function(val,run)
        {clocks[select].width=temp[2][temp[6]];
        clocks[select][val]={normX:run%temp[2][temp[6]],
          normY:Math.floor(run/temp[2][temp[6]])}})}
    console.log(JSON.stringify(temp))
    }
  return
  /*if(classList.includes("windowFit"))
    {var temp=[];
    temp[0]=window.innerWidth/window.innerHeight;
    temp[1]=Math.log2(temp[0]);
    temp[2]=[1,2,4,8],temp[3]=[],temp[4]=[];
    temp[2].forEach(num=>temp[3].push(clock.ratio(num)));
    temp[3].forEach(num=>temp[4].push(Math.log2(num)));
    temp[5]=NaN;
    for(run=0;run<temp[4].length;run++)
      {if(!(Math.abs(temp[1]-temp[4][run])>temp[5]))
        {temp[5]=Math.abs(temp[1]-temp[4][run]);temp[6]=run}
      times.forEach(function(val,run)
        {clocks[select].width=temp[2][temp[6]];
        clocks[select][val]={normX:run%temp[2][temp[6]],
          normY:Math.floor(run/temp[2][temp[6]])}})}}//that is a REALLY THICC BLOCK
//https://stackoverflow.com/questions/39971246/how-to-display-all-entries-of-an-array-within-chromes-firebugs-and-firefoxs
  Object.keys(clocks[select]).forEach(key=>
    {clocks[select][key].realX=(clock.radius*2+clock.padding)*clocks[select][key].normX+clock.radius+clock.padding;
    clocks[select][key].realY=(clock.radius*2+clock.padding)*clocks[select][key].normY+clock.radius+clock.padding});
  var width=(clock.radius*2+clock.padding)*clocks[select].width+clock.padding,
    height=(clock.radius*2+clock.padding)*(8/clocks[select].width)+clock.padding,
    size=classList.includes("windowFit")?Math.min(window.innerWidth/width,window.innerHeight/height)-1:clock.radius/2;
  console.log(width,height,classList.includes("windowFit"),size,(width*clock.radius/2)/width);
  $(targElem).attr("viewBox","0 0 "+width+" "+height)
    .attr("width",width*size)
    .attr("height",height*size)
    .css("border-radius",(clock.radius+clock.padding)*size);*/
  times.forEach(function(val,run)
    {if(val!="frame")
      {targElem.innerHTML+="<text class='"+times[run]+"-"+times[run+1]
        +" separator display' text-anchor='middle'>"+separators[run]+"</text>";
      $("."+times[run]+"-"+times[run+1]+".separator.display")
        .attr("x",clocks[select][val].realX+clock.radius+(clock.padding/2))
        .attr("y",clocks[select][val].realY+5)
        .attr("font-size",20)
        .attr("font-family","sans-serif")
        .attr("font-weight","bold")
        .attr("fill",(run+1)%clocks[select].width==0?"transparent":"var(--default)")}});
  times.forEach(function(val,run)
    {targElem.innerHTML+="<g class='"+val+"'></g>";
    var timeElem=targElem.querySelector("."+val);
    timeElem.innerHTML+="<path class='"+val
      +" inner sector'></path><path class='"+val+" outer sector'></path>";
    timeElem.innerHTML+="<g class='"+val+" dial'></g>"
    var dialElem=timeElem.querySelector(".dial."+val);
    var span={year:20,month:365+inDate.isLeapYear(),day:28,hour:24,minute:60,second:60,frame:1},
      hili={year:2,day:4,hour:3,minute:5,second:5,frame:1};
    switch(val)
      {case"year":case"day":case"hour":case"minute":case"second":case"frame":
      for(var tick=0;tick<span[val];tick++)
        {createDial(dialElem,[val,"dial",tick],clocks[select][val].realX,clocks[select][val].realY,
          clock.radius,tick/span[val],tick%hili[val]==0?3:1,clock.outline)
          .attr("stroke","hsl("+(360*tick/span[val])+",100%,50%)")}
      break;
      case"month":
      var temp=new Date(inDate);temp.setMonth(0);temp.setDate(1);
      for(var tick=0;tick<span[val];tick++)
        {if(temp.getDate()==1||temp.getDay()==0)
          {createDial(dialElem,[val,"dial",tick],clocks[select][val].realX,clocks[select][val].realY,
            clock.radius,tick/span[val],temp.getDate()==1?3:1,clock.outline)
            .attr("stroke","hsl("+(360*tick/span[val])+",100%,50%)")}
        temp.setDate(temp.getDate()+1)}
      break;case"week":
      var temp=new Date(inDate);temp.setDate(1);
      for(var tick=0;tick<inDate.getMonthLength();tick++)
        {createDial(dialElem,[val,"dial",tick],
          clocks[select][val].realX,clocks[select][val].realY,
          clock.radius,tick/inDate.getMonthLength(),
          tick==0||temp.getDay()==0?3:1,clock.outline)
          .attr("stroke","hsl("+(360*tick/inDate.getMonthLength())+",100%,50%)");
        temp.setDate(temp.getDate()+1)}}
    timeElem.innerHTML+="<text class='"+val+" label' font-family='monospace' font-weight='bold' text-anchor='middle' stroke='black' fill='#FFF'>TEST</text>";
    $("."+val+".label").attr("x",clocks[select][val].realX)
      .attr("y",3+clocks[select][val].realY)
      .attr("font-size",8)
      .attr("stroke-width",clock.outline+"px");
    if(val!="frame")
      {targElem.innerHTML+="<text class='"+times[run]+"-"+times[run+1]+" separator select' text-anchor='middle'>"+separators[run]+"</text>";
      $("."+times[run]+"-"+times[run+1]+".separator.select")
        .attr("x",clocks[select][val].realX+clock.radius+(clock.padding/2))
        .attr("y",clocks[select][val].realY+5)
        .attr("font-size",20)
        .attr("font-family","sans-serif")
        .attr("font-weight","bold")
        .attr("fill","transparent")}
    /*if(val!="year")
      {for(var run2=0;run2<dials.amount[run];run2++)
        {createDial(targElem,val,(clock.radius*2+clock.padding)*run+clock.radius,
      clock.radius,)}}
    else{}*/});  
  //For some reason SVG paths don't appear
  //if you use jQuery to insert them
  $(".sector").attr("stroke","none/*#F00*/")
    .attr("stroke-width",clock.outline+"px")
    .attr("fill-rule","evenodd")
    .attr("fill","#808080")}

function resizeClocks()
  {var list=[];
  clocks.forEach(function(val,run)
    {var classList=$(val.elem).attr('class').split(/\s+/)
    if(classList.includes("windowFit")){list.push(run)}
    /*console.log(classList)*/})
  var temp=[];
  temp[0]=window.innerWidth/window.innerHeight;
  temp[1]=Math.log2(temp[0]);
  temp[2]=[1,2,4,8],temp[3]=[],temp[4]=[];
  temp[2].forEach(num=>temp[3].push(clock.ratio(num)));
  temp[3].forEach(num=>temp[4].push(Math.log2(num)));
  temp[5]=NaN;
  for(run=0;run<temp[4].length;run++)
    {if(!(Math.abs(temp[1]-temp[4][run])>temp[5]))
      {temp[5]=Math.abs(temp[1]-temp[4][run]);temp[6]=run}
  list.forEach(function(select,num)
    {var stop=false;if(clocks[select].width=temp[2][temp[6]]){stop=true}
    var width=(clock.radius*2+clock.padding)*clocks[select].width+clock.padding,
      height=(clock.radius*2+clock.padding)*(8/clocks[select].width)+clock.padding,
      size=Math.min(window.innerWidth/width,window.innerHeight/height)-1,
      stop=false;
    $(clocks[select].elem).attr("viewBox","0 0 "+width+" "+height)
      .attr("width",width*size)
      .attr("height",height*size)
      .css("border-radius",(clock.radius+clock.padding)*size);
    if(stop)return;
    clocks[select].width=temp[2][temp[6]];
    times.forEach(function(val,run)
      {clocks[select][val]={normX:run%temp[2][temp[6]],
        normY:Math.floor(run/temp[2][temp[6]])}});
    Object.keys(clocks[select]).forEach(key=>
      {clocks[select][key].realX=(clock.radius*2+clock.padding)*clocks[select][key].normX+clock.radius+clock.padding;
      clocks[select][key].realY=(clock.radius*2+clock.padding)*clocks[select][key].normY+clock.radius+clock.padding});
    times.forEach(function(val,run)
      {$("line.dial."+val).each(function()
        {var relativePos=$(this).attr("data-relative-pos").split(" ");
        /*if(val=="year")
          {console.log("x1",$(this).attr("x1"));
          console.log("realX",clocks[select][val].realX);
          console.log("data-relative-pos",$(this).attr("data-relative-pos"));
          console.log("relativePos",relativePos)}*/
        $(this).attr("x1",+relativePos[0]+clocks[select][val].realX)
          .attr("y1",+relativePos[1]+clocks[select][val].realY)
          .attr("x2",+relativePos[2]+clocks[select][val].realX)
          .attr("y2",+relativePos[3]+clocks[select][val].realY)});
      $(".label."+val).each(function()
        {$(this).attr("x",clocks[select][val].realX)
          .attr("y",3+clocks[select][val].realY)});
      
      });
    //console.log(width,height,true,size,(width*clock.radius/2)/width);
    })}}

function generateDials(timestamp,type)
  {}

function createDial(targElem,name,cx,cy,radius,angle,length,width)
  {targElem.innerHTML+="<line class='"+name.join(" ")+"'/>"
  var relativePos=[(Math.sin(angle*2*Math.PI)*(radius-length)),
    (-Math.cos(angle*2*Math.PI)*(radius-length)),
    (Math.sin(angle*2*Math.PI)*radius),
    (-Math.cos(angle*2*Math.PI)*radius)];
  return $("."+name.join(".")).attr("stroke-width",width)
    .attr("data-relative-pos",relativePos.join(" "))
    .attr("x1",relativePos[0]+cx)
      .attr("y1",relativePos[1]+cy)
      .attr("x2",relativePos[2]+cx)
      .attr("y2",relativePos[3]+cy)}
//CODE PIECE createDial($(".year.dial")[0],["test"],5,5,2,0.5,1,clock.outline)





/*_    _  _____ ______ _____    _____       _______  USER DATA MANAGEMENT
 | |  | |/ ____|  ____|  __ \  |  __ \   /\|__   __|/\                    
 | |  | | (___ | |__  | |__) | | |  | | /  \  | |  /  \                   
 | |  | |\___ \|  __| |  _  /  | |  | |/ /\ \ | | / /\ \                  
 | |__| |____) | |____| | \ \  | |__| / ____ \| |/ ____ \                 
  \____/|_____/|______|_|  \_\ |_____/_/____\_\_/_/_ __\_\_ _   _ _______ 
 |  \/  |   /\   | \ | |   /\   / ____|  ____|  \/  |  ____| \ | |__   __|
 | \  / |  /  \  |  \| |  /  \ | |  __| |__  | \  / | |__  |  \| |  | |   
 | |\/| | / /\ \ | . ` | / /\ \| | |_ |  __| | |\/| |  __| | . ` |  | |   
 | |  | |/ ____ \| |\  |/ ____ \ |__| | |____| |  | | |____| |\  |  | |   
 |_|  |_/_/    \_\_| \_/_/    \_\_____|______|_|  |_|______|_| \_|  |_|*/                                                                

function saveUser()
  {localStorage.setItem("user",JSON.stringify(user))}

function saveFromInput(input)
  {if(!input)
    {alert("Oh, it's empty.");
    clearStoragePrompt()}
  else{try{JSON.parse(input)}
    catch(err){alert(err.message+
        "\n\nYeah... See if you can do something about that :P");return}
    if(confirm("Load local storage from box and refresh?\n\n"+
        "(Make sure you've backed up your current storage and don't use dodgy JSON!)"))
      {localStorage.setItem
        ("user",JSON.stringify(JSON.parse(input)));
      location.reload()}}}

function clearStoragePrompt()
  {if(confirm("Clear local storage and reset user data?"))
    {if(confirm("Are you sure?"))
      {if(!confirm("Are you　ｄｏｕｂｔｆｕｌ?"))
        {if(!confirm("Alright then..."))
          {alert("Dang, that was close :O")}
        else{localStorage.removeItem("user");
          location.reload()}}}}}

function loadUser()
  {return JSON.parse(localStorage.getItem("user"))}

/*_    _  _____ ______ _____                                  USER PREFERENCES
 | |  | |/ ____|  ____|  __ \                                                 
 | |  | | (___ | |__  | |__) |                                                
 | |  | |\___ \|  __| |  _  /                                                 
 | |__| |____) | |____| | \ \                                                 
  \____/|_____/|______|_|__\_\______ _____  ______ _   _  _____ ______  _____ 
 |  __ \|  __ \|  ____|  ____|  ____|  __ \|  ____| \ | |/ ____|  ____|/ ____|
 | |__) | |__) | |__  | |__  | |__  | |__) | |__  |  \| | |    | |__  | (___  
 |  ___/|  _  /|  __| |  __| |  __| |  _  /|  __| | . ` | |    |  __|  \___ \ 
 | |    | | \ \| |____| |    | |____| | \ \| |____| |\  | |____| |____ ____) |
 |_|    |_|  \_\______|_|    |______|_|  \_\______|_| \_|\_____|______|_____/*/

function applyScheme(scheme)
  {user.prefs.scheme=scheme;saveUser();
  $("body").removeClass(["light","dark"]);
  $("body").addClass(scheme==="sys"?user.prefs.sysScheme:scheme)}

function changeFPS(value)
  {user.prefs.FPS=value;saveUser()}

function toggleStickyClock(value)
  {user.prefs.stick=value;
  $(".clockPanel").prop("style",value?
    "position:-webkit-sticky;position:sticky":"");
  saveUser()}

/*_____       _______ ______                                DATE MANAGEMENT
 |  __ \   /\|__   __|  ____|                                             
 | |  | | /  \  | |  | |__                                                
 | |  | |/ /\ \ | |  |  __|                                               
 | |__| / ____ \| |  | |____                                              
 |_____/_/    \_\_|  |______|    _____ ______ __  __ ______ _   _ _______ 
 |  \/  |   /\   | \ | |   /\   / ____|  ____|  \/  |  ____| \ | |__   __|
 | \  / |  /  \  |  \| |  /  \ | |  __| |__  | \  / | |__  |  \| |  | |   
 | |\/| | / /\ \ | . ` | / /\ \| | |_ |  __| | |\/| |  __| | . ` |  | |   
 | |  | |/ ____ \| |\  |/ ____ \ |__| | |____| |  | | |____| |\  |  | |   
 |_|  |_/_/    \_\_| \_/_/    \_\_____|______|_|  |_|______|_| \_|  |_|*/

function refreshNewDate(shiftOld)
  {if(shiftOld)oldDate=newDate;
  newDate=new Date();
  newDate.setTime(newDate.getTime()+testOffset);
  newDate.getDayOfYear=function(){return getDayOfYear(this)};
  newDate.isLeapYear=function(){return isLeapYear(this)};
  newDate.getWeekOffset=function(){return getWeekOffset(this)};
  newDate.getMonthLength=function(){return getMonthLength(this)}}
function getDayOfYear(date)
  {var now=new Date(date);
  var start=new Date(date.getFullYear(),0,0);
  var diff=(now-start)+((start.getTimezoneOffset()-now.getTimezoneOffset())*60*1000);
  var oneDay=1000*60*60*24;
  return Math.floor(diff/oneDay)}
function isLeapYear(date)
  {var year=date.getFullYear();
  return !!(!(year%4)&&(year%100)||!(year%400))}
function getWeekOffset(date)
  {var copyDate=new Date(date.getTime());
  copyDate.setMonth(0);copyDate.setDate(1);return copyDate.getDay()}
function getMonthLength(date)
  {return monthLengths[date.getMonth()]+(date.isLeapYear()*(date.getMonth()==1))}