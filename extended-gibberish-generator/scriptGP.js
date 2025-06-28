if(window.addEventListener)
    {window.addEventListener("load",doLoad)}
else if(window.attachEvent)
    {window.attachEvent("onload",doLoad)}
else if(window.onLoad)
    {window.onload=doLoad}

function doLoad()
    {var form=document.form;
    generate_input(form);
    generate_gibberish(form)}

function generate_gibberish(form)
    {form.outtext.value="";
    str=form.intext.value+" ";
    nchars=str.length;
    str=str+str;
    for(i=0;i<form.level.length;i++)
        {if(form.level[i].checked)
            {lev=parseInt(form.level[i].value)}}
    if(nchars<lev)
        {alert("Too few input characters.");return}
    for(i=0;i<1000;i++)
        {ichar=Math.floor(nchars*Math.random());
        chr=str.charAt(ichar);
        if((chr>="A")&&(chr<="Z"))
            break}
    form.outtext.value=form.outtext.value+str.substring(ichar,ichar+lev);
    target=str.substring(ichar+1,ichar+lev);
    for(i=0;i<500;i++)
        {if(lev==1)
            {chr=str.charAt(Math.floor(nchars*Math.random()))}
        else{nmatches=0;j=-1;while(true)
                {j=str.indexOf(target,j+1)
                if((j<0)||(j>=nchars)){break}
                else{nmatches++}}
            imatch=Math.floor(nmatches*Math.random());
            nmatches=0;j=-1;while(true)
                {j = str.indexOf(target, j + 1)
                if((j<0)||(j>=nchars)){break}
                else if(imatch==nmatches)
                    {chr=str.charAt(j+lev-1);break}
                else{nmatches++}}}
        form.outtext.value=form.outtext.value+chr;
        if(lev>1){target=target.substring(1,lev-1)+chr}}}

function generate_input(form)
    {clear_all(form)
    form.outtext.value=""}

function clear_all(form)
    {form.Samples.value="-";
    form.intext.value="";
    form.outtext.value=""}