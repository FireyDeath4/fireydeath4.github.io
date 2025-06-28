var user//referenced in saveUser()

export function loadUser()
  {return JSON.parse(localStorage.getItem("user"))}

export function saveUser()
  {localStorage.setItem("user",JSON.stringify(user))}

export function saveFromInput(input)
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

export function clearStoragePrompt()
  {if(confirm("Clear local storage and reset user data?"))
    {if(confirm("Are you sure?"))
      {if(!confirm("Are you　ｄｏｕｂｔｆｕｌ?"))
        {if(!confirm("Alright then..."))
          {alert("Dang, that was close :O")}
        else{localStorage.removeItem("user");
          location.reload()}}}}}