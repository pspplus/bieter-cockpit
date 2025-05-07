
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { t } = useTranslation();
  
  // Da die App nur auf Deutsch verfügbar ist, deaktivieren wir den Sprachwechsel
  // und zeigen nur Deutsch als ausgewählte Option an
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-tender-500 hover:text-tender-600"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Sprache auswählen</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="bg-tender-100">
          Deutsch (Standard)
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="text-gray-400 cursor-not-allowed">
          English (nicht verfügbar)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
