
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";
import { toast } from "sonner";
import { MilestoneTemplate, fetchMilestoneTemplates, updateMilestoneTemplate, createMilestoneTemplate } from '@/services/milestoneTemplateService';
import { getDefaultMilestones } from '@/data/defaultMilestones';

const MilestoneTemplateSettings = () => {
  const { t } = useTranslation(['general']);
  const [templates, setTemplates] = useState<MilestoneTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MilestoneTemplate | null>(null);
  const [description, setDescription] = useState('');
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const defaultMilestones = getDefaultMilestones();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const loadedTemplates = await fetchMilestoneTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      toast.error(t('general:errorLoadingTemplates', 'Fehler beim Laden der Vorlagen'));
    }
  };

  const handleTemplateSelect = async (title: string) => {
    const existingTemplate = templates.find(t => t.title === title);
    
    if (existingTemplate) {
      setSelectedTemplate(existingTemplate);
      setDescription(existingTemplate.description || '');
      setChecklistItems(existingTemplate.checklist_items || []);
    } else {
      const defaultMilestone = defaultMilestones.find(m => m.title === title);
      if (defaultMilestone) {
        setSelectedTemplate(null);
        setDescription(defaultMilestone.description || '');
        setChecklistItems([]);
      }
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems([...checklistItems, newChecklistItem.trim()]);
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedTemplate?.title) return;

    setIsLoading(true);
    try {
      const templateData = {
        title: selectedTemplate.title,
        description,
        checklist_items: checklistItems,
      };

      if (selectedTemplate.id) {
        await updateMilestoneTemplate(selectedTemplate.id, templateData);
      } else {
        await createMilestoneTemplate(templateData);
      }

      toast.success(t('general:templateSaved', 'Vorlage gespeichert'));
      await loadTemplates();
    } catch (error) {
      toast.error(t('general:errorSavingTemplate', 'Fehler beim Speichern der Vorlage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('general:milestoneTemplates', 'Meilensteinvorlagen')}</CardTitle>
          <CardDescription>
            {t('general:milestoneTemplatesDescription', 'Verwalten Sie die Standardeinstellungen für Ihre Meilensteine')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t('general:selectMilestone', 'Meilenstein auswählen')}</Label>
            <Select 
              onValueChange={handleTemplateSelect}
              value={selectedTemplate?.title || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('general:selectMilestone', 'Meilenstein auswählen')} />
              </SelectTrigger>
              <SelectContent>
                {defaultMilestones.map((milestone) => (
                  <SelectItem key={milestone.title} value={milestone.title}>
                    {milestone.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('general:description', 'Beschreibung')}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('general:enterDescription', 'Beschreibung eingeben...')}
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-4">
            <Label>{t('general:checklist', 'Checkliste')}</Label>
            <div className="flex space-x-2">
              <Input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder={t('general:newChecklistItem', 'Neuer Checklistenpunkt...')}
                onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
              />
              <Button 
                type="button" 
                onClick={handleAddChecklistItem}
                variant="outline"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span>{item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveChecklistItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!selectedTemplate?.title || isLoading}
            className="w-full"
          >
            {isLoading
              ? t('general:saving', 'Wird gespeichert...')
              : t('general:saveTemplate', 'Vorlage speichern')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilestoneTemplateSettings;
