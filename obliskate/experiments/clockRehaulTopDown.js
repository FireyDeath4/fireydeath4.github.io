var user;
var varLog=[];
var oldDate,newDate=new Date(),testOffset=0;
newDate.getDayOfYear=function(){return getDayOfYear(this)};
newDate.isLeapYear=function(){var year=this.getFullYear();
  return !!(!(year%4)&&(year%100)||!(year%400))};
var oldSector=['<circle r="5" cx="10" cy="10" fill="transparent" stroke-width="10" stroke-dasharray="calc(',
  ' * 31.41592 / 100) 31.41592" transform="rotate(-90) translate(-20)" stroke="hsla(',
  ')"/>'],
sector=['<path stroke="none" fill-rule="evenodd" d="',
   '" fill="hsla(',')"></path>'],
text=['<text x="10" y="13" font-size="8" font-family="monospace" font-weight="bold" text-anchor="middle" text-baseline="middle" stroke="black" stroke-width="0.25" fill="hsl('
  ,')">','</text>'],
dial=['<line x1="','" y1="','" x2="','" y2="',
  '" style="stroke:hsl(',
  ',100%,20%);stroke-width:0.25"/>'];
var dials366=[],dials365=[],dials60=[],dials24=[],
dials20=[],dials12=[],dials7=[],dialsM=[],
dialsF=[dial[0]+(10)+dial[1]+(0)+
  dial[2]+(10)+dial[3]+(3)+dial[4]+"0"+dial[5]],
days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
months=[31,28,31,30,31,30,31,31,30,31,30,31],
monthsAdd=[0,31,59,90,120,151,181,212,243,273,304,334,365],
times=["time","year","month","week","day",
  /*"shift",*/"hour","minute","second"],
separators=["/","/","|","|",":",":",'"'],
clock;
generateDials();
setTimeout(tickRender,1000/user.prefs.FPS);
//setInterval(function(){testOffset+=864000-(Math.random()*864000)},1000/60); 

