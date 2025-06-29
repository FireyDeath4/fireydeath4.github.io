var markdownToHTML,linkify,loadChat;
import("/gptchats/importer.js").then((myModule)=>
  {markdownToHTML=myModule.default.markdownToHTML;
  linkify=myModule.default.linkify;
  console.log(getPageName(location.href));
  loadChat("/gptchats/"+getPageName(location.href)
    +"/chat.json","#chatgpt-conversation")})

function getPageName(url)
  {debugger;
  // (anything) (slash) (single path component) (slash) (optional 'index.html') (optional query and fragment)
  // this matches /gptchats/spam/ and /gptchats/spam/index.html (plus an optional bit after ? or #)
  // /gptchats/spam is redirected to /gptchats/spam/
  var match=url.match(/^.*\/([^/]+)\/(index\.html)?([?#].*)?/);
  if(match!==null)
    {const{[1]:dir,[2]:file,[4]:ext}=match;url=dir}
  return url.substring(url.lastIndexOf("/")+1)}
