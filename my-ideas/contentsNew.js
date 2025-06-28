var headElems=
  $(".container *:is(div,h1,h2,h3,h4,h5,h6)[id]:not([id='titleBar'])"),
  addElem=$("#contents-list");
addElem.html("");
for(run=0;run<headElems.length;run++)
  {$(addElem).append
    ("<li><a href='#"
      +$(headElems[run]).attr("id")
      +"'>"+$(headElems[run]).html()
      +"</a></li>");
  if(run<headElems.length-1)
    {for(var run2=0;run2<(numOfHead(headElems[run+1])-numOfHead(headElems[run]));run2++)
      {$(addElem).append("<ol></ol>");
      addElem=addElem.children().last()}
    for(var run2=0;run2<(numOfHead(headElems[run])-numOfHead(headElems[run+1]));run2++)
      {addElem=addElem.parent()}}}
if(headElems.length>50)
  {$("#contents-list").after("<p>Damn that is a long list :O</p>")}

function numOfHead(elem)
  {if(elem?.tagName.length==2
    &&elem?.tagName[0]=="H")
    return +(elem?.tagName[1])
  else console.error("This doesn't fit the parameters")}

/*function isNumber(value)
    {return /^-?\d*(\.\d+)?$/.test(value)&&(!!value)}

function digitsOf(str)
  {return str.replace(/[^0-9]/g,'')}*/