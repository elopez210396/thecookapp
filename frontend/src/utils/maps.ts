export function abrirEnMaps(direccion: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
  window.open(url, '_blank');
}
