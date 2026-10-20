import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GroupForm from "./GroupForm";

function GroupModal({ open, onOpenChange, editing, onSubmit, isSubmitting }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Guruhni tahrirlash" : "Yangi guruh"}</DialogTitle>
        </DialogHeader>
        <GroupForm
          defaultValues={editing || undefined}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

export default GroupModal;
