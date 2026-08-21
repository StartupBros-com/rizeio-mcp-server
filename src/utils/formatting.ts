import { format, parseISO } from 'date-fns';
import { RizeProductivityMetrics, RizeFocusSession, RizeAnalytics } from '../types/rize.js';

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

function formatRizeDate(
  dateString: string,
  pattern: string,
  fallback: string
): string {
  try {
    return format(parseISO(convertRizeDateToISO(dateString)), pattern);
  } catch {
    return fallback;
  }
}

export function formatDate(dateString: string): string {
  return formatRizeDate(dateString, 'yyyy-MM-dd', 'Invalid Date');
}

export function formatDateTime(dateString: string): string {
  return formatRizeDate(
    dateString,
    'yyyy-MM-dd HH:mm:ss',
    'Invalid DateTime'
  );
}

// Normalize Rize timestamps such as "2025-09-05 04:00:00 +0200"
// into ISO 8601 form: "2025-09-05T04:00:00+02:00".
function convertRizeDateToISO(dateString: string): string {
  if (!dateString || typeof dateString !== 'string') {
    throw new Error('Invalid date string');
  }

  return dateString
    .trim()
    .replace(/^(\d{4}-\d{2}-\d{2})\s+/, '$1T')
    .replace(/\s*([+-])(\d{2}):?(\d{2})$/, '$1$2:$3')
    .replace(/\s+Z$/, 'Z');
}

export function formatProductivityMetrics(metrics: RizeProductivityMetrics[]): string {
  if (metrics.length === 0) {
    return 'No productivity data available for the specified date range.';
  }
  const totalFocusTime = metrics.reduce((sum, m) => sum + m.totalFocusTime, 0);
  const avgProductivityScore = metrics.reduce((sum, m) => sum + m.productivityScore, 0) / metrics.length;
  const totalSessions = metrics.reduce((sum, m) => sum + m.focusSessionsCount, 0);
  let formatted = `📊 Productivity Metrics Summary (${metrics.length} days)\n\n`;
  formatted += `🎯 Total Focus Time: ${formatDuration(totalFocusTime)}\n`;
  formatted += `⚡ Average Productivity Score: ${avgProductivityScore.toFixed(1)}/100\n`;
  formatted += `📈 Total Focus Sessions: ${totalSessions}\n\n`;
  formatted += `📅 Daily Breakdown:\n`;
  metrics.forEach(metric => {
    formatted += `• ${metric.date}: ${formatDuration(metric.totalFocusTime)} focus time, `;
    formatted += `${metric.productivityScore}/100 score, ${metric.focusSessionsCount} focus sessions\n`;
  });
  return formatted;
}

export function formatFocusSessions(sessions: RizeFocusSession[]): string {
  if (sessions.length === 0) {
    return 'No focus sessions found for the specified criteria.';
  }
  let formatted = `🎯 Focus Sessions Summary (${sessions.length} sessions)\n\n`;
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgFocusScore = sessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) / sessions.length;
  formatted += `⏱️ Total Duration: ${formatDuration(totalDuration)}\n`;
  formatted += `📊 Average Focus Score: ${avgFocusScore.toFixed(1)}/100\n\n`;
  formatted += `📋 Session Details:\n`;
  sessions.forEach(session => {
    formatted += `• ${formatDateTime(session.startTime)} - `;
    formatted += `${session.endTime ? formatDateTime(session.endTime) : 'Active'}\n`;
    formatted += `  Duration: ${formatDuration(session.duration || 0)}, `;
    formatted += `Score: ${session.focusScore || 0}/100, `;
    formatted += `App: ${session.application || 'Unknown'}\n`;
    formatted += `  Category: ${session.category}`;
    if (session.title) formatted += `, Title: ${session.title}`;
    formatted += `\n\n`;
  });
  return formatted;
}

export function formatAnalytics(analytics: RizeAnalytics): string {
  let formatted = `📈 Analytics Report (${analytics.timeframe})\n\n`;
  // Trends
  formatted += `🔄 Trends:\n`;
  formatted += `• Focus Time: ${analytics.trends.focusTime > 0 ? '+' : ''}${(analytics.trends.focusTime * 100).toFixed(1)}%\n`;
  formatted += `• Productivity Score: ${analytics.trends.productivityScore > 0 ? '+' : ''}${(analytics.trends.productivityScore * 100).toFixed(1)}%\n`;
  formatted += `• Consistency: ${(analytics.trends.consistency * 100).toFixed(1)}%\n\n`;
  // Key Insights
  if (analytics.insights.length > 0) {
    formatted += `💡 Key Insights:\n`;
    analytics.insights.forEach(insight => {
      const priority = insight.priority === 'high' ? '🔴' : insight.priority === 'medium' ? '🟡' : '🟢';
      formatted += `${priority} ${insight.title}\n`;
      formatted += `   ${insight.description}\n\n`;
    });
  }
  // Metrics summary
  if (analytics.metrics.length > 0) {
    formatted += formatProductivityMetrics(analytics.metrics);
  }
  return formatted;
}
