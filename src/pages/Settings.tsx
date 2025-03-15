
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  BellRing,
  Shield,
  Globe,
  PaintBucket,
  LockKeyhole,
  Languages,
  Database,
  FileJson,
} from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/hooks/use-settings";

const Settings = () => {
  const {
    theme,
    language,
    timeZone,
    dateFormat,
    currency,
    setTheme,
    setLanguage,
    setTimeZone,
    setDateFormat,
    setCurrency,
    timeFormat,
    setTimeFormat
  } = useSettings();

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    desktopNotifications: true,
    lowStockAlerts: true,
    staffScheduleUpdates: true,
    salesReports: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90",
    loginAttempts: "5",
    sessionTimeout: "60",
  });

  const [exportOptions, setExportOptions] = useState({
    restaurantData: true,
    employeeData: true,
    menuData: true,
    salesData: true,
    exportFormat: "csv",
  });

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully");
  };

  const handleSaveAppearance = () => {
    toast.success("Appearance settings saved successfully");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings saved successfully");
  };

  const handleExportData = () => {
    toast.success("Data export initiated");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">
          Manage your application preferences and settings
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:w-3/4">
          <TabsTrigger value="notifications" className="flex items-center justify-center">
            <BellRing className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center justify-center">
            <PaintBucket className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center justify-center">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center justify-center">
            <FileJson className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via text message
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Desktop Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive in-app notifications
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.desktopNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, desktopNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Notifications when inventory is running low
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.lowStockAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Staff Schedule Updates</Label>
                      <p className="text-sm text-gray-500">
                        Notifications when staff schedules change
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.staffScheduleUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, staffScheduleUpdates: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sales Reports</Label>
                      <p className="text-sm text-gray-500">
                        Daily and weekly sales report notifications
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.salesReports}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, salesReports: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-feedme-500 hover:bg-feedme-600"
                  onClick={handleSaveNotifications}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Localization</CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select 
                      id="theme"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select 
                      id="language"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Regional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <select 
                      id="timeZone"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                    >
                      <option value="UTC+1">UTC+1 (Algeria)</option>
                      <option value="UTC+0">UTC+0 (London)</option>
                      <option value="UTC-5">UTC-5 (New York)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <select 
                      id="dateFormat"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                    >
                      <option value="EEEE, MMMM d, yyyy">DD/MM/YYYY</option>
                      <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Time Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <select 
                      id="timeFormat"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={timeFormat}
                      onChange={(e) => setTimeFormat(e.target.value)}
                    >
                      <option value="HH:mm:ss">24-hour (HH:MM:SS)</option>
                      <option value="hh:mm:ss a">12-hour (HH:MM:SS AM/PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Currency</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <select 
                      id="currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="DZD">DZD (Algerian Dinar)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-feedme-500 hover:bg-feedme-600"
                  onClick={handleSaveAppearance}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentication</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">
                        Require a verification code when logging in
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecurity({ ...security, twoFactorAuth: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input 
                      id="passwordExpiry"
                      type="number"
                      value={security.passwordExpiry}
                      onChange={(e) => setSecurity({ ...security, passwordExpiry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                    <Input 
                      id="loginAttempts"
                      type="number"
                      value={security.loginAttempts}
                      onChange={(e) => setSecurity({ ...security, loginAttempts: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout"
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-feedme-500 hover:bg-feedme-600"
                  onClick={handleSaveSecurity}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Export your data for backup or analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Export Data</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Restaurant Data</Label>
                      <p className="text-sm text-gray-500">
                        Include restaurant information in export
                      </p>
                    </div>
                    <Switch
                      checked={exportOptions.restaurantData}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, restaurantData: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Employee Data</Label>
                      <p className="text-sm text-gray-500">
                        Include employee information in export
                      </p>
                    </div>
                    <Switch
                      checked={exportOptions.employeeData}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, employeeData: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Menu Data</Label>
                      <p className="text-sm text-gray-500">
                        Include menu items in export
                      </p>
                    </div>
                    <Switch
                      checked={exportOptions.menuData}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, menuData: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sales Data</Label>
                      <p className="text-sm text-gray-500">
                        Include sales information in export
                      </p>
                    </div>
                    <Switch
                      checked={exportOptions.salesData}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, salesData: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Export Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exportFormat">File Format</Label>
                    <select 
                      id="exportFormat"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={exportOptions.exportFormat}
                      onChange={(e) => setExportOptions({ ...exportOptions, exportFormat: e.target.value })}
                    >
                      <option value="csv">CSV</option>
                      <option value="excel">Excel</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-feedme-500 hover:bg-feedme-600"
                  onClick={handleExportData}
                >
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
