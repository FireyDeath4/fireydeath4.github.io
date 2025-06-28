import markdownit from
  "https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm";
import linkifyit from
  "https://cdn.jsdelivr.net/npm/linkify-it@5.0.0/+esm";
var markdownToHTML=function(text)
  {return markdownit({linkify:true}).render(text)};
const linkify=linkifyit();
export default{markdownToHTML,linkify}