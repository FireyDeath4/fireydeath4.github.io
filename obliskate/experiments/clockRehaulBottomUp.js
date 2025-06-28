//https://fredrikaugust.github.io/bulk-renamer/
//https://patorjk.com/software/taag/#p=display&f=Big

var user;
var varLog=[];
var oldDate,newDate,testOffset=86400000*0;
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
separators=["/","/","|","|",":",":",'"'],
dials={amount:[20,12,function(){},28,24,60,60]},
clock={radius:5,padding:2,height:140,dialWidth:0.125},
clocks=[],clockDisp=[];
createClocks($(".clocks")[0],newDate);
var frames=0;
var render=setTimeout(tickRender(true),1000/user.prefs.FPS);

function createClocks(targElem,inDate)
  {var width=(clock.radius*2+clock.padding)*times.length+clock.padding,
    height=(clock.radius+clock.padding)*2;
  $(targElem).attr("viewBox","0 0 "+width+" "+height)
    .attr("width",width/height*clock.height)
    .attr("height",clock.height)
    .css("border-radius",clock.height/2);
  var classList=$(targElem).attr('class').split(/\s+/);
  clocks.push({});///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // You will have to fix all the code from here
  var select=clocks.length-1;
   
  clocks[select].elem=targElem;
  if(classList.includes("main"))
    {times.forEach(function(val,run)
        {clocks[select][val]={normX:run,normY:0}})}
  Object.keys(clocks[select]).forEach(key=>
    {clocks[select][key].realX=(clock.radius*2+clock.padding)*clocks[select][key].normX+clock.radius+clock.padding;
    clocks[select][key].realY=(clock.radius*2+clock.padding)*clocks[select][key].normY+clock.radius+clock.padding;
    console.log(clocks[select][key])});
  console.log(clocks);///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  separators.forEach(function(val,run)
    {targElem.innerHTML+="<text class='"+times[run]+"-"+times[run+1]+" separator display' text-anchor='middle'>"+val+"</text>";
    $("."+times[run]+"-"+times[run+1]+".separator.display")
      .attr("x",(clock.radius*2+clock.padding)*(run+1)+(clock.padding/2))
      .attr("y",clock.radius+clock.padding+2.5)
      .attr("font-size",10)
      .attr("font-family","sans-serif")
      .attr("font-weight","bold")
      .attr("fill","var(--default)")});
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
          clock.radius,tick/span[val],tick%hili[val]==0?1.5:0.5,clock.dialWidth)
          .attr("stroke","hsl("+(360*tick/span[val])+",100%,50%)")}
      break;case"month":
      for(var tick=0;tick<span[val];tick++)
        {if(monthsAdd.includes(tick-((tick>32)*inDate.isLeapYear())))
          {createDial(dialElem,[val,"dial",tick],clocks[select][val].realX,clocks[select][val].realY,
            clock.radius,tick/span[val],1.5,clock.dialWidth)
            .attr("stroke","hsl("+(360*tick/span[val])+",100%,50%)")}
        else if((tick+inDate.getWeekOffset()-1)%7==0)
          {createDial(dialElem,[val,"dial",tick],clocks[select][val].realX,clocks[select][val].realY,
            clock.radius,tick/span[val],0.5,clock.dialWidth)
            .attr("stroke","hsl("+(360*tick/span[val])+",100%,50%)")}}
      break;case"week":
      for(var tick=0;tick<inDate.getMonthLength();tick++)
        {createDial(dialElem,[val,"dial",tick],
          (clock.radius*2+clock.padding)*run+clock.radius+clock.padding,
          clock.radius+clock.padding,clock.radius,tick/inDate.getMonthLength(),
          ((tick+inDate.getWeekOffset())%7)*tick?0.5:1.5,clock.dialWidth)
          .attr("stroke","hsl("+(360*tick/inDate.getMonthLength())+",100%,50%)")}}
    timeElem.innerHTML+="<text class='"+val+" label' font-family='monospace' font-weight='bold' text-anchor='middle' stroke='black' fill='#FFF'>TEST</text>";
    $("."+val+".label").attr("x",(clock.radius*2+clock.padding)*run+clock.radius+clock.padding)
      .attr("y",6.5+clock.padding)
      .attr("font-size",4)
      .attr("stroke-width",clock.dialWidth+"px");
    if(val!="frame")
      {targElem.innerHTML+="<text class='"+times[run]+"-"+times[run+1]+" separator select' text-anchor='middle'>"+separators[run]+"</text>";
      $("."+times[run]+"-"+times[run+1]+".separator.select")
        .attr("x",clocks[select][val].realX+clock.radius+(clock.padding/2))
        .attr("y",clocks[select][val].realY+2.5)
        .attr("font-size",10)
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
    .attr("stroke-width",clock.dialWidth+"px")
    .attr("fill-rule","evenodd")
    .attr("fill","#808080")}

function createDial(targElem,name,cx,cy,radius,angle,length,width)
  {targElem.innerHTML+="<line class='"+name.join(" ")+"'/>"
  return $("."+name.join(".")).attr("stroke-width",width)
    .attr("x1",(Math.sin(angle*2*Math.PI)*(radius-length))+cx)
      .attr("y1",(-Math.cos(angle*2*Math.PI)*(radius-length))+cy)
      .attr("x2",(Math.sin(angle*2*Math.PI)*radius)+cx)
      .attr("y2",(-Math.cos(angle*2*Math.PI)*radius)+cy)}
//CODE PIECE createDial($(".year.dial")[0],["test"],5,5,2,0.5,1,clock.dialWidth)

