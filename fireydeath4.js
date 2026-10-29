const externalLinkIcon="<svg class='solid-colour-icon' fill='none' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><path d='M 18 5 L 18 7 L 23.5625 7 L 11.28125 19.28125 L 12.71875 20.71875 L 25 8.4375 L 25 14 L 27 14 L 27 5 Z M 5 9 L 5 27 L 23 27 L 23 14 L 21 16 L 21 25 L 7 25 L 7 11 L 16 11 L 18 9 Z' fill='currentColor'/></svg>",
	protologisms={"bulk":"A 4D measure of space/capacity, succeeding volume, area, length and vertex-count",
		"ditalluric":"Attempting to be exceptionally powerful, but is ultimately impotent",
		"exteger":"A number that is not an integer (a whole one)",
		"flune":"A space with four spatial dimensions",
		"flunes":"Spaces with four spatial dimensions",
		"monotemponians":"Native inhabitants of universes with one time-dimension",
		//"realm":"May refer to a space with three spatial dimensions, succeeding planes and lines. Obviously annoying for reading about other types of realms but there you go",
		"realmic":"Pertaining to a realm, usually as a space with three spatial dimensions, succeeding planes and lines",
		"surcell":"A 3D manifold (usually a boundary of a 4D object), succeeding surfaces, edges and vertices",
		"surcells":"3D manifolds (usually boundaries of 4D objects), succeeding surfaces, edges and vertices",
		"tetronian":"A native inhabitant of 4D space",
		"trionian":"A native inhabitant of 3D space",
		"ous":"Us, including you",
		"weu":"We, including you",
		/*"weu'd":"We'd, and also you'd",
		"weu'll":"We'll, and also you'll",
		"weu're":"We're, and also you're",*/
		"wour":"Our, including your",
		"wourselves":"Myself/ourselves, and also yoursel{f/ves}"};
//Try to include only unobvious ones that may be hard to find on Google
//Please send feedback if any of these seem patronising
	//or there are words missing
	//that you couldn't understand, figure out or find online

let links=document.querySelectorAll
	(":not(.youtube-comment-data,.discord-message-content,.discord-embed>div)>a");
for(let link of links)
	{if(link.getAttribute("href")&&URL.canParse(link.getAttribute("href")))
		link.insertAdjacentHTML("beforeend",externalLinkIcon)}

//const escapedWord=wordToWrap.replace(/[-\/\\^\$*+?.()|[\]{}]/g,'\\$&');
const regex=new RegExp("\\b("+
	Object.keys(protologisms).join("|")+")\\b","gi");
const textNodes=[],walk=document.createTreeWalker
	(document.querySelector(".container"),NodeFilter.SHOW_TEXT, 
	{acceptNode:(node)=>{const parentTag=node.parentNode.tagName;
			return ["SCRIPT","STYLE","ABBR","A","H1","H2","H3","H4","H5","H6"]
				.includes(parentTag)?
				NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
while(walk.nextNode()){if(regex.test(walk.currentNode.nodeValue))
		textNodes.push(walk.currentNode);regex.lastIndex=0}
textNodes.forEach(node=>{const parent=node.parentNode;
	const matches=[...node.nodeValue.matchAll(regex)];
	for(let run=matches.length-1;run>=0;run--)
		{const match=matches[run],matchedText=match[0],
			matchNode=node.splitText(match.index);
		matchNode.splitText(matchedText.length);
		const wrapper=document.createElement("abbr");
		wrapper.textContent=matchedText;
		wrapper.setAttribute("title",protologisms[matchedText]);
		parent.replaceChild(wrapper,matchNode)}});

let addElem=document.querySelector("#contents-list");
if(addElem!==null)
	{let headElems=document.querySelectorAll
		(".container *:is(div,h1,h2,h3,h4,h5,h6)[id]:not([id='titleBar'])");
	addElem.textContent="";
	for(run=0;run<headElems.length;run++)
		{let linkElem=document.createElement("a");
		linkElem.setAttribute("href","#"+headElems[run].getAttribute("id"));
		linkElem.append(headElems[run].textContent);
		listElem=document.createElement("li");
		listElem.append(linkElem);addElem.append(listElem);
		if(run<headElems.length-1)
			{for(let run2=0;run2<(numOfHead(headElems[run+1])-numOfHead(headElems[run]));run2++)
				{addElem.append(document.createElement("ol"));
				addElem=addElem.lastElementChild}
			for(let run2=0;run2<(numOfHead(headElems[run])-numOfHead(headElems[run+1]));run2++)
				{addElem=addElem.parentElement}}}
	if(headElems.length>50)document.querySelector("#contents-list").after
		(document.createElement("p").textContent
			("Damn that is a long list :O"))}

function numOfHead(elem)
	{if(elem?.tagName.length==2
		&&elem?.tagName[0]=="H")
		return +(elem?.tagName[1])
	else console.error("This doesn't fit the parameters")}

/*function isNumber(value)
		{return /^-?\d*(\.\d+)?$/.test(value)&&(!!value)}

function digitsOf(str)
	{return str.replace(/[^0-9]/g,'')}*/