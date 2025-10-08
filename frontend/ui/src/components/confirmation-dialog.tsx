"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  deviceSummary: string;
  methodSummary: string;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  deviceSummary,
  methodSummary,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>⚠️ Confirm Wipe Operation</DialogTitle>
          <DialogDescription>
            This action is irreversible. Please review the details below before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold">Device:</p>
            <p className="col-span-3 text-sm text-muted-foreground">{deviceSummary}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold">Method:</p>
            <p className="col-span-3 text-sm text-muted-foreground">{methodSummary}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm & Wipe</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