function tickRender()
  {varLog=[];
  oldDate=newDate;
  newDate=new Date();
  newDate.setTime(newDate.getTime()+testOffset);
  newDate.getDayOfYear=function(){return getDayOfYear(this)};
  newDate.isLeapYear=function(){var year=this.getFullYear();
    return !!(!(year%4)&&(year%100)||!(year%400))};
  //clear out clock HTML
  clock="";
  //clear out dials on new second and add a main dial
  if(newDate.getSeconds()!=oldDate.getSeconds())
    {dialsF=[dial[0]+(10)+dial[1]+(0)+dial[2]+(10)+dial[3]+(3)+dial[4]+(0)+dial[5]]}
  //console.log(dialsF);
  //why is this gosh dang code so long
  dialsF.push(dial[0]+(Math.sin(newDate.getMilliseconds()/500*Math.PI)*9+10)+
  dial[1]+(-Math.cos(newDate.getMilliseconds()/500*Math.PI)*9+10)+
  dial[2]+(Math.sin(newDate.getMilliseconds()/500*Math.PI)*10+10)+
  dial[3]+(-Math.cos(newDate.getMilliseconds()/500*Math.PI)*10+10)+
  dial[4]+(newDate.getMilliseconds()/1000*360)+dial[5]);
  //add SVG elements
  for(run=0;run<times.length;run++){clock+='<svg height="100" width="100" viewBox="0 0 20 20" class="'+
    times[run]+'"/>'+(run==times.length-1?'':'<span class="separator">'+separators[run]+"</span>")}
  $(".clock").html(clock);
  var dateProgs={time:(newDate.getFullYear()+newDate.getDayOfYear()/365)%100/100,
    year:(newDate.getDayOfYear()+newDate.getHours()/24)/365,
    month:(newDate.getDate()-1+newDate.getHours()/24)/31,
    week:(newDate.getDay()+newDate.getHours()/24)/7,
    day:(newDate.getHours()+newDate.getMinutes()/60)/24,
    shift:(newDate.getHours()%12+newDate.getMinutes()/60)/12,
    hour:(newDate.getMinutes()+newDate.getSeconds()/60)/60,
    minute:(newDate.getSeconds()+newDate.getMilliseconds()/1000)/60,
    second:newDate.getMilliseconds()/1000};
  //set inner sector, outer sector, dials and time value
  var temp={time:[drawAngle(0,dateProgs.time*360,10,10,10),
      drawAngle(0,newDate.getFullYear()%100/100*360,10,10,10),
      dials20,
      newDate.getFullYear()],
    year:[drawAngle(0,(newDate.getDayOfYear()+newDate.getHours()/24)/365*360,10,10,10),
      drawAngle(0,lowestNum(monthsAdd,(newDate.getDayOfYear()))/365*360,10,10,10),
      dials365,
      newDate.getMonth()+1],
		month:[drawAngle(0,(newDate.getDate()-1+newDate.getHours()/24)/months[newDate.getMonth()]*360,10,10,10),
      drawAngle(0,(newDate.getDate()-1)/months[newDate.getMonth()]*360,10,10,10),
      dialsM,
      newDate.getDate()],
		week:[drawAngle(0,(newDate.getDay()+(newDate.getHours()/24)+(newDate.getMinutes()/1440))/7*360,10,10,10),
      drawAngle(0,newDate.getDay()/7*360,10,10,10),
      dials7,
      days[newDate.getDay()]],
		day:[drawAngle(0,dateProgs.day*360,10,10,10),
      drawAngle(0,newDate.getHours()/24*360,10,10,10),
      dials24,
      newDate.getHours()],
		hour:[drawAngle(0,dateProgs.hour*360,10,10,10),
      drawAngle(0,newDate.getMinutes()/60*360,10,10,10),
      dials60,
      newDate.getMinutes()],
		minute:[drawAngle(0,dateProgs.minute*360,10,10,10),
      drawAngle(0,newDate.getSeconds()/60*360,10,10,10),
      dials60,
      newDate.getSeconds()],
		second:[drawAngle(0,newDate.getMilliseconds()/1000*360,10,10,10),
      drawAngle(0,oldDate.getMilliseconds()/1000*360,10,10,10),
      dialsF,
      newDate.getMilliseconds()]};
  for(run=0;run<times.length;run++)
    {var out=sector[0]+temp[times[run]][0]+//inner sector
      sector[1]+(dateProgs[times[Math.max(0,run-1)]]*360)+
      ","+(100-(run*10))+"%,"+(run*2+50)+"%,0.5"+sector[2]+
      sector[0]+temp[times[run]][1]+//outer sector
      sector[1]+dateProgs[times[Math.max(0,run-1)]]*360+
      ","+(100-(run*10))+"%,"+(run*2+50)+"%,1"+
      sector[2]+temp[times[run]][2]+
      text[0]+dateProgs[times[run]]*360+//text
      ","+(100-(run*10))+"%,50%"+
      text[1]+temp[times[run]][3]+text[2];
    $("."+times[run]).html(out)}
  varLog.push("<br/>"+newDate.getTime());
  $("[for|='update']").html(user.prefs.FPS+" FPS");
  $("#logger").html(varLog);
  setTimeout(tickRender,1000/user.prefs.FPS);
  //console.log(JSON.stringify(document.activeElement));
  }
            
