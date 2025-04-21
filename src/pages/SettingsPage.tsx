import React from 'react';
import { Save, Moon, Sun, Bell, Languages, Database, ArrowUpDown } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import useThemeStore from '../store/themeStore';

const SettingsPage: React.FC = () => {
  const { mode, setTheme } = useThemeStore();
  
  const handleExportData = () => {
    // Get all data from local storage
    const tasks = localStorage.getItem('tasks-storage');
    const habits = localStorage.getItem('habits-storage');
    const notes = localStorage.getItem('notes-storage');
    const theme = localStorage.getItem('theme-storage');
    
    // Combine all data
    const data = {
      tasks: tasks ? JSON.parse(tasks) : null,
      habits: habits ? JSON.parse(habits) : null,
      notes: notes ? JSON.parse(notes) : null,
      theme: theme ? JSON.parse(theme) : null,
    };
    
    // Create a blob and download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifehub-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Import each store's data
        if (data.tasks) localStorage.setItem('tasks-storage', JSON.stringify(data.tasks));
        if (data.habits) localStorage.setItem('habits-storage', JSON.stringify(data.habits));
        if (data.notes) localStorage.setItem('notes-storage', JSON.stringify(data.notes));
        if (data.theme) localStorage.setItem('theme-storage', JSON.stringify(data.theme));
        
        // Reload the page to apply changes
        window.location.reload();
      } catch (error) {
        alert('Error importing data. Please make sure the file is valid.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <PageContainer
      title="Settings"
      description="Customize your LifeHub experience"
    >
      <div className="space-y-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sun className="mr-2 h-5 w-5" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Theme</label>
                <div className="flex space-x-4">
                  <Button
                    variant={mode === 'light' ? 'primary' : 'outline'}
                    onClick={() => setTheme('light')}
                    size="md"
                    icon={<Sun className="h-4 w-4 mr-2" />}
                  >
                    Light
                  </Button>
                  <Button
                    variant={mode === 'dark' ? 'primary' : 'outline'}
                    onClick={() => setTheme('dark')}
                    size="md"
                    icon={<Moon className="h-4 w-4 mr-2" />}
                  >
                    Dark
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Task Reminders</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications for upcoming tasks
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Habit Tracking</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive daily reminders for habits
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              <span>Data Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Export/Import Data</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Backup your tasks, habits, and notes or restore from a previous backup
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    icon={<ArrowUpDown className="h-4 w-4 mr-2" />}
                  >
                    Export Data
                  </Button>
                  
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('import-file')?.click()}
                      icon={<ArrowUpDown className="h-4 w-4 mr-2" />}
                    >
                      Import Data
                    </Button>
                    <input
                      id="import-file"
                      type="file"
                      accept="application/json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Clear Data</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  This will delete all your tasks, habits, and notes. This action cannot be undone.
                </p>
                <Button variant="danger">
                  Clear All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Languages className="mr-2 h-5 w-5" />
              <span>Language</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="text-sm font-medium block mb-2">
                  Select Language
                </label>
                <select
                  id="language"
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white w-full max-w-xs"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            icon={<Save className="h-4 w-4 mr-2" />}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;