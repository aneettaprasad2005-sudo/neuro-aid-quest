import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Camera, 
  Shield, 
  Volume2, 
  Eye, 
  Brain,
  Settings as SettingsIcon,
  Download,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [sensitivity, setSensitivity] = useState([75]);
  const [detectionInterval, setDetectionInterval] = useState("1000");
  const [cameraQuality, setCameraQuality] = useState("720p");
  const [autoSave, setAutoSave] = useState(true);
  const [dataRetention, setDataRetention] = useState("30");
  const [darkMode, setDarkMode] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // In a real app, save to localStorage or database
    localStorage.setItem('focusguard-settings', JSON.stringify({
      notifications,
      soundAlerts,
      sensitivity: sensitivity[0],
      detectionInterval,
      cameraQuality,
      autoSave,
      dataRetention,
      darkMode,
      privacyMode
    }));
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleResetSettings = () => {
    setNotifications(true);
    setSoundAlerts(false);
    setSensitivity([75]);
    setDetectionInterval("1000");
    setCameraQuality("720p");
    setAutoSave(true);
    setDataRetention("30");
    setDarkMode(false);
    setPrivacyMode(true);
    
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults.",
    });
  };

  const handleExportData = () => {
    // Mock data export
    const data = {
      settings: {
        notifications,
        soundAlerts,
        sensitivity: sensitivity[0],
        detectionInterval,
        cameraQuality,
        autoSave,
        dataRetention,
        darkMode,
        privacyMode
      },
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'focusguard-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your settings have been downloaded as a JSON file.",
    });
  };

  const handleClearData = () => {
    localStorage.removeItem('focusguard-settings');
    localStorage.removeItem('focusguard-sessions');
    
    toast({
      title: "Data Cleared",
      description: "All local data has been removed.",
      variant: "destructive"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your FocusGuard AI experience and detection preferences
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Detection Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Detection Settings
            </CardTitle>
            <CardDescription>
              Configure how the AI detects and responds to distractions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sensitivity">Detection Sensitivity</Label>
              <div className="px-3">
                <Slider
                  id="sensitivity"
                  min={25}
                  max={100}
                  step={5}
                  value={sensitivity}
                  onValueChange={setSensitivity}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Less Sensitive</span>
                  <span>{sensitivity[0]}%</span>
                  <span>More Sensitive</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interval">Detection Interval</Label>
                <Select value={detectionInterval} onValueChange={setDetectionInterval}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500">0.5 seconds</SelectItem>
                    <SelectItem value="1000">1 second</SelectItem>
                    <SelectItem value="2000">2 seconds</SelectItem>
                    <SelectItem value="5000">5 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">Camera Quality</Label>
                <Select value={cameraQuality} onValueChange={setCameraQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p (Fast)</SelectItem>
                    <SelectItem value="720p">720p (Balanced)</SelectItem>
                    <SelectItem value="1080p">1080p (High Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications & Alerts
            </CardTitle>
            <CardDescription>
              Control how you receive distraction alerts and feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Visual Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show on-screen alerts when distractions are detected
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound">Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Play audio alerts for distraction events
                </p>
              </div>
              <Switch
                id="sound"
                checked={soundAlerts}
                onCheckedChange={setSoundAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Data Management
            </CardTitle>
            <CardDescription>
              Control how your data is handled and stored
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="privacy">Privacy Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Process all data locally - nothing sent to servers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Always On</Badge>
                <Switch
                  id="privacy"
                  checked={privacyMode}
                  onCheckedChange={setPrivacyMode}
                  disabled
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autosave">Auto-save Sessions</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save session data for analytics
                </p>
              </div>
              <Switch
                id="autosave"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retention">Data Retention Period</Label>
              <Select value={dataRetention} onValueChange={setDataRetention}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Accessibility
            </CardTitle>
            <CardDescription>
              Customize the interface for better accessibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkmode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme to reduce eye strain
                </p>
              </div>
              <Switch
                id="darkmode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> More accessibility options coming soon, including:
                high contrast mode, font size adjustment, and screen reader support.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Management Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export or clear your data and reset preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
              <Button onClick={handleClearData} variant="outline" className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </Button>
              <Button onClick={handleResetSettings} variant="outline">
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Save Settings
          </Button>
          <Button variant="outline" onClick={handleResetSettings}>
            Cancel Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;