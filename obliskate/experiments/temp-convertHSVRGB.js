function convertHSVtoRGB(h,s,v)
  {var hue=h%360;
  var sat=Math.min(100,Math.max(0,s))/100;
  var val=Math.min(100,Math.max(0,v))/100;
  var chr=val*sat;
  var chrContrb=chr*(1-Math.abs((hue/60)%2-1));
  var valChrDiff=val-chr;
  switch(Math.floor(hue/60))
    {case 0:var red=chr, green=chrContrb, blue=0;break;
    case 1:var red=chrContrb, green=chr, blue=0;break;
    case 2:var red=0, green=chr, blue=chrContrb;break;
    case 3:var red=0, green=chrContrb, blue=chr;break;
    case 4:var red=chrContrb, green=0, blue=chr;break;
    case 5:var red=chr, green=0, blue=chrContrb;break}
  red+=valChrDiff;green+=valChrDiff;blue+=valChrDiff;
  red*=255;green*=255;blue*=255;
  return [red,green,blue]}