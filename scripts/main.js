var editor = ace.edit("editor");
editor.setTheme("ace/theme/github");
editor.getSession().setMode("ace/mode/javascript");

var resultElement = document.getElementById('result');
var transformer = new Transform();

function transpile() {
  transformer.read(editor.getSession().getValue());
  transformer.applyTransformations();
  resultElement.innerHTML = transformer.out();
  hljs.highlightBlock(resultElement);
}

transpile();