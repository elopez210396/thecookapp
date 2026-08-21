export function formatFechaEntrega(iso: string): string {
  const fecha = new Date(iso);
  const hoy = new Date();
  const esHoy = fecha.toDateString() === hoy.toDateString();

  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  const esManana = fecha.toDateString() === manana.toDateString();

  const hora = fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });

  if (esHoy) return `Hoy ${hora}`;
  if (esManana) return `Mañana ${hora}`;

  const dia = fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' });
  return `${dia} ${hora}`;
}

export function tiempoRelativo(iso: string): string {
  const fecha = new Date(iso);
  const ahora = new Date();
  const dias = Math.floor((ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));

  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'hace 1 día';
  return `hace ${dias}d`;
}

export function toDatetimeLocalValue(iso: string): string {
  const fecha = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
}
