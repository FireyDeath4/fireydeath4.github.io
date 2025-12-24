var messages,$,twemoji;
function loadFile(file)
	{if(!file)return;return $.getJSON(file,function(json){return json})}

function formatText(text)
	{let output=text.split("\n");
	//process start-of-line things first such as headers and lists
	for(let line in output)
		{if(/^### +/.test(newText))
			{newText=newText.replace(/^### +/,"<h3>")+"</h3>"}
		else if(/^## +/.test(newText))
			{newText=newText.replace(/^## +/,"<h2>")+"</h2>"}
		else if(/^# +/.test(newText))
			{newText=newText.replace(/^# +/,"<h1>")+"</h1>"}
		//not dealing with lists now I already kinda want to lie down
		if(newText!==output[line]){output[line]=newText}}
	let format={pending:"",waiting:[]};
	for(const char in output)
		{for(let symbol of ["*","_","~"])
			{if(output[char]===symbol)
				{if(format.pending[0].indexOf(symbol,"")!==-1)
					format.pending+=symbol}
			else{waiting.push({pos:char,format:format.pending});
				format.pending=""}}}
	output+=output.join("<br/>");
	return output}

function expressTime(time)
	{if(time instanceof Date)return time.getHours()+":"+
		time.getMinutes().toString().padStart(2,"0")+":"+
		time.getSeconds().toString().padStart(2,"0")}

function renderChat(chat,targElem)
    {if(targElem?.length>1)return;targElem.empty();
    for(const supercluster of chat)
        {for(const cluster of supercluster.m)
			{targElem.append("<div class='discord-cluster'></div>");
			let firstMsg=true;
			for(const msg of cluster)
				{targElem.children(".discord-cluster").last()
					.append("<div class='discord-message' id='"+msg.id+
						"'></div>");
				let addElem=targElem.children(".discord-cluster").last()
					.children(".discord-message").last(),
					addText=new Date(msg.c);
				if(firstMsg===true){firstMsg=false;
					addElem.html("<div class='discord-avatar'><img src='"+
						context.users[supercluster.a].profileURL+
						"'/></div><div class='discord-message-text'><p class='discord-message-data'><span class='discord-message-author' style='--username-colour:"+
						(context.users?.[supercluster.a]?.colour?
							(context.users[supercluster.a].colour):"e67e22")+
							"'>"+context.users[supercluster.a].username+
						"</span><span class='discord-message-separator'></span><a class='discord-message-timestamp'><time>"+
						addText.toLocaleDateString()+" "+expressTime(addText)+
						"</time></a></p><p class='discord-message-content'></p></div>");
					if(msg?.ry){addElem.prepend("<a href='#"+msg.ry.id+
						"' class='discord-reply'><div class='discord-reply-spine'></div><span class='discord-reply-context'><span class='discord-reply-info'><span class='discord-avatar'>"+
						(msg.ry.a?"<img src='"+
						context.users[msg.ry.a].profileURL+"'/>":
						"<svg role='img' xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='currentColor' d='M0.809739 3.59646L5.12565 0.468433C5.17446 0.431163 5.23323 0.408043 5.2951 0.401763C5.35698 0.395482 5.41943 0.406298 5.4752 0.432954C5.53096 0.45961 5.57776 0.50101 5.61013 0.552343C5.64251 0.603676 5.65914 0.662833 5.6581 0.722939V2.3707C10.3624 2.3707 11.2539 5.52482 11.3991 7.21174C11.4028 7.27916 11.3848 7.34603 11.3474 7.40312C11.3101 7.46021 11.2554 7.50471 11.1908 7.53049C11.1262 7.55626 11.0549 7.56204 10.9868 7.54703C10.9187 7.53201 10.857 7.49695 10.8104 7.44666C8.72224 5.08977 5.6581 5.63359 5.6581 5.63359V7.28135C5.65831 7.34051 5.64141 7.39856 5.60931 7.44894C5.5772 7.49932 5.53117 7.54004 5.4764 7.5665C5.42163 7.59296 5.3603 7.60411 5.29932 7.59869C5.23834 7.59328 5.18014 7.57151 5.13128 7.53585L0.809739 4.40892C0.744492 4.3616 0.691538 4.30026 0.655067 4.22975C0.618596 4.15925 0.599609 4.08151 0.599609 4.00269C0.599609 3.92386 0.618596 3.84612 0.655067 3.77562C0.691538 3.70511 0.744492 3.64377 0.809739 3.59646Z'></path></svg>")+
						"</span>"+
						(msg.ry?.a?("<span class='discord-message-author' style='--username-colour:#"+
						context.users[msg.ry.a].colour+"'>"+
						context.users[msg.ry.a].username+
						"</span>"):"")+
						"<span class='discord-message-content'>"+
						(msg.ry.t??"<em>"+
						(msg.ry?.a?"Click to see attachment":
						"Original message was deleted")+"</em>")+
						"</span></span>"+(msg.ry?.f?
						"<svg role='img' xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24'><path fill='currentColor' fill-rule='evenodd' d='M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Zm13.35 8.13 3.5 4.67c.37.5.02 1.2-.6 1.2H5.81a.75.75 0 0 1-.59-1.22l1.86-2.32a1.5 1.5 0 0 1 2.34 0l.5.64 2.23-2.97a2 2 0 0 1 3.2 0ZM10.2 5.98c.23-.91-.88-1.55-1.55-.9a.93.93 0 0 1-1.3 0c-.67-.65-1.78-.01-1.55.9a.93.93 0 0 1-.65 1.12c-.9.26-.9 1.54 0 1.8.48.14.77.63.65 1.12-.23.91.88 1.55 1.55.9a.93.93 0 0 1 1.3 0c.67.65 1.78.01 1.55-.9a.93.93 0 0 1 .65-1.12c.9-.26.9-1.54 0-1.8a.93.93 0 0 1-.65-1.12Z' clip-rule='evenodd' class=''></path></svg>"
						:"")+"</span></a>")}}
				else{addElem.html
					("<a class='discord-message-timestamp'><time>"+
					expressTime(addText)+
					"</time></a><p class='discord-message-content discord-message-text'></p>")}
				addElem.find("a.discord-message-timestamp").last().attr("href",
					"https://discord.com/channels/878924553290645535/878924553290645538/"+
					msg.id);
				if(msg?.t){addText=msg.t.replaceAll("\n","<br/>");
					if(msg?.e){addText+="<span class='discord-message-timestamp'>(edited at "+
						(msg.e-msg.c<86400000?expressTime(new Date(msg.e)):
						new Date(msg.e).toLocaleDateString())+")</span>"}
					addElem.find(".discord-message-content").last()
						.append(addText)}
				if(msg?.f){addElem.append
						("<div class='discord-message-attachments'></div>");
					for(let file of msg.f)
						{if(file.tp.includes("image"))
							addElem.children(".discord-message-attachments")
							.append("<div class='discord-image-wrapper'>"+
							(file.sp?"<div class='discord-image-spoiler-warning'>SPOILER</div>":"")+
							"<img src='"+file.l+"' title='"+
							file.d/*.replace("'","\\'")*/+
							"' class='discord-image"+
							(file.sp?" discord-image-spoiler":"")+
							"'/></div>")
						else if(file.tp.includes("audio"))
							addElem.children(".discord-message-attachments")
							.append("<div class='discord-audio-wrapper'><div class='discord-audio-metadata'><div class='discord-metadata-content'><a class='discord-metadata-filename' href='"+
							file.l+"'>"+
							file.l.split("/")[file.l.split("/").length-1]+
							"</a><div class='discord-metadata-size'>"+
							(Math.round(file.s/Math.pow(1024,Math.floor(Math.log2(file.s)/10))*100)/100)+" "+["bytes","kiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB","RiB","QiB"][Math.floor(Math.log2(file.s)/10)]+
							"</div></div></div><audio controls class='discord-audio'><source src='"+
							file.l+"'></audio></div>")}}
				if(msg?.em){addElem.append
						("<div class='discord-message-embeds'></div>");
					for(let embed of msg.em)
						{if(embed?.tp==="gifv")
							{addElem.children(".discord-message-embeds")
								.append("<div class='discord-embed discord-image-wrapper'><video autoplay muted loop class='discord-image' src='"+embed.u+"'></video></div>");
							continue}
						if(embed.p.n==="YouTube")
							{addElem.children(".discord-message-embeds")
								.append("<div class='discord-embed'"+
								(embed.c?" style='--embed-colour:"+embed.c+"'":"")+"><div><a href='"+embed.p.l+
								"' class='discord-embed-provider'>"+embed.p.n+
								"</a></div><div><a href='"+embed.a.l+
								"' class='discord-embed-author'>"+embed.a.n+
								"</a></div><div><a href='"+embed.l+
								"' class='discord-embed-title'>"+embed.t+
								"</a></div><div class='discord-embed-content'><iframe src='"+
								embed.u+
								"' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' loading='lazy' allowfullscreen style='width:560px;aspect-ratio:16/9'>I dunno why the iframe isn't showing up (maybe it hasn't loaded yet) but the video is <a href='"+
								embed.l+"'>here</a></iframe></div></div>");
							continue}
						addElem.children(".discord-message-embeds")
								.append("<div class='discord-embed'"+
								(embed.c?" style='--embed-colour:"+embed.c+"'":"")+">"+
								(embed.p?"<div><"+
								(embed.p.l?"a href='"+embed.p.l+"'":"span")+
								" class='discord-embed-provider'>"+embed.p.n+
								"</"+(embed.p.l?"a":"span")+"></div>":"")+
								(embed.a?"<div><"+
								(embed.a.l?"a href='"+embed.a.l+"'":"span")+
								" class='discord-embed-author'>"+embed.a.n+
								"</"+(embed.a.l?"a":"span")+"></div>":"")+
								"<div><a href='"+embed.l+
								"' class='discord-embed-title'>"+embed.t+
								"</a></div>"+
								(embed.d?
								"<div><span class='discord-embed-description'>"+embed.d+"</span></div>":"")+
								(embed.u?
								"<div class='discord-embed-content'><iframe src='"+
								embed.u+
								"' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' loading='lazy' allowfullscreen style='width:560px;aspect-ratio:16/9'>I dunno why the iframe isn't showing up (maybe it hasn't loaded yet) but the video is <a href='"+
								embed.l+"'>here</a></iframe></div>":"")+
								"</div>")}}
				//I love writing maximally jank code
				if(msg?.rs){addElem.append
						("<div class='discord-message-reactions'></div>");
					for(let reaction of msg.rs)
						{addElem.children(".discord-message-reactions")
						.append("<div class='discord-reaction"+
						(reaction.u.includes("227957811579977728")?
						" discord-self-reaction":"")+"'>"+
						reaction.e+"<span class='discord-reaction-count'>"+
						reaction.u.length+"</span></div>")}}}}}
	$(".discord-image-wrapper").on("click",function()
		{if($(this).children(".discord-image-spoiler-warning").length===1)
			{$(this).children(".discord-image-spoiler-warning").remove();
			$(this).children(".discord-image").removeClass
				("discord-image-spoiler")}});
	$(".discord-cluster").each(function(elem)
		{twemoji.parse(this,{ext:".svg",size:"svg"})})}

async function loadAndRender(chat,targElem)
	{context=await loadFile("/discord/archive/context.json");
	messages=await loadFile(chat);
	renderChat(messages,targElem)}

let context=[];
loadAndRender("/discord/archive/chats/hell6.json",$("#discord-conversation"))