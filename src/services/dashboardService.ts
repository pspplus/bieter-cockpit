
import { supabase } from "@/integrations/supabase/client";
import { 
  DashboardData, MonthlyTenderStat, 
  TenderStatusStat, UpcomingMilestone, 
  MilestoneStatus, TenderStatus 
} from "@/types/tender";
import { format, isAfter, isBefore, subDays, differenceInDays } from "date-fns";

// Abruf der Dashboard-Einstellungen für den aktuellen Benutzer
export const fetchDashboardSettings = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  const { data, error } = await supabase
    .from('dashboard_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 ist "Did not find any rows"
    console.error('Fehler beim Abrufen der Dashboard-Einstellungen:', error);
    throw error;
  }

  return data;
};

// Speichern der Dashboard-Einstellungen
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
    .single();

  let result;
  
  if (existingSettings) {
    // Aktualisieren existierender Einstellungen
    const { data, error } = await supabase
      .from('dashboard_settings')
      .update({
        favorite_metrics: favoriteMetrics,
        layout_config: layoutConfig,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSettings.id)
      .select()
      .single();

    if (error) {
      console.error('Fehler beim Aktualisieren der Dashboard-Einstellungen:', error);
      throw error;
    }
    
    result = data;
  } else {
    // Erstellen neuer Einstellungen
    const { data, error } = await supabase
      .from('dashboard_settings')
      .insert({
        user_id: user.id,
        favorite_metrics: favoriteMetrics,
        layout_config: layoutConfig,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Fehler beim Erstellen der Dashboard-Einstellungen:', error);
      throw error;
    }
    
    result = data;
  }

  return result;
};

// Dashboard-Daten abrufen
export const fetchDashboardData = async (): Promise<DashboardData> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Benutzer nicht authentifiziert');
  }

  // 1. Basis-Statistik abrufen
  const { data: tenders, error: tendersError } = await supabase
    .from('tenders')
    .select('id, status, created_at, due_date')
    .eq('user_id', user.id);

  if (tendersError) {
    console.error('Fehler beim Abrufen der Ausschreibungen:', tendersError);
    throw tendersError;
  }

  // 2. Anstehende Meilensteine abrufen
  const { data: milestones, error: milestonesError } = await supabase
    .from('milestones')
    .select(`
      id, title, due_date, status, 
      tender_id,
      tenders (title)
    `)
    .eq('status', 'pending')
    .or('status.eq.in-progress')
    .not('due_date', 'is', null)
    .order('due_date', { ascending: true })
    .limit(10);

  if (milestonesError) {
    console.error('Fehler beim Abrufen der Meilensteine:', milestonesError);
    throw milestonesError;
  }

  // Statistiken berechnen
  const totalTenders = tenders.length;
  const activeTenders = tenders.filter(t => 
    t.status === 'entwurf' || t.status === 'in-pruefung' || t.status === 'in-bearbeitung'
  ).length;
  const submittedTenders = tenders.filter(t => t.status === 'abgegeben').length;
  const wonTenders = tenders.filter(t => t.status === 'gewonnen').length;
  const lostTenders = tenders.filter(t => t.status === 'verloren').length;
  
  // Erfolgsrate berechnen (gewonnene / (gewonnene + verlorene))
  const totalCompleted = wonTenders + lostTenders;
  const successRate = totalCompleted > 0 ? (wonTenders / totalCompleted) * 100 : 0;

  // Status-Statistik
  const statusStats: TenderStatusStat[] = [];
  const statusCounts: Record<string, number> = {};

  tenders.forEach(tender => {
    statusCounts[tender.status] = (statusCounts[tender.status] || 0) + 1;
  });

  Object.keys(statusCounts).forEach(status => {
    statusStats.push({
      status: status as TenderStatus,
      count: statusCounts[status],
      percentage: (statusCounts[status] / totalTenders) * 100
    });
  });

  // Monatliche Statistik
  const monthlyStats: MonthlyTenderStat[] = [];
  const monthCounts: Record<string, { count: number, won: number, lost: number }> = {};

  tenders.forEach(tender => {
    const month = format(new Date(tender.created_at), 'yyyy-MM');
    
    if (!monthCounts[month]) {
      monthCounts[month] = { count: 0, won: 0, lost: 0 };
    }
    
    monthCounts[month].count += 1;
    
    if (tender.status === 'gewonnen') {
      monthCounts[month].won += 1;
    } else if (tender.status === 'verloren') {
      monthCounts[month].lost += 1;
    }
  });

  Object.keys(monthCounts)
    .sort()
    .forEach(month => {
      monthlyStats.push({
        month: format(new Date(month), 'MMM yyyy'),
        count: monthCounts[month].count,
        won: monthCounts[month].won,
        lost: monthCounts[month].lost
      });
    });

  // Anstehende Meilensteine formatieren
  const today = new Date();
  const upcomingMilestones: UpcomingMilestone[] = milestones.map(milestone => {
    const dueDate = milestone.due_date ? new Date(milestone.due_date) : null;
    const isOverdue = dueDate ? isBefore(dueDate, today) : false;
    const daysLeft = dueDate ? differenceInDays(dueDate, today) : undefined;
    
    return {
      id: milestone.id,
      title: milestone.title,
      dueDate: dueDate as Date,
      tenderId: milestone.tender_id,
      tenderTitle: milestone.tenders?.title || '',
      status: milestone.status as MilestoneStatus,
      isOverdue,
      daysLeft: daysLeft
    };
  });

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
