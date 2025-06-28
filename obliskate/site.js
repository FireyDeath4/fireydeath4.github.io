//var times,separators,currentTime;
//How does this even help??????
//These aren't mentioned anywhere else in this script...
var user=loadUser();
if(!user){user={prefs:{},tasks:[],lists:[]}}
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
    "position:-webkit-sticky;position:sticky")}
renderTaskList()//This is only meant for pages that actually have the list on it

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

function loadUser()
  {return JSON.parse(localStorage.getItem("user"))}

function clearStoragePrompt()
  {if(confirm("Clear local storage and reset user data?"))
    {if(confirm("Are you sure?"))
      {if(!confirm("Are you　ｄｏｕｂｔｆｕｌ?"))
        {if(!confirm("Alright then..."))
          {alert("Dang, that was close :O")}
        else{localStorage.removeItem("user");
          location.reload()}}}}}

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