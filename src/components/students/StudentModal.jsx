import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StudentForm from "./StudentForm";

function StudentModal({ open, onOpenChange, editing, groups, onSubmit, isSubmitting }) {
  const editValues = editing
    ? {
        firstName: editing.firstName,
        lastName: editing.lastName,
        phone: editing.phone,
        birthDate: editing.birthDate,
        groupId: String(editing.groupId),
        status: editing.status,
        note: editing.note || "",
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Talabani tahrirlash" : "Yangi talaba"}
          </DialogTitle>
        </DialogHeader>
        <StudentForm
          defaultValues={editValues}
          groups={groups}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

export default StudentModal;
