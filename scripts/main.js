// var editor = ace.edit("editor");
// editor.setTheme("ace/theme/github");
// editor.getSession().setMode("ace/mode/javascript");

var result = document.getElementById('result'),
    source = document.getElementById('source');
var transformer = new Transform();

function transpile() {
  transformer.read(source.textContent);
  transformer.applyTransformations();
  result.innerHTML = transformer.out();
  // hljs.highlightBlock(result);
}

var timeout = false;
source.addEventListener('keyup', function(e) {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(function() {
    transpile();
    timeout = false;
  }, 500);
});

transpile();