var markdownToHTML,linkify,loadChat;
import("/gptchats/importer.js").then((myModule)=>
  {markdownToHTML=myModule.default.markdownToHTML;
  linkify=myModule.default.linkify;
  console.log(getLastSubdir(location.href));
  loadChat("/gptchats/"+getLastSubdir(location.href)
    +"/chat.json","#chatgpt-conversation")})

//https://stackoverflow.com/questions/30863164/extract-urls-directory-from-path-without-file-name-such-as-index-html
/*function getPageName(url)
  {debugger;
  var match=url.match
    (/^(.*)\/([^.]+(\.([^?#]+))+)(\?[^#]*)?(#.*)?$/);
  if(match!==null)
    {const{[1]:dir,[2]:file,[4]:ext}=match;url=dir}
  return url.substring(url.lastIndexOf("/")+1)}*/

function getLastSubdir(url)
  {modURL=url.replace(/[#?].*$/,"");
  var parts=modURL.split("/"),lastSeg=parts.pop();
  if(/\.[^/.]+$/.test(lastSeg)||lastSeg==="")lastSeg=parts.pop();
  return lastSeg}
