import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAttendance, createAttendance, updateAttendance } from "../api/attendance";
import { getGroups } from "../api/groups";
import { getStudents } from "../api/students";
import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import AttendanceList from "../components/attendance/AttendanceList";
import AttendanceHistory from "../components/attendance/AttendanceHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const today = () => new Date().toISOString().slice(0, 10);

function Attendance() {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [date, setDate] = useState(today());
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [existing, setExisting] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    async function loadGroups() {
      try {
        const res = await getGroups({ status: "active" });
        setGroups(res.data);
        if (res.data.length > 0) setGroupId(String(res.data[0].id));
      } catch { setError("Guruhlarni yuklab bo'lmadi"); }
      finally { setLoading(false); }
    }
    loadGroups();
  }, []);

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;
    async function load() {
      setLoading(true); setError("");
      try {
        const [s, a] = await Promise.all([
          getStudents({ groupId, status: "active" }),
          getAttendance({ groupId, _sort: "date", _order: "desc" }),
        ]);
        if (cancelled) return;
        const found = a.data.find((r) => r.date === date) || null;
        const initial = {};
        s.data.forEach((st) => {
          const rec = found?.records?.find((r) => Number(r.studentId) === Number(st.id));
          initial[st.id] = rec ? rec.present : false;
        });
        setStudents(s.data); setExisting(found); setMarks(initial);
        setHistory(a.data.slice(0, 10));
      } catch {
        if (!cancelled) setError("Davomatni yuklab bo'lmadi");
      } finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [groupId, date, attempt]);

  const toggle = (id, val) => setMarks((prev) => ({ ...prev, [id]: val }));
  const markAll = () => {
    const all = {};
    students.forEach((s) => (all[s.id] = true));
    setMarks(all);
  };

  const handleSave = async () => {
    const payload = {
      groupId: Number(groupId),
      date,
      records: students.map((s) => ({ studentId: s.id, present: !!marks[s.id] })),
    };
    setSaving(true);
    try {
      if (existing) {
        await updateAttendance(existing.id, { records: payload.records });
        toast.success("Davomat muvaffaqiyatli yangilandi");
      } else {
        await createAttendance(payload);
        toast.success("Davomat muvaffaqiyatli saqlandi");
      }
      setAttempt((a) => a + 1);
    } catch { toast.error("Davomatni saqlashda xato yuz berdi"); }
    finally { setSaving(false); }
  };

  const came = students.filter((s) => marks[s.id]).length;
  const absent = students.length - came;

  return (
    <div className="space-y-6">
      <PageHeader title="Davomat" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select value={groupId} onValueChange={setGroupId}>
          <SelectTrigger><SelectValue placeholder="Guruhni tanlang" /></SelectTrigger>
          <SelectContent>
            {groups.map((g) => (
              <SelectItem key={g.id} value={String(g.id)}>{g.name} ({g.course})</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <Card>
        <CardContent className="pt-6">
          {loading ? <LoadingState /> : error ? (
            <ErrorState message={error} onRetry={() => setAttempt((a) => a + 1)} />
          ) : students.length === 0 ? (
            <EmptyState text="Bu guruhda faol talabalar yo'q" />
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3 dark:border-gray-800">
                <p className="font-semibold text-sm">
                  Keldi: <span className="text-emerald-600">{came}</span> / Kelmadi: <span className="text-red-600">{absent}</span>
                </p>
                <Button variant="outline" size="sm" onClick={markAll}>Hammasi keldi</Button>
              </div>
              <AttendanceList students={students} marks={marks} onToggle={toggle} />
              <Button className="mt-4 w-full" onClick={handleSave} disabled={saving}>
                {saving ? "Saqlanmoqda..." : existing ? "Davomatni yangilash" : "Davomatni saqlash"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <AttendanceHistory history={history} />
    </div>
  );
}

export default Attendance;
