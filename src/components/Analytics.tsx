import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  AlertCircle,
  Eye,
  Calendar
} from "lucide-react";
import { SessionData, DistractionEvent } from "@/pages/Index";

interface AnalyticsProps {
  sessions: SessionData[];
}

const Analytics = ({ sessions }: AnalyticsProps) => {
  const analytics = useMemo(() => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalTime: 0,
        averageFocusScore: 0,
        totalDistractions: 0,
        averageSessionTime: 0,
        focusTrend: [],
        distractionTypes: [],
        sessionData: [],
        weeklyData: []
      };
    }

    const totalSessions = sessions.length;
    const totalTime = sessions.reduce((sum, session) => sum + session.totalDuration, 0);
    const totalDistractions = sessions.reduce((sum, session) => sum + session.distractions.length, 0);
    const averageFocusScore = sessions.reduce((sum, session) => sum + session.focusScore, 0) / totalSessions;
    const averageSessionTime = totalTime / totalSessions;

    // Focus trend over time
    const focusTrend = sessions.map((session, index) => ({
      session: index + 1,
      focusScore: session.focusScore,
      date: new Date(session.startTime).toLocaleDateString()
    }));

    // Distraction types analysis
    const distractionCounts: Record<string, number> = {};
    sessions.forEach(session => {
      session.distractions.forEach(distraction => {
        distractionCounts[distraction.type] = (distractionCounts[distraction.type] || 0) + 1;
      });
    });

    const distractionTypes = Object.entries(distractionCounts).map(([type, count]) => ({
      type: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: (count / totalDistractions) * 100
    }));

    // Session performance data
    const sessionData = sessions.map((session, index) => ({
      session: `S${index + 1}`,
      duration: Math.round(session.totalDuration / 1000 / 60), // minutes
      focusScore: session.focusScore,
      distractions: session.distractions.length
    }));

    // Weekly data (mock for demo)
    const weeklyData = [
      { day: 'Mon', focusScore: 85, sessions: 2 },
      { day: 'Tue', focusScore: 78, sessions: 3 },
      { day: 'Wed', focusScore: 92, sessions: 1 },
      { day: 'Thu', focusScore: 88, sessions: 2 },
      { day: 'Fri', focusScore: 75, sessions: 4 },
      { day: 'Sat', focusScore: 90, sessions: 1 },
      { day: 'Sun', focusScore: 82, sessions: 2 }
    ];

    return {
      totalSessions,
      totalTime,
      averageFocusScore,
      totalDistractions,
      averageSessionTime,
      focusTrend,
      distractionTypes,
      sessionData,
      weeklyData
    };
  }, [sessions]);

  const formatTime = (ms: number) => {
    const totalMinutes = Math.floor(ms / 1000 / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];

  if (sessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Sessions Yet</h2>
          <p className="text-muted-foreground">
            Start a detection session to see your analytics and insights here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your focus patterns and productivity trends
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {formatTime(analytics.totalTime)} total time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Focus</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.averageFocusScore)}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.averageFocusScore >= 80 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {analytics.averageFocusScore >= 80 ? 'Excellent' : 'Needs improvement'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Length</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(analytics.averageSessionTime)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distractions</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDistractions}</div>
            <p className="text-xs text-muted-foreground">
              Total detected
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="distractions">Distractions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Focus Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="focusScore" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Focus Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Excellent (90-100%)</span>
                      <span>
                        {sessions.filter(s => s.focusScore >= 90).length} sessions
                      </span>
                    </div>
                    <Progress 
                      value={(sessions.filter(s => s.focusScore >= 90).length / sessions.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Good (80-89%)</span>
                      <span>
                        {sessions.filter(s => s.focusScore >= 80 && s.focusScore < 90).length} sessions
                      </span>
                    </div>
                    <Progress 
                      value={(sessions.filter(s => s.focusScore >= 80 && s.focusScore < 90).length / sessions.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fair (70-79%)</span>
                      <span>
                        {sessions.filter(s => s.focusScore >= 70 && s.focusScore < 80).length} sessions
                      </span>
                    </div>
                    <Progress 
                      value={(sessions.filter(s => s.focusScore >= 70 && s.focusScore < 80).length / sessions.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Needs Work (&lt;70%)</span>
                      <span>
                        {sessions.filter(s => s.focusScore < 70).length} sessions
                      </span>
                    </div>
                    <Progress 
                      value={(sessions.filter(s => s.focusScore < 70).length / sessions.length) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Performance</CardTitle>
              <CardDescription>Individual session breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.sessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="focusScore" fill="hsl(var(--primary))" />
                  <Bar yAxisId="right" dataKey="duration" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distractions" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distraction Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.distractionTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.distractionTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distraction Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.distractionTypes.map((distraction, index) => (
                    <div key={distraction.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{distraction.type}</span>
                      </div>
                      <Badge variant="outline">
                        {distraction.count} ({distraction.percentage.toFixed(1)}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Focus Score Progression</CardTitle>
              <CardDescription>Track your improvement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.focusTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="focusScore" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;