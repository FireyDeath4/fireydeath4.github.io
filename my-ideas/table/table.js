var ideas=collateArrays(JSON.parse(`{"names":["Curriculum rehaul","AI experience curation","Schematic logic-based AI","Obliskate","Arguments Wiki","Optimised conlang","Conversational programming language","r/DollarComparisonsAU","Virtual 4D sensors and motion controls","Voice-controlled cursor","Pet puzzle setup thing","Various ideas for AI projects","Toe-powered controllers","Tongue-powered controllers","Yume Nikki: Travel Guide mod","Yume Nikki: Fuji","Celeste 2","AEWVS: Animosity-Blighted Curriculum","Regimental Chess comeback","VR mathematical realm","Experimental Sonic the Hedgehog simulation fangame with accurate sound dynamics","Jumpman: a silly idea for an Omori AU","Toby Dog fight","Infinite boss fight but it's bullet hell","Imscared Scratch remake","Choo-Choo Charles mod","A Touhou fangame","Hiyori Momose tribute video","Bête Noire VS Skell Ezuom","Nyan Cat VS Tac Nayn remake","Ace Attorney trial for God","Battle of the Mushroom Kingdom","Bad Apple but it's PilotRedSun","Bad Apple but it's Fancy Pants","Animation VS Geometry remake","Bittertooth orchestral remixes","FireyDeath4's Medley","Bad Apple cover","Some mashup ideas","Tee-hee Time black midi","A Guide To Reality For Civilised Individuals","A cartoon series","H4XX0RZ-OS","My videos","FireyDeath4 Talks","Long-running soap opera that slowly devolves into a tragic philosophical meta psychological horror ARG","Truly dynamic music","Chess battle","Story about eternal immortality","A game about paranoia"],"orderNames":["Curriculum","AI experience curation","Schematic AI","Obliskate","Arguments Wiki","Optimised conlang","Conversational programming language","DollarComparisonsAU","Virtual 4D interface","Voice-controlled cursor","Pet puzzle","AI projects","Toe-powered controllers","Tongue-powered controllers","Yume Nikki: Travel Guide mod","Yume Nikki: Fuji","Celeste 2","AEWVS: Animosity-Blighted Curriculum","Regimental Chess","VR mathematical realm","Sonic the Hedgehog simulation fangame","Jumpman","Toby Dog","Infinite bullet hell","Imscared Scratch remake","Choo-Choo Charles mod","Touhou fangame","Hiyori Momose tribute video","Bête Noire VS Skell Ezuom","Nyan Cat VS Tac Nayn remake","Ace Attorney trial for God","Battle of the Mushroom Kingdom","Bad Apple but it's PilotRedSun","Bad Apple but it's Fancy Pants","Animation VS Geometry remake","Bittertooth orchestral remixes","FireyDeath4's Medley","Bad Apple cover","Mashups","Tee-hee Time black midi","A Guide To Reality","Cartoon series","H4XX0RZ-OS","Videos","FireyDeath4 Talks","Soap opera","Dynamic music","Chess battle","Eternal immortality","Paranoia game"],"types":["System","System","System","System","System","System","System","System","System","System","System","System","System","System","Fangame","Fangame","Fangame","Fangame","Fangame","Fangame","Fangame","Fangame","Fangame","Fangame","Fangame","Fangame","Fangame","Video/fanimation","Video/fanimation","Video/fanimation","Video/fanimation","Video/fanimation","Video/fanimation","Video/fanimation","Video/fanimation","Music remix","Music remix","Music remix","Music mashup","Music remix","Miscellaneous creative project","Miscellaneous creative project","Miscellaneous creative project","Miscellaneous creative project","Miscellaneous creative project","Miscellaneous creative project","Miscellaneous creative project","Miscellaneous creative project","Miscellaneous creative project","Miscellaneous creative project"],"indivImpactScopes":["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],"broadImpactScopes":["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],"devScopes":["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],"complexityRanks":["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],"devProgs":["0","0","0","5%","5%","0","0","0","0","0","0","0","0","0","0","2‰","0","1‰","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1%","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],"conceptRanks":["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],"collated":false}`),["name","orderName","type","conceptRank","devProg","complexityRank","devScope","indivImpactScope","broadImpactScope"],["names","orderNames","types","conceptRanks","devProgs","complexityRanks","devScopes","indivImpactScopes","broadImpactScopes"]);
//myList=uncollateArray(ideas,["name","orderName","type","conceptRank","devProg","complexityRank","devScope","impactScope"],["names","orderNames","types","conceptRanks","devProgs","complexityRanks","devScopes","impactScopes"])
var addElem=$("#the-table");
for(var run=0;run<ideas.length;run++)
  {$("#the-table>tbody").append("<tr></tr>");
  var props=["name","type","conceptRank","devProg","complexityRank","devScope","indivImpactScope","broadImpactScope"];
  addElem=$("#the-table tr").last();
  for(var prop of props)
    {$(addElem).append("<td>"+(ideas[run][prop]||"undefined")+"</td>")}}

function collateArrays(arrays,singleNames,pluralNames)
  {var outArray=[],name;
  for(var prop in arrays)
    {if(prop=="collated")break;
    name=singleNames?.[pluralNames?.indexOf(prop)]||prop;
    for(var run=0;run<arrays[prop].length;run++)
      {outArray[run]??={};
      outArray[run][name]=arrays[prop][run]}}
  outArray.collated=true;
  return outArray}

//collateArrays({foos:[0,1,2],bars:[3,4,5]},["foo","bar"],["foos","bars"]);
//uncollateArray([{foo:0,bar:3},{foo:1,bar:4},{foo:2,bar:5}],["foo","bar"],["foos","bars"])
  
function uncollateArray(array,singleNames,pluralNames)
  {var outObject={},name;
  for(var run=0;run<array.length;run++)
    {for(var prop in array[run])
      {if(prop=="collated")break;
      name=pluralNames?.[singleNames?.indexOf(prop)]||prop;
      outObject[name]??=[];
      outObject[name][run]=array[run][prop]}}
  outObject.collated=false;
  return outObject}