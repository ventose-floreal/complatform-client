(() => {
  window.electronAPI.onChangePort((_event, value) => {
    const information = document.getElementById('port');
    information.innerText = value;
  });
})();
