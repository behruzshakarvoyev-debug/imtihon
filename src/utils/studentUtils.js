export function calcAge(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function attendancePercent(records = [], studentId) {
  const mine = records.filter((a) =>
    a.records?.some((r) => Number(r.studentId) === Number(studentId))
  );
  if (mine.length === 0) return null;
  const came = mine.filter((a) =>
    a.records?.find((r) => Number(r.studentId) === Number(studentId))?.present
  ).length;
  return {
    percent: Math.round((came / mine.length) * 100),
    ratio: `${came}/${mine.length}`,
  };
}
