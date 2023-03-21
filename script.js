const textArea = document.querySelector('textarea');
textArea.addEventListener('keyup', function () {
  textArea.style.height = "0.1px"
  textArea.style.height = (25 + textArea.scrollHeight) + "px";
});

