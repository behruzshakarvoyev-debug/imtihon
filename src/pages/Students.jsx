import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createStudent, updateStudent, deleteStudent } from "../api/students";
import PageHeader from "../components/common/PageHeader";
import ConfirmDialog from "../components/common/ConfirmDialog";
import StudentsFilters from "../components/students/StudentsFilters";
import StudentModal from "../components/students/StudentModal";
import StudentsList from "../components/students/StudentsList";
import { Button } from "@/components/ui/button";
import { useStudents, LIMIT } from "../hooks/useStudents";

function Students() {
  const navigate = useNavigate();
  const {
    students, total, groups, payments, loading, error, reload,
    urlGroup, urlStatus, urlPage,
    searchInput, setSearchInput, updateFilter, handlePageChange,
  } = useStudents();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleFormSubmit = async (data) => {
    const payload = { ...data, groupId: Number(data.groupId), note: data.note || "" };
    setSaving(true);
    try {
      if (editing) {
        await updateStudent(editing.id, payload);
        toast.success("Talaba yangilandi");
      } else {
        await createStudent({ ...payload, joinedAt: new Date().toISOString().slice(0, 10) });
        toast.success("Talaba muvaffaqiyatli qo'shildi");
      }
      setFormOpen(false);
      reload();
    } catch {
      toast.error("Saqlashda xato yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteStudent(deleting.id);
      toast.success("Talaba o'chirildi");
      setDeleting(null);
      if (students.length === 1 && urlPage > 1) handlePageChange(urlPage - 1);
      else reload();
    } catch {
      toast.error("O'chirishda xato yuz berdi");
    }
  };

  return (
    <div>
      <PageHeader title="Talabalar">
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Talaba qo'shish
        </Button>
      </PageHeader>
      <StudentsFilters
        searchInput={searchInput}
        onSearch={setSearchInput}
        groupId={urlGroup}
        onGroup={(val) => updateFilter("groupId", val)}
        status={urlStatus}
        onStatus={(val) => updateFilter("status", val)}
        groups={groups}
      />
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <StudentsList
          loading={loading}
          error={error}
          students={students}
          payments={payments}
          total={total}
          page={urlPage}
          limit={LIMIT}
          onRetry={reload}
          onRowClick={(id) => navigate(`/dashboard/students/${id}`)}
          onEdit={(s) => { setEditing(s); setFormOpen(true); }}
          onDelete={setDeleting}
          onPageChange={handlePageChange}
        />
      </div>
      <StudentModal
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        groups={groups}
        onSubmit={handleFormSubmit}
        isSubmitting={saving}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Talabani o'chirish"
        description={deleting ? `${deleting.lastName} ${deleting.firstName} o'chiriladi.` : ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

export default Students;
