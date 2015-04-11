var editor = ace.edit("editor");
editor.setTheme("ace/theme/github");
editor.getSession().setMode("ace/mode/javascript");

var resultElement = document.getElementById('result');
var transformer = new Transformer();

function transpile() {
  transformer.read(editor.getSession().getValue());
  transformer.applyTransformations();
  resultElement.innerHTML = transformer.out();
  hljs.highlightBlock(resultElement);
}

var timeout = false;

editor.on('input', function () {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(function () {
    transpile();
    timeout = false;
  }, 500);
});

transpile();