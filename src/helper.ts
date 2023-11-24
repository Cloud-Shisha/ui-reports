export function refreshIn12Hours() {
  setTimeout(() => {
    window.location.reload();
  }, 12 * 60 * 60 * 1000);
}
