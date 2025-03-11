
import { supabase } from "@/integrations/supabase/client";
import { 
  DashboardData, 
  TenderStatusStat, 
  MonthlyTenderStat, 
  UpcomingMilestone,
  TenderStatus
} from "@/types/tender";
import { format, addDays, isBefore, formatDistanceToNow, differenceInDays } from "date-fns";
import { de } from 'date-fns/locale';

// Dashboard-Einstellungen abrufen
export const fetchDashboardSettings = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  const { data, error } = await supabase
    .from('dashboard_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Fehler beim Abrufen der Dashboard-Einstellungen:', error);
    throw error;
  }

  return data;
};

// Dashboard-Einstellungen speichern oder aktualisieren
export const saveDashboardSettings = async (favoriteMetrics: string[], layoutConfig?: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  // Prüfen, ob bereits Einstellungen existieren
  const { data: existingSettings } = await supabase
    .from('dashboard_settings')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingSettings) {
    // Einstellungen aktualisieren
    const { error } = await supabase
      .from('dashboard_settings')
      .update({
        favorite_metrics: favoriteMetrics,
        layout_config: layoutConfig,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSettings.id);

    if (error) {
      console.error('Fehler beim Aktualisieren der Dashboard-Einstellungen:', error);
      throw error;
    }
  } else {
    // Neue Einstellungen erstellen
    const { error } = await supabase
      .from('dashboard_settings')
      .insert({
        user_id: user.id,
        favorite_metrics: favoriteMetrics,
        layout_config: layoutConfig,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Fehler beim Erstellen der Dashboard-Einstellungen:', error);
      throw error;
    }
  }
};

// Alle Dashboard-Daten für einen Benutzer abrufen
export const fetchDashboardData = async (): Promise<DashboardData> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  // Alle Ausschreibungen des Benutzers abrufen
  const { data: tenders, error: tendersError } = await supabase
    .from('tenders')
    .select('*')
    .eq('user_id', user.id);

  if (tendersError) {
    console.error('Fehler beim Abrufen der Ausschreibungen:', tendersError);
    throw tendersError;
  }

  // Alle Meilensteine abrufen
  const { data: milestones, error: milestonesError } = await supabase
    .from('milestones')
    .select('*, tenders!inner(title, id)')
    .lt('due_date', addDays(new Date(), 30).toISOString())
    .gt('due_date', new Date().toISOString())
    .neq('status', 'completed')
    .neq('status', 'skipped')
    .order('due_date', { ascending: true });

  if (milestonesError) {
    console.error('Fehler beim Abrufen der Meilensteine:', milestonesError);
    throw milestonesError;
  }

  // Status-Statistiken berechnen
  const statusCounts: Record<TenderStatus, number> = {
    'entwurf': 0,
    'in-pruefung': 0,
    'in-bearbeitung': 0,
    'abgegeben': 0,
    'aufklaerung': 0,
    'gewonnen': 0,
    'verloren': 0,
    'abgeschlossen': 0
  };

  tenders.forEach(tender => {
    if (statusCounts[tender.status as TenderStatus] !== undefined) {
      statusCounts[tender.status as TenderStatus]++;
    }
  });

  const totalTenders = tenders.length;
  
  const statusStats: TenderStatusStat[] = Object.entries(statusCounts).map(([status, count]) => ({
    status: status as TenderStatus,
    count,
    percentage: totalTenders > 0 ? Math.round((count / totalTenders) * 100) : 0
  }));

  // Monatliche Statistiken berechnen
  const last6Months: Record<string, { month: string, count: number, won: number, lost: number }> = {};
  
  // Letzten 6 Monate initialisieren
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = format(date, 'yyyy-MM');
    const monthName = format(date, 'MMM yyyy', { locale: de });
    
    last6Months[monthKey] = {
      month: monthName,
      count: 0,
      won: 0,
      lost: 0
    };
  }
  
  // Tender nach Monat zählen
  tenders.forEach(tender => {
    const createdDate = new Date(tender.created_at);
    const monthKey = format(createdDate, 'yyyy-MM');
    
    if (last6Months[monthKey]) {
      last6Months[monthKey].count++;
      
      if (tender.status === 'gewonnen') {
        last6Months[monthKey].won++;
      } else if (tender.status === 'verloren') {
        last6Months[monthKey].lost++;
      }
    }
  });
  
  const monthlyStats: MonthlyTenderStat[] = Object.values(last6Months);

  // Bevorstehende Meilensteine
  const upcomingMilestones: UpcomingMilestone[] = milestones.map(m => {
    const dueDate = new Date(m.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isOverdue = isBefore(dueDate, today);
    const daysLeft = differenceInDays(dueDate, today);
    
    return {
      id: m.id,
      title: m.title,
      dueDate: dueDate,
      tenderId: m.tenders.id,
      tenderTitle: m.tenders.title,
      status: m.status,
      isOverdue,
      daysLeft
    };
  });

  // Berechnete Metriken
  const activeTenders = tenders.filter(t => ['in-bearbeitung', 'in-pruefung'].includes(t.status)).length;
  const submittedTenders = tenders.filter(t => ['abgegeben', 'aufklaerung'].includes(t.status)).length;
  const wonTenders = tenders.filter(t => t.status === 'gewonnen').length;
  const lostTenders = tenders.filter(t => t.status === 'verloren').length;
  
  const allSubmittedTenders = submittedTenders + wonTenders + lostTenders;
  const successRate = allSubmittedTenders > 0 ? Math.round((wonTenders / allSubmittedTenders) * 100) : 0;

  return {
    statusStats,
    monthlyStats,
    upcomingMilestones,
    totalTenders,
    activeTenders,
    submittedTenders,
    wonTenders,
    lostTenders,
    successRate
  };
};
