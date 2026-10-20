export const currentMonth = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const calcDebt = (student, group, payments = [], targetMonth = currentMonth()) => {
  if (!student || !group) return 0;
  // Faol bo'lmagan talabalar uchun qarz hisoblanmaydi (muzlatilgan yoki ketgan bo'lsa 0)
  if (student.status !== "active") return 0;

  const monthlyPrice = Number(group.monthlyPrice) || 0;

  const paid = (payments || [])
    .filter((p) => {
      const matchStudent =
        p.studentId != null && Number(p.studentId) === Number(student.id);
      const matchMonth = p.month ? p.month === targetMonth : true;
      return matchStudent && matchMonth;
    })
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const debt = monthlyPrice - paid;
  return debt > 0 ? debt : 0;
};