function generateDials()
  {for(run=0;run<365;run++)
    {if(monthsAdd.includes(run)){dials365.push
      (dial[0]+(Math.sin(run/182.5*Math.PI)*7+10)+
      dial[1]+(-Math.cos(run/182.5*Math.PI)*7+10)+
      dial[2]+(Math.sin(run/182.5*Math.PI)*10+10)+
      dial[3]+(-Math.cos(run/182.5*Math.PI)*10+10)+
      dial[4]+run/365*360+dial[5])}}
  for(run=0;run<20;run++){dials20.push
    (dial[0]+(Math.sin(run/10*Math.PI)*(run%2==0?7:9)+10)+
    dial[1]+(-Math.cos(run/10*Math.PI)*(run%2==0?7:9)+10)+
    dial[2]+(Math.sin(run/10*Math.PI)*10+10)+
    dial[3]+(-Math.cos(run/10*Math.PI)*10+10)+
    dial[4]+run/20*360+dial[5])}
  for(run=0;run<60;run++){dials60.push
    (dial[0]+(Math.sin(run/30*Math.PI)*(run%5==0?7:9)+10)+
    dial[1]+(-Math.cos(run/30*Math.PI)*(run%5==0?7:9)+10)+
    dial[2]+(Math.sin(run/30*Math.PI)*10+10)+
    dial[3]+(-Math.cos(run/30*Math.PI)*10+10)+
    dial[4]+run/60*360+dial[5])}
  for(run=0;run<24;run++){dials24.push
    (dial[0]+(Math.sin(run/12*Math.PI)*(run%3==0?7:9)+10)+
    dial[1]+(-Math.cos(run/12*Math.PI)*(run%3==0?7:9)+10)+
    dial[2]+(Math.sin(run/12*Math.PI)*10+10)+
    dial[3]+(-Math.cos(run/12*Math.PI)*10+10)+
    dial[4]+run/24*360+dial[5])}
  for(run=0;run<24;run++){dials12.push
    (dial[0]+(Math.sin(run/6*Math.PI)*(run%3==0?7:9)+10)+
    dial[1]+(-Math.cos(run/6*Math.PI)*(run%3==0?7:9)+10)+
    dial[2]+(Math.sin(run/6*Math.PI)*10+10)+
    dial[3]+(-Math.cos(run/6*Math.PI)*10+10)+
    dial[4]+run/24*360+dial[5])}
  for(run=0;run<28;run++){dials7.push
    (dial[0]+(Math.sin(run/14*Math.PI)*(run%4==0?7:9)+10)+
    dial[1]+(-Math.cos(run/14*Math.PI)*(run%4==0?7:9)+10)+
    dial[2]+(Math.sin(run/14*Math.PI)*10+10)+
    dial[3]+(-Math.cos(run/14*Math.PI)*10+10)+
    dial[4]+run/28*360+dial[5])}
  for(run=0;run<months[newDate.getMonth()];run++){dialsM.push
    (dial[0]+(Math.sin(run/(months[newDate.getMonth()]/2)*Math.PI)*(run==0||(0-0-((newDate.getDay()+weekOffset(newDate)+run)%7)==0)?7:9)+10)+
    dial[1]+(-Math.cos(run/(months[newDate.getMonth()]/2)*Math.PI)*(run==0||(0-0-((newDate.getDay()+weekOffset(newDate)+run)%7)==0)?7:9)+10)+
    dial[2]+(Math.sin(run/(months[newDate.getMonth()]/2)*Math.PI)*10+10)+
    dial[3]+(-Math.cos(run/(months[newDate.getMonth()]/2)*Math.PI)*10+10)+
    dial[4]+run/months[newDate.getMonth()]*360+dial[5])}}

//Code stolen from here:
//https://codepen.io/massimo-cassandro/pen/rWpEEV

function polarToCartesian(centerX,centerY,radius,angleInDegrees)
	{var angleInRadians=(angleInDegrees-90)*Math.PI/180.0;
	return {x:centerX+(radius*Math.cos(angleInRadians)),
		y:centerY+(radius*Math.sin(angleInRadians))}}

function drawAngle(low,high,cx,cy,radius,thickness)
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

function weekOffset(date)
  {return date.getDate()-date.getDay()%7}
            
function getDayOfYear(date)
  {var now=new Date(date);
  var start=new Date(date.getFullYear(),0,0);
  var diff=(now-start)+((start.getTimezoneOffset()-now.getTimezoneOffset())*60*1000);
  var oneDay=1000*60*60*24;
  return Math.floor(diff/oneDay)}

function lowestNum(array,num)
  {//array.sort((a,b)=>a-b);
  for(run=0;run<array.length;run++)
    {if(array[run]>num){return array[run-1]}}
  return num}