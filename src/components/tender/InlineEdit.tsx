
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  isTextArea?: boolean;
  disabled?: boolean;
  className?: string;
}

export function InlineEdit({ 
  value, 
  onSave, 
  isTextArea = false, 
  disabled = false,
  className 
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing && !disabled) {
    return (
      <div className="flex items-start gap-2">
        {isTextArea ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={cn("flex-1", className)}
            rows={3}
            autoFocus
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={cn("flex-1", className)}
            autoFocus
          />
        )}
        <div className="flex flex-col gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleSave}
            className="h-8 w-8"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-2">
      <div className={cn("flex-1", className)}>
        {value || "-"}
      </div>
      {!disabled && (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
