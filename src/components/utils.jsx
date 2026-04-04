
// פונקציית cn פשוטה ללא תלות בחבילות חיצוניות - with cn function export
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
