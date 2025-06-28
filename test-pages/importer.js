import markdownit from
  "https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm";
var markdownToHTML=function(text)
  {return markdownit().render(text)};
export default {markdownToHTML}