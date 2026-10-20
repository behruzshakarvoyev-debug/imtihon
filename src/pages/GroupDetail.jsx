import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Users, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { getGroup } from "../api/groups";
import { getStudents } from "../api/students";
import { getPayments } from "../api/payments";
import { calcDebt, currentMonth } from "../utils/debt";
import { formatMoney } from "../utils/format";
import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import StatCard from "../components/common/StatCard";
import StatusBadge from "../components/students/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      setNotFound(false);
      try {
        const g = await getGroup(id);
        const [s, p] = await Promise.all([
          getStudents({ groupId: id }),
          getPayments({ month: currentMonth() }),
        ]);
        if (cancelled) return;
        setGroup(g.data);
        setStudents(s.data);
        setPayments(p.data);
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 404) setNotFound(true);
        else setError("Guruhni yuklab bo'lmadi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  if (loading) return <LoadingState />;
  if (notFound)
    return (
      <div className="py-16 text-center">
        <p className="mb-4">Guruh topilmadi</p>
        <Button onClick={() => navigate("/dashboard/groups")}>Guruhlarga qaytish</Button>
      </div>
    );
  if (error) return <ErrorState message={error} onRetry={() => setAttempt((a) => a + 1)} />;

  const activeStudents = students.filter((s) => s.status === "active");
  const expected = students.length * group.monthlyPrice;
  const debtors = activeStudents.filter((s) => calcDebt(s, group, payments) > 0).length;
  const paidCount = activeStudents.length - debtors;

  return (
    <div>
      <PageHeader title={`${group.name} (${group.course})`}>
        <Button variant="outline" onClick={() => navigate("/dashboard/groups")}>Orqaga</Button>
      </PageHeader>

      <Card className="mb-4">
        <CardContent className="grid gap-1 pt-6 text-sm">
          <p>O'qituvchi: {group.teacher}</p>
          <p>{group.days === "toq" ? "Toq" : "Juft"} kunlar, {group.time}</p>
          <p>Oylik narx: {formatMoney(group.monthlyPrice)}</p>
        </CardContent>
      </Card>

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard title="Talabalar soni" value={students.length} icon={Users} />
        <StatCard title="Kutilayotgan oylik tushum" value={formatMoney(expected)} icon={Wallet} variant="success" />
        <StatCard
          title="To'lagan / to'lamagan"
          value={`${paidCount} / ${debtors}`}
          icon={debtors > 0 ? AlertCircle : CheckCircle}
          variant={debtors > 0 ? "warning" : "success"}
        />
      </div>

      <Card>
        <CardHeader><CardTitle>Talabalar</CardTitle></CardHeader>
        <CardContent>
          {students.length === 0 && <EmptyState text="Guruhda talabalar yo'q" />}
          {students.map((s) => {
            const debt = calcDebt(s, group, payments);
            return (
              <div key={s.id} className="flex items-center justify-between border-b py-2 text-sm">
                <Link className="text-blue-600 hover:underline" to={`/dashboard/students/${s.id}`}>
                  {s.lastName} {s.firstName}
                </Link>
                <div className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  {s.status === "active" &&
                    (debt > 0 ? (
                      <span className="text-red-600">Qarz: {formatMoney(debt)}</span>
                    ) : (
                      <span className="text-green-600">To'langan</span>
                    ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

export default GroupDetail;