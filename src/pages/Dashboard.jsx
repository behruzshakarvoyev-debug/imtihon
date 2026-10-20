import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Layers, Wallet, AlertCircle } from "lucide-react";
import { getStudents } from "../api/students";
import { getGroups } from "../api/groups";
import { getPayments } from "../api/payments";
import { calcDebt, currentMonth } from "../utils/debt";
import { formatDate, formatMoney } from "../utils/format";
import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import StatCard from "../components/common/StatCard";
import IncomeChart from "../components/dashboard/IncomeChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [s, g, p] = await Promise.all([
          getStudents({ _expand: "group" }),
          getGroups(),
          getPayments({ _sort: "paidAt", _order: "desc" }),
        ]);
        setStudents(s.data);
        setGroups(g.data);
        setPayments(p.data);
      } catch {
        setError("Bosh panel ma'lumotlarini yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [attempt]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => setAttempt((a) => a + 1)} />;

  const month = currentMonth();
  const activeStudents = students.filter((s) => s.status === "active");
  const activeGroups = groups.filter((g) => g.status === "active");
  const monthIncome = payments
    .filter((p) => p.month === month)
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const debtors = activeStudents
    .map((s) => ({ student: s, debt: calcDebt(s, s.group, payments, month) }))
    .filter((d) => d.debt > 0)
    .sort((a, b) => b.debt - a.debt);

  const totalDebt = debtors.reduce((sum, d) => sum + d.debt, 0);

  const nameOf = (id) => {
    const s = students.find((st) => st.id === id);
    return s ? `${s.lastName} ${s.firstName}` : "—";
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Bosh panel" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Faol talabalar" value={activeStudents.length} icon={Users} />
        <StatCard title="Faol guruhlar" value={activeGroups.length} icon={Layers} variant="success" />
        <StatCard title="Joriy oy tushumi" value={formatMoney(monthIncome)} icon={Wallet} variant="warning" />
        <StatCard
          title="Qarzdorlar"
          value={`${debtors.length} ta (${formatMoney(totalDebt)})`}
          icon={AlertCircle}
          variant="danger"
        />
      </div>

      <IncomeChart payments={payments} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">So'nggi to'lovlar</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-gray-100 dark:divide-gray-800">
            {payments.length === 0 && <EmptyState text="To'lovlar yo'q" />}
            {payments.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium">{nameOf(p.studentId)}</p>
                  <p className="text-xs text-gray-500 capitalize">{p.method} • {formatDate(p.paidAt)}</p>
                </div>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  +{formatMoney(p.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Qarzdorlar (Top 5)</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-gray-100 dark:divide-gray-800">
            {debtors.length === 0 && <EmptyState text="Qarzdorlar yo'q" />}
            {debtors.slice(0, 5).map(({ student, debt }) => (
              <div key={student.id} className="flex items-center justify-between py-2.5 text-sm">
                <Link
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  to={`/dashboard/students/${student.id}`}
                >
                  {student.lastName} {student.firstName}
                </Link>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {formatMoney(debt)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
