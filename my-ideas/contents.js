var headElems=
  $(".container *:is(div,h1,h2,h3,h4,h5,h6)[id]:not([id='titleBar'])"),
  addElem=$("#contents-list");
console.log(headElems);
for(run=0;run<headElems.length;run++)
  {if(headElems[run].tagName=="H2")
    addElem=$("#contents-list");
  $(addElem).append
    ("<li><a href='#"
      +$(headElems[run]).attr("id")
      +"'>"+$(headElems[run]).html()
      +"</a></li>");
  if(headElems[run].tagName=="H2")
    {$(addElem).append("<ol></ol>");
    addElem=$("#contents-list>ol:last-child")}}

//Guys, look!

//I did it on a phone :D