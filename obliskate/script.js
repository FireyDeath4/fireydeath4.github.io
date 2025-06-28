//https://fredrikaugust.github.io/bulk-renamer/
//https://patorjk.com/software/taag/#p=display&f=Big

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
//3600000=ms in hour
//86400000=ms in day
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
//Roles are: time, stopwatch, timer, display
var frames=0;
var render=setTimeout(tickRender(true),1000/user.prefs.FPS);
addEventListener("keydown",keyDownEvent);

//window.onresize=resizeClocks()
window.addEventListener("resize",()=>{resizeClocks()});

function reportWindowSize()
  {console.log(window.innerWidth/window.innerHeight)}

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
        {clocks[select].width=8;
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
    .css("border-radius",(clock.radius+clock.padding)*size);
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
    timeElem.innerHTML+="<g class='"+val+" dial'></g>";
    var dialElem=timeElem.querySelector(".dial."+val);
    var span={year:20,month:365+inDate.isLeapYear(),day:28,hour:24,minute:60,second:60,frame:1},
      hili={year:2,day:4,hour:3,minute:5,second:5,frame:1};
    switch(val)
      {case"year":case"day":case"hour":case"minute":case"second":case"frame":
      for(var tick=0;tick<span[val];tick++)
        {createDial(dialElem,[val,"dial",tick],clocks[select][val].realX,clocks[select][val].realY,
          clock.radius,tick/span[val],tick%hili[val]==0?3:1,clock.outline)
          .attr("stroke","hsl("+(360*tick/span[val])+",100%,50%)")}
      break;case"month":
      temp=monthsAdd;if(inDate.isLeapYear())
        {for(var item=2;item<temp.length;item++){temp[item]++}}
      for(var tick=0;tick<span[val];tick++)
        {if(temp.includes(tick))
          {createDial(dialElem,[val,"dial",tick],clocks[select][val].realX,clocks[select][val].realY,
            clock.radius,tick/span[val],3,clock.outline)
            .attr("stroke","hsl("+(360*tick/span[val])+",100%,50%)")}
        else if((tick+inDate.getWeekOffset())%7==0)
          //Yes this will make it display correctly
          //I'm not offsetting it to 2023 again to see Sunday January 1
          //Wait look at December OH BLOODY HELL \(-_-)/
          {console.log(tick+1);
          createDial(dialElem,[val,"dial",tick],clocks[select][val].realX,clocks[select][val].realY,
            clock.radius,tick/span[val],1,clock.outline)
            .attr("stroke","hsl("+(360*tick/span[val])+",100%,50%)")}}
      break;case"week":
      for(var tick=0;tick<inDate.getMonthLength();tick++)
        {createDial(dialElem,[val,"dial",tick],
          clocks[select][val].realX,clocks[select][val].realY,
          clock.radius,tick/inDate.getMonthLength(),
          ((tick+inDate.getWeekOffset())%7)*tick?1:3,clock.outline)
          .attr("stroke","hsl("+(360*tick/inDate.getMonthLength())+",100%,50%)")}}
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
      //.attr();  
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

function generateDials(timestamp,type)
  {}

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

//what happens if you add properties to an array js

function tickRender()
  {//frames++;console.log("frame tick");'
  varLog[0]=newDate.getTime();
  varLog[1]=window.innerWidth/window.innerHeight;
  varLog[2]=Math.log2(varLog[1]);
  varLog[3]=[-3,-1,1,3];
  varLog[4]=[];
  for(run=0;run<varLog[3].length;run++){varLog[4][run]=Math.abs(varLog[2]-varLog[3][run])}
  varLog[5]=JSON.stringify(selectedClock);
  varLog[6]=JSON.stringify(clocks[0].selectTime);
  refreshNewDate(true);
  currentTime={year:newDate.getFullYear(),
    month:newDate.getMonth(),
    week:newDate.getDate(),
    day:newDate.getDay(),
    hour:newDate.getHours(),
    minute:newDate.getMinutes(),
    second:newDate.getSeconds(),
    frame:newDate.getMilliseconds(),
    stamp:newDate.getTime()};
  var display=(clocks[0]?.selectTime?.date||newDate),
  dateProgs={year:(newDate.getFullYear()+newDate.getDayOfYear()/(365+newDate.isLeapYear()))%100/100,
    month:(newDate.getDayOfYear()+newDate.getHours()/24)/(365+newDate.isLeapYear()),
    week:(newDate.getDate()-1+newDate.getHours()/24)/newDate.getMonthLength(),
    day:(newDate.getDay()+(newDate.getHours()+newDate.getMinutes()/60)/24)/7,
    hour:(newDate.getHours()+newDate.getMinutes()/60)/24,
    minute:(newDate.getMinutes()+newDate.getSeconds()/60)/60,
    second:(newDate.getSeconds()+newDate.getMilliseconds()/1000)/60,
    frame:newDate.getMilliseconds()/1000},
  intDates={year:newDate.getFullYear()%100/100,
    month:((newDate.getMonth()>1&&newDate.isLeapYear())+monthsAdd[newDate.getMonth()])/(365+newDate.isLeapYear()),
    week:(newDate.getDate()-1)/newDate.getMonthLength(),
    day:newDate.getDay()/7,
    hour:newDate.getHours()/24,
    minute:newDate.getMinutes()/60,
    second:newDate.getSeconds()/60,
    frame:oldDate.getMilliseconds()/1000},
  displayTime={year:display.getFullYear(),
    month:user.prefs.monthDisp==3?months[display.getMonth()]:
      ((display.getMonth()<10&&user.prefs.monthDisp==2?"0":"")+(display.getMonth()+1)),
    week:display.getDate(),
    day:user.prefs.dayShowNum?display.getDay()+1:days[display.getDay()],
    hour:(display.getHours()<10&&user.prefs.leadHour0s?"0":"")+display.getHours(),
    minute:display.getMinutes().toString().padStart(user.prefs.leadMinSec0s?2:1,"0"),
    second:display.getSeconds().toString().padStart(user.prefs.leadMinSec0s?2:1,"0"),
    frame:display.getMilliseconds().toString().padStart(user.prefs.leadMilSec0s?3:1,"0")};
  if(Math.floor(newDate/1000)>oldDate/1000)
    {$("g>line.frame.dial:not(:first-child)").remove()}
  for(var elem=0;elem<clocks.length;elem++)
    {if(clocks[elem].primaryRole=="time"){clocks[elem].time=newDate.getTime()+clocks[elem].offset}
    var targElem=clocks[elem].elem;
    times.forEach(function(val,run)
      {var temp=[clocks[selectedClock[0]]?.selectTime?.[val]||intDates[val]];
      if(val=="week")varLog[7]=temp;
      temp.splice(temp[0]<dateProgs[val],0,dateProgs[val])
      $(targElem).find("."+val+".inner.sector").attr("d",drawAngle(0,temp[1]*360,
          clocks[elem][val].realX,clocks[elem][val].realY,clock.radius))
        .attr("fill","hsla("+(dateProgs[times[Math.max(0,run-1)]]*360)+
          ","+(100-(run*10))+"%,"+(run*2+50)+"%,0.5"+")");
      $(targElem).find("."+val+".outer.sector").attr("d",drawAngle(0,temp[0]*360,
          clocks[elem][val].realX,clocks[elem][val].realY,clock.radius))
        .attr("fill","hsl("+(dateProgs[times[Math.max(0,run-1)]]*360)+
          ","+(100-(run*10))+"%,"+(run*2+50)+"%"+")");
      $(targElem).find("."+val+".label").text(displayTime[val])
        .attr("fill","hsl("+dateProgs[times[run]]*360+","+(100-(run*10))+"%,50%)")});
    createDial($(targElem).find("g.frame.dial")[0],
      ["frame","dial",$("g.frame.dial").children().length],clocks[elem].frame.realX,
      clocks[elem].frame.realY,clock.radius,dateProgs.frame,1,clock.outline)
      .attr("stroke","hsl("+(360*dateProgs.frame)+",100%,50%)")}
  //$(".clocks path").attr("d",drawAngle(0,dateProgs.second*360,10,10,clock.radius));
  //document.getElementsByTagName("path").innerHTML+="";
  $("#logger").html(varLog.join("<br/>"));
  render=setTimeout(tickRender,1000/user.prefs.FPS);}

function drawAngle(low,high,cx,cy,radius,thickness)
  {var start=polarToCartesian(cx,cy,radius,low),
  end=polarToCartesian(cx,cy,radius,high),
  largeArcFlag=(high-low)%360<=180?0:1;
  var path=["M",start.x,start.y,
	  "A",radius,radius,0,largeArcFlag,1,end.x,end.y];
  if(thickness==undefined)
    {path.push("L",cx,cy)}
  else{var stroke=radius-(thickness==undefined?radius:thickness),
    start2=polarToCartesian(cx,cy,stroke,high),
    end2=polarToCartesian(cx,cy,stroke,low);
    path.push("L",start2.x,start2.y,
	    "A",stroke,stroke,0,largeArcFlag,0,end2.x,end2.y)}
  path.push("Z")
  return path.join(" ")}

function drawAngleOld(low,high,cx,cy,radius,thickness)
  {var start=polarToCartesian(cx,cy,radius,high),
  end=polarToCartesian(cx,cy,radius,low),
  largeArcFlag=high-low<=180?"0":"1";
  var path=["M",start.x,start.y,
	  "A",radius,radius,0,largeArcFlag,0,end.x,end.y,
	  "L",cx,cy,"Z"];
  if(thickness!=undefined){var stroke=radius-thickness,
    start2=polarToCartesian(cx,cy,stroke,high),
    end2=polarToCartesian(cx,cy,stroke,low);
    path.push("M",start2.x,start2.y,
	    "A",stroke,stroke,0,largeArcFlag,0,end2.x,end2.y,
	    "L",cx,cy,"Z")}
  return path.join(" ")}
//Code stolen from here:
//https://codepen.io/massimo-cassandro/pen/rWpEEV

function keyDownEvent(key)
  {//console.log(key);
  if(key.code=="Tab")
    {$(selectedClock[1]).attr("id","")
    key.preventDefault();selectedClock[2]=null;
    if(!selectedClock?.[0]){selectedClock[0]=key.shiftKey?clocks.length-1:0}
    else{selectedClock[0]+=(key.shiftKey*2)-1;selectedClock[0]%=clocks.length}
    selectedClock[1]=clocks[selectedClock[0]].elem;
    $(selectedClock[1]).attr("id","selectedClock")}
  if(["ArrowLeft","ArrowRight"].indexOf(key.code)>-1)
    {key.preventDefault();
    if(selectedClock[0]==null)
      {var theClock=null;
      for(run=0;run<clocks.length;run++)
        {var classList=$(clocks[run].elem).attr('class').split(/\s+/);
        theClock=(classList.includes("main")||classList.includes("windowFit"))?run:0}
      selectedClock=[theClock,undefined,key.code=="ArrowRight"?"year":"frame"];
      selectedClock[1]=$(clocks[theClock].elem).children("g."+selectedClock[2])[0]}
    else{console.log($(selectedClock[1]));
      $(selectedClock[1]).attr("id","");
      selectedClock[2]=selectedClock[2]?
        times[(times.indexOf(selectedClock[2])+((key.code=="ArrowRight")*2-1)+times.length)%times.length]:
        key.code=="ArrowRight"?"year":"frame";
      selectedClock[1]=$(clocks[selectedClock[0]].elem).children("g."+selectedClock[2])[0]}
      $(selectedClock[1]).attr("id","selectedClock")}
  if((["ArrowUp","ArrowDown"].indexOf(key.code)>-1)&&($(".clocks.main")[0]==clocks?.[selectedClock[0]]?.elem)&&
    (selectedClock[2]))
    {key.preventDefault();
    //debugger;
    clocks[selectedClock[0]].primaryRole="selector";
    clocks[selectedClock[0]].selectTime||=currentTime;
    clocks[selectedClock[0]].selectTime.date||=new Date(currentTime.stamp);
(function modifyDate()
  {clocks[selectedClock[0]].selectTime[selectedClock[2]]+=((key.code=="ArrowUp")*2-1);
  clocks[selectedClock[0]].selectTime.date["set"+timeOperators[selectedClock[2]]]
    (clocks[selectedClock[0]].selectTime[selectedClock[2]]);
//Top 10 Godawful Code Practices You Have No Idea How To Make Better
  //If No Boilerplate makes a video specifically about this crap,
  //then I will switch to Rust immediately, no questions asked
  times.forEach(run=>clocks[selectedClock[0]].selectTime[run]=
      clocks[selectedClock[0]].selectTime.date["get"+timeOperators[run]]());
  clocks[selectedClock[0]].selectTime.stamp=
    clocks[selectedClock[0]].selectTime.date.getTime();
    console.log(clocks[selectedClock[0]].selectTime)})();
    }
  if((key.code=="Escape")&&selectedClock[1]!=null)
    {$(selectedClock[1]).attr("id","");
    selectedClock[2]=null}
  if(key.code=="KeyC"&&key.ctrlKey&&$(document.activeElement).attr('id')!='dataBox')
    {copyTime(0,key.altKey?5:7)}}

//new Date(-8136499999999)
//https://www.timeanddate.com/date/february-30.html
//Eh Pal

//import{copyTime}from"obliskate/site.js";

/*function whenKeyDown(keyDownEvent)
  {console.log(keyDownEvent);
  var key=keyDownEvent.keyCode;
  if([65,68].includes(key))
    {if(selectedClock==null)
      {var theClock=null;
      for(run=0;run<clocks.length;run++)
        {var classList=$(clocks[run].elem).attr('class').split(/\s+/)
        if(classList.includes("main")||classList.includes("windowFit"))
          theClock=clocks[run].elem}
      if(theClock==null)return;
      selectedClock=[theClock,key==65?"frame":"year"]}}}*/

/*_    _  _____ ______ _____    _____       _______    USER DATA MANAGEMENT
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
  {localStorage.setItem("obliskate",JSON.stringify(user))}

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
        else{localStorage.removeItem("obliskate");
          location.reload()}}}}}

function loadUser()
  {return JSON.parse(localStorage.getItem("obliskate"))}

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
function getMonthLength(date)
  {return monthLengths[date.getMonth()]+(date.isLeapYear()*(date.getMonth()==1))}

/*_______        _____ _  __  _____ _______ ______ __  __TASK ITEM MANAGEMENT
 |__   __|/\    / ____| |/ / |_   _|__   __|  ____|  \/  |                
    | |  /  \  | (___ | ' /    | |    | |  | |__  | \  / |                
    | | / /\ \  \___ \|  <     | |    | |  |  __| | |\/| |                
    | |/ ____ \ ____) | . \   _| |_   | |  | |____| |  | |                
  __|_/_/    \_\_____/|_|\_\ |_____|__|_|__|______|_|__|_|_ _   _ _______ 
 |  \/  |   /\   | \ | |   /\   / ____|  ____|  \/  |  ____| \ | |__   __|
 | \  / |  /  \  |  \| |  /  \ | |  __| |__  | \  / | |__  |  \| |  | |   
 | |\/| | / /\ \ | . ` | / /\ \| | |_ |  __| | |\/| |  __| | . ` |  | |   
 | |  | |/ ____ \| |\  |/ ____ \ |__| | |____| |  | | |____| |\  |  | |   
 |_|  |_/_/    \_\_| \_/_/    \_\_____|______|_|  |_|______|_| \_|  |_|*/

function selectedTasks(temp)
  {temp=[];for(run=0;run<$("tbody[data-selected]").length;run++)
    {temp.push($($("tbody[data-selected]")[run]).attr("data-num"))}
  return temp}

function addTask(name)
  {user.tasks.push({title:name});saveUser();
  $('#taskList').append(new Option(name,user.tasks.length-1));
  putTaskOnTable(name)}

function moveTasks(items,index)
  {var temp=[];for(run=0;run<items.length;run++)
    {temp.push(user.tasks.splice(items[run]-run,1)[0])}
  for(run=0;run<items.length;run++)
    {user.tasks.splice(index+(items[run]-items[0]),0,temp[run])}
  saveUser();renderTaskList()}

function clumpTasks(items)
  {var temp=[];for(run=0;run<items.length;run++)
    {temp.push(user.tasks.splice(items[run]-run,1)[0])}
  for(run=0;run<items.length;run++)
    {user.tasks.splice((1*items[0])+run,0,temp[run])}
  saveUser();renderTaskList()}

function deleteTasks(items)
  {for(run=0;run<items.length;run++)
    {user.tasks.splice(items[run]-run,1)}
  saveUser();renderTaskList()}

function renderTaskList(selected)
  {$("#taskList").empty();
  $("#taskTable tbody").remove();
  for(run=0;run<user.tasks.length;run++)
    {$("#taskTable").append
      ("<tbody title='Task: "+user.tasks[run].title
      +"\nNo description'data-num='"+run
      +"'><tr><td rowspan='2'>"+(run+1)+"</td>"
      +"<td>"+user.tasks[run].title+"</td>"
      +"<td>"+(user.tasks[run]?.depends||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.start||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.expiry||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.priority||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.impact||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.urgency||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.difficulty||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.reqdConds||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.recmdConds||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.duration||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.benefits||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.failure||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.procrast||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.effects||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.nextDate||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.tags||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.creation||"N/A")+"</td>"
      +"<td>"+(user.tasks[run]?.UUID||"N/A")+"</td>"
//yeah yeah I'll fix this later
      +"</tr><tr><td colspan='19'>No description</td></tr></tbody>");
    $("#taskList").append(new Option(user.tasks[run].title,run));
    $("#taskList").children("[value='"+run+"']").attr
      ("title",user.tasks[run].title);
    if((selected||[]).includes(run))
      {$("#taskList option[value="+run+"]").attr("selected","selected")}}
  updateTableClick()}

function updateTableClick()
  {$("tbody").off();
  $("tbody").on("click",function()
    {$(this).attr("data-selected",$(this).attr("data-selected")?null:1)})}

function putTaskOnTable(name)
  {$("#taskTable").append
    ("<tbody title='Task: "+name
    +"\nNo description'data-num='"+(user.tasks.length-1)
    +"'><tr><td rowspan='2'>"+user.tasks.length+"</td>"
    +"<td>"+name+"</td>"
    +"<td>"+(user.tasks[run]?.depends||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.start||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.expiry||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.priority||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.impact||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.urgency||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.difficulty||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.reqdConds||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.recmdConds||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.duration||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.benefits||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.failure||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.procrast||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.effects||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.nextDate||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.tags||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.creation||"N/A")+"</td>"
    +"<td>"+(user.tasks[run]?.UUID||"N/A")+"</td>"
    +"</tr><tr><td colspan='19'>No description</td></tr></tbody>");
  updateTableClick()}

function polarToCartesian(centerX,centerY,radius,degreeAngle)
	{var radianAngle=(degreeAngle-90)*Math.PI/180.0;
	return {x:centerX+(radius*Math.cos(radianAngle)),
		y:centerY+(radius*Math.sin(radianAngle))}}

function copyTime(firstClock,lastClock)
  {var out="";
  for(run=firstClock||0;run<(lastClock+1||times.length);run++)
    {out+=currentTime[times[run]];
    if(run!=(lastClock??times.length-1))out+=separators[run]}
  try{navigator.clipboard.writeText(out)}
  catch(error){alert("It seems like the navigator doesn't have a clipboard property. This would be because the page is using a standard HTTP address (rather than an HTTPS one).\n\n"
      +"Just copy the time from here:\n\n"+out)
    console.log(error)}
  return out}

function lowestNum(array,num)
  {//array.sort((a,b)=>a-b);
  for(run=0;run<array.length;run++)
    {if(array[run]>num){return array[run-1]}}
  return num}

/*function setCookie(cname,cvalue,exdays)
  {const d=new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  let expires="expires="+d.toUTCString();
  document.cookie=cname+"="+cvalue+";"+expires+";path=/"}
//How can I clarify someone's script when I don't even know what it does

function getCookie(cname)
  {let name=cname+"=";
  let decodedCookie=decodeURIComponent(document.cookie);
  let ca=decodedCookie.split(';');
  for(let i=0;i<ca.length;i++)
    {let c=ca[i];
    while(c.charAt(0)==' ')
      {c=c.substring(1)}
    if(c.indexOf(name)==0)
      {return c.substring(name.length, c.length)}}
  return ""}

function checkCookie(cname)
  {alert(JSON.stringify(getCookie(cname)))}*/
                
            /*function whenKeyDown(keyDownEvent)
                {if(keyDownEvent.code=="Backspace"&&document.activeElement.nodeName=="INPUT")
                    {document.activeElement.value=""}}*/
            //why S2JS WHYYYYYYYYY WHAT THE HECK :O
            //silly silly silly :P

function addEvent()
  {}