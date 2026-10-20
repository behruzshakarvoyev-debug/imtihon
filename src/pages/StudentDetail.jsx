import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Pencil, PlusCircle, ArrowLeft } from "lucide-react";
import { getStudent, updateStudent } from "../api/students";
import { getAttendance } from "../api/attendance";
import { getGroups } from "../api/groups";
import { createPayment } from "../api/payments";
import { calcDebt, currentMonth } from "../utils/debt";
import { attendancePercent } from "../utils/studentUtils";
import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import StudentProfileCards from "../components/students/StudentProfileCards";
import StudentModal from "../components/students/StudentModal";
import PaymentForm from "../components/payments/PaymentForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [groups, setGroups] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(""); setNotFound(false);
      try {
        const [res, grps] = await Promise.all([getStudent(id), getGroups()]);
        if (cancelled) return;
        setStudent(res.data);
        setGroups(grps.data);
        if (res.data.groupId) {
          const att = await getAttendance({ groupId: res.data.groupId });
          if (!cancelled) setAttendance(att.data);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) setNotFound(true);
          else setError("Talaba ma'lumotlarini yuklab bo'lmadi");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, attempt]);

  const payments = student?.payments || [];
  const debt = calcDebt(student, student?.group, payments);
  const attInfo = attendancePercent(attendance, student?.id);

  if (loading) return <LoadingState />;
  if (notFound) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-gray-500">Talaba topilmadi</p>
        <Button onClick={() => navigate("/dashboard/students")}>Talabalar ro'yxatiga qaytish</Button>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={() => setAttempt((a) => a + 1)} />;

  const handleEditSubmit = async (data) => {
    setSaving(true);
    try {
      await updateStudent(student.id, { ...data, groupId: Number(data.groupId) });
      toast.success("Talaba yangilandi");
      setEditOpen(false);
      setAttempt((a) => a + 1);
    } catch { toast.error("Tahrirlashda xato yuz berdi"); }
    finally { setSaving(false); }
  };

  const handlePaySubmit = async (data) => {
    setSaving(true);
    try {
      await createPayment({ ...data, studentId: Number(data.studentId), amount: Number(data.amount) });
      toast.success("To'lov qabul qilindi");
      setPayOpen(false);
      setAttempt((a) => a + 1);
    } catch { toast.error("To'lovni saqlashda xato yuz berdi"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={`${student.lastName} ${student.firstName}`}>
        <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/students")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Orqaga
        </Button>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="mr-1 h-4 w-4" /> Tahrirlash
        </Button>
        <Button size="sm" onClick={() => setPayOpen(true)}>
          <PlusCircle className="mr-1 h-4 w-4" /> To'lov qo'shish
        </Button>
      </PageHeader>
      <StudentProfileCards student={student} payments={payments} debt={debt} attInfo={attInfo} />
      <StudentModal
        open={editOpen}
        onOpenChange={setEditOpen}
        editing={student}
        groups={groups}
        onSubmit={handleEditSubmit}
        isSubmitting={saving}
      />
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>To'lov qo'shish</DialogTitle></DialogHeader>
          <PaymentForm
            defaultValues={{
              studentId: String(student.id),
              amount: student.group ? String(student.group.monthlyPrice) : "",
              month: currentMonth(),
              method: "naqd",
              paidAt: "2026-10-20",
            }}
            students={[student]}
            payments={payments}
            onSubmit={handlePaySubmit}
            isSubmitting={saving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentDetail;
