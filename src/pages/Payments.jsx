import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Download } from "lucide-react";
import { getPayments, createPayment, deletePayment } from "../api/payments";
import { getStudents } from "../api/students";
import { formatMoney } from "../utils/format";
import { exportToCsv } from "../utils/exportCsv";
import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import PaymentForm from "../components/payments/PaymentForm";
import PaymentsTable from "../components/payments/PaymentsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [monthFilter, setMonthFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true); setError("");
      try {
        const [p, s] = await Promise.all([
          getPayments({ _sort: "paidAt", _order: "desc" }),
          getStudents({ _expand: "group" }),
        ]);
        setPayments(p.data); setStudents(s.data);
      } catch { setError("To'lovlarni yuklab bo'lmadi"); }
      finally { setLoading(false); }
    }
    load();
  }, [attempt]);

  const visible = payments.filter(
    (p) => (!monthFilter || p.month === monthFilter) &&
           (methodFilter === "all" || p.method === methodFilter)
  );

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await createPayment({ ...data, studentId: Number(data.studentId), amount: Number(data.amount) });
      toast.success("To'lov muvaffaqiyatli qo'shildi");
      setFormOpen(false);
      setAttempt((a) => a + 1);
    } catch { toast.error("Saqlashda xato yuz berdi"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deletePayment(deleting.id);
      toast.success("To'lov o'chirildi");
      setDeleting(null);
      setAttempt((a) => a + 1);
    } catch { toast.error("O'chirishda xato yuz berdi"); }
  };

  const handleExportCsv = () => {
    const studentOf = (id) => students.find((s) => Number(s.id) === Number(id));
    const data = visible.map((p) => ({
      ID: p.id,
      Talaba: studentOf(p.studentId) ? `${studentOf(p.studentId).lastName} ${studentOf(p.studentId).firstName}` : "—",
      Guruh: studentOf(p.studentId)?.group?.name || "—",
      Summa: p.amount,
      Oy: p.month,
      Usul: p.method,
      Sana: p.paidAt,
    }));
    exportToCsv(`tolovlar-${new Date().toISOString().slice(0, 10)}.csv`, data);
    toast.success("To'lovlar CSV formatida yuklab olindi");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="To'lovlar">
        <Button variant="outline" onClick={handleExportCsv} disabled={visible.length === 0}>
          <Download className="mr-1 h-4 w-4" /> CSV Export
        </Button>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> To'lov qo'shish
        </Button>
      </PageHeader>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} />
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger><SelectValue placeholder="To'lov usuli" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha usullar</SelectItem>
            <SelectItem value="naqd">Naqd</SelectItem>
            <SelectItem value="karta">Karta</SelectItem>
            <SelectItem value="click">Click</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? <LoadingState /> : error ? (
          <ErrorState message={error} onRetry={() => setAttempt((a) => a + 1)} />
        ) : visible.length === 0 ? (
          <EmptyState text="To'lovlar topilmadi" />
        ) : (
          <PaymentsTable visible={visible} students={students} onDelete={setDeleting} />
        )}
      </div>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Yangi to'lov qo'shish</DialogTitle></DialogHeader>
          <PaymentForm students={students} payments={payments} onSubmit={handleSubmit} isSubmitting={saving} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleting}
        title="To'lovni o'chirish"
        description={deleting ? `${formatMoney(deleting.amount)} to'lovi tizimdan o'chiriladi.` : ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

export default Payments;
