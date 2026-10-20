import { writeFileSync } from "node:fs";

const firstNames = ["Ali","Madina","Sardor","Dilnoza","Jasur","Zilola","Bekzod","Nargiza","Otabek","Malika","Shahzod","Sevara","Humoyun","Lola","Abbos","Kamola","Doniyor","Feruza","Eldor","Gulnora","Rustam","Nilufar","Sanjar","Aziza","Farrux"];
const lastNames = ["Karimov","Yusupova","Rahmonov","Aliyeva","Tursunov","Nazarova","Qodirov","Ismoilova","Hasanov","Rashidova","Mirzayev","Abdullayeva","Sobirov","Karimova","Olimov","Toshpulatova","Saidov","Normatova","Ergashev","Umarova","Bakirov","Xolmatova","Jurayev","Ahmedova","Salimov"];

const groups = [
  { id: 1, name: "FN-24", course: "Frontend", teacher: "Jasur Aliyev", days: "toq", time: "14:00", monthlyPrice: 800000, startDate: "2026-09-01", status: "active" },
  { id: 2, name: "BN-12", course: "Backend", teacher: "Dilnoza Karimova", days: "juft", time: "16:00", monthlyPrice: 900000, startDate: "2026-09-01", status: "active" },
  { id: 3, name: "UX-7", course: "UI/UX dizayn", teacher: "Malika Rashidova", days: "toq", time: "10:00", monthlyPrice: 700000, startDate: "2026-08-15", status: "active" },
  { id: 4, name: "PY-5", course: "Python", teacher: "Otabek Saidov", days: "juft", time: "18:00", monthlyPrice: 750000, startDate: "2026-03-01", status: "finished" },
];

const statuses = ["active","active","active","active","active","active","frozen","left"];

const students = firstNames.map((fn, i) => ({
  id: i + 1,
  firstName: fn,
  lastName: lastNames[i],
  phone: `+99890${String(1000000 + i * 37319).slice(0, 7)}`,
  birthDate: `${2000 + (i % 8)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
  groupId: (i % 3) + 1,
  status: statuses[i % statuses.length],
  joinedAt: "2026-09-01",
  note: "",
}));

const methods = ["naqd", "karta", "click"];
const payments = [];
const active = students.filter((s) => s.status === "active");
for (let i = 0; i < 40; i++) {
  const s = active[i % active.length];
  const g = groups.find((x) => x.id === s.groupId);
  const month = i < 22 ? "2026-10" : "2026-09";
  const full = i % 3 !== 0;
  payments.push({
    id: i + 1,
    studentId: s.id,
    amount: full ? g.monthlyPrice : g.monthlyPrice / 2,
    month,
    method: methods[i % 3],
    paidAt: `${month}-${String((i % 18) + 1).padStart(2, "0")}`,
  });
}

const attendance = [];
let id = 1;
for (const gid of [1, 2, 3]) {
  for (const date of ["2026-10-12", "2026-10-14"]) {
    attendance.push({
      id: id++,
      groupId: gid,
      date,
      records: students
        .filter((s) => s.groupId === gid && s.status === "active")
        .map((s, k) => ({ studentId: s.id, present: (s.id + k) % 4 !== 0 })),
    });
  }
}

const admins = [
  { id: 1, username: "admin", password: "admin123", fullName: "Aziz Rahimov", avatar: "https://i.pravatar.cc/150?img=12" },
];

writeFileSync("db.json", JSON.stringify({ admins, groups, students, payments, attendance }, null, 2));
console.log("db.json tayyor");