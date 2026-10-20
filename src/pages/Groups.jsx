import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { getGroups, createGroup, updateGroup, deleteGroup } from "../api/groups";
import { getStudents } from "../api/students";
import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import GroupCard from "../components/groups/GroupCard";
import GroupModal from "../components/groups/GroupModal";
import { Button } from "@/components/ui/button";

const FILTERS = [
  { value: "all", label: "Barchasi" },
  { value: "active", label: "Faol" },
  { value: "finished", label: "Tugagan" },
];

function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true); setError("");
      try {
        const [g, s] = await Promise.all([getGroups(), getStudents()]);
        setGroups(g.data); setStudents(s.data);
      } catch {
        setError("Guruhlarni yuklab bo'lmadi");
      } finally { setLoading(false); }
    }
    load();
  }, [attempt]);

  const countOf = (id) => students.filter((s) => Number(s.groupId) === Number(id)).length;
  const visible = filter === "all" ? groups : groups.filter((g) => g.status === filter);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await updateGroup(editing.id, data);
        toast.success("Guruh yangilandi");
      } else {
        await createGroup(data);
        toast.success("Guruh qo'shildi");
      }
      setFormOpen(false);
      setAttempt((a) => a + 1);
    } catch { toast.error("Saqlashda xato yuz berdi"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (countOf(deleting.id) > 0) {
      toast.error("Avval talabalarni boshqa guruhga o'tkazing");
      setDeleting(null);
      return;
    }
    try {
      await deleteGroup(deleting.id);
      toast.success("Guruh o'chirildi");
      setDeleting(null);
      setAttempt((a) => a + 1);
    } catch { toast.error("O'chirishda xato yuz berdi"); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Guruhlar">
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Guruh qo'shish
        </Button>
      </PageHeader>
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>
      {loading ? <LoadingState /> : error ? (
        <ErrorState message={error} onRetry={() => setAttempt((a) => a + 1)} />
      ) : visible.length === 0 ? (
        <EmptyState text="Guruhlar topilmadi" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              studentsCount={countOf(g.id)}
              onOpen={(id) => navigate(`/dashboard/groups/${id}`)}
              onEdit={(grp) => { setEditing(grp); setFormOpen(true); }}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}
      <GroupModal
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSubmit={handleSubmit}
        isSubmitting={saving}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Guruhni o'chirasizmi?"
        description={deleting ? `${deleting.name} guruhi o'chiriladi.` : ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

export default Groups;