/*function createDial
  (targElem,name,cx,cy,radius,angle,length)
  {targElem.innerHTML+="<line class='"+name+" dial "+run+"'/>";
    $("."+name+".dial."+run).attr("stroke","#808080")
      .attr("stroke-width",clock.dialWidth+"px")
      .attr("x1",(Math.sin(angle*2*Math.PI)*(radius-length))+cx)
      .attr("y1",(-Math.cos(angle*2*Math.PI)*(radius-length))+cy)
      .attr("x2",(Math.sin(angle*2*Math.PI)*radius)+cx)
      .attr("y2",(-Math.cos(angle*2*Math.PI)*radius)+cy)
      .attr("stroke","hsl("+(angle*360)+",100%,20%)")}*/

function tickRender()
  {//frames++;console.log("frame tick");
  oldDate=newDate;
  refreshNewDate();
  var dateProgs={year:(newDate.getFullYear()+newDate.getDayOfYear()/365)%100/100,
    month:(newDate.getDayOfYear()+newDate.getHours()/24)/365,
    week:(newDate.getDate()-1+newDate.getHours()/24)/31,
    day:(newDate.getDay()+(newDate.getHours()+newDate.getMinutes()/60)/24)/7,
    hour:(newDate.getHours()+newDate.getMinutes()/60)/24,
    minute:(newDate.getMinutes()+newDate.getSeconds()/60)/60,
    second:(newDate.getSeconds()+newDate.getMilliseconds()/1000)/60,
    frame:newDate.getMilliseconds()/1000},
  intDates={year:newDate.getFullYear()%100/100,
    month:lowestNum(monthsAdd,(newDate.getDayOfYear()))/365,
    week:(newDate.getDate()-1)/newDate.getMonthLength(),
    day:newDate.getDay()/7,
    hour:newDate.getHours()/24,
    minute:newDate.getMinutes()/60,
    second:newDate.getSeconds()/60,
    frame:oldDate.getMilliseconds()/1000},
  lab={year:newDate.getFullYear(),
    month:user.prefs.monthDisp==3?months[newDate.getMonth()]:
      ((newDate.getMonth()<10&&user.prefs.monthDisp==2?"0":"")+(newDate.getMonth()+1)),
    week:newDate.getDate(),
    day:user.prefs.dayShowNum?newDate.getDay()+1:days[newDate.getDay()],
    hour:(newDate.getHours()<10&&user.prefs.leadHour0s?"0":"")+newDate.getHours(),
    minute:newDate.getMinutes().toString().padStart(user.prefs.leadMinSec0s?2:1,"0"),
    second:newDate.getSeconds().toString().padStart(user.prefs.leadMinSec0s?2:1,"0"),
    frame:newDate.getMilliseconds().toString().padStart(user.prefs.leadMilSec0s?3:1,"0")};
  if(Math.floor(newDate/1000)>oldDate/1000)
    {$("g>line.frame.dial:not(:first-child)").remove()}
  for(var elem=0;elem<clocks.length;elem++)
    {var targElem=clocks[elem].elem;
    times.forEach(function(val,run)
      {$(targElem).find("."+val+".inner.sector").attr("d",drawAngle(0,dateProgs[val]*360,
          clocks[elem][val].realX,clocks[elem][val].realY,clock.radius))
        .attr("fill","hsla("+(dateProgs[times[Math.max(0,run-1)]]*360)+
          ","+(100-(run*10))+"%,"+(run*2+50)+"%,0.5"+")");
      $(targElem).find("."+val+".outer.sector").attr("d",drawAngle(0,intDates[val]*360,
          clocks[elem][val].realX,clocks[elem][val].realY,clock.radius))
        .attr("fill","hsl("+(dateProgs[times[Math.max(0,run-1)]]*360)+
          ","+(100-(run*10))+"%,"+(run*2+50)+"%"+")");
      $(targElem).find("."+val+".label").text(lab[val])
        .attr("fill","hsl("+dateProgs[times[run]]*360+","+(100-(run*10))+"%,50%)")});
    createDial($(targElem).find("g.frame.dial")[0],
      ["frame","dial",$("g.frame.dial").children().length],clocks[elem].frame.realX,
      clocks[elem].frame.realY,clock.radius,dateProgs.frame,0.5,clock.dialWidth)
      .attr("stroke","hsl("+(360*dateProgs.frame)+",100%,50%)")}
  //$(".clocks path").attr("d",drawAngle(0,dateProgs.second*360,10,10,clock.radius));
  //document.getElementsByTagName("path").innerHTML+="";
  render=setTimeout(tickRender,1000/user.prefs.FPS);}

function refreshNewDate()
  {newDate=new Date();
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
  copyDate.setDate(1);return copyDate.getDay()}
function getMonthLength(date)
  {return monthLengths[date.getMonth()]+(date.isLeapYear()*(date.getMonth()==1))}

function polarToCartesian(centerX,centerY,radius,angleInDegrees)
	{var angleInRadians=(angleInDegrees-90)*Math.PI/180.0;
	return {x:centerX+(radius*Math.cos(angleInRadians)),
		y:centerY+(radius*Math.sin(angleInRadians))}}

function drawAngle(low,high,cx,cy,radius,thickness)
  {var start=polarToCartesian(cx,cy,radius,low),
  end=polarToCartesian(cx,cy,radius,high),
  largeArcFlag=(high-low)%360<=180?"0":"1";
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

function lowestNum(array,num)
  {//array.sort((a,b)=>a-b);
  for(run=0;run<array.length;run++)
    {if(array[run]>num){return array[run-1]}}
  return num}

/*function setDynamicInterval(func,time)
  {func();
  setTimeout(setDynamicInterval(func,time),time)}

function clearDynamicInterval(func)
  {func=undefined}*/