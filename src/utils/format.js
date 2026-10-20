export const formatMoney = (n) => {
  const num = Number(n) || 0;
  return `${num.toLocaleString("ru-RU")} so'm`;
};

export const formatDate = (iso) => {
  if (!iso) return "";
  const parts = String(iso).split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d.padStart(2, "0")}.${m.padStart(2, "0")}.${y}`;
  }
  return iso;
};

export const formatPhone = (p) => {
  if (!p) return "";
  const d = String(p).replace(/\D/g, "");
  if (d.length >= 12) {
    return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10, 12)}`;
  }
  return p;
};
