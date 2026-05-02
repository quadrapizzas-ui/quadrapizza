export function getBusinessDay(date: Date | string | number = new Date()): Date {
  const d = new Date(date);
  // Los horarios de atención son de 20:00 a 01:00+.
  // Si la hora es menor a las 10:00 AM, pertenece al turno de la noche anterior.
  // Usamos 10:00 AM como margen de seguridad para cualquier cierre muy tarde.
  if (d.getHours() < 10) {
    d.setDate(d.getDate() - 1);
  }
  // Removemos las horas para tener el "día" puro
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatBusinessDay(date: Date | string | number = new Date()): string {
  const d = getBusinessDay(date);
  return d.toLocaleDateString("es-AR", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
