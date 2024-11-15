import { Header } from '@/components/header';
import { useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Settings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={settings.apiKey || ''}
                onChange={(e) => updateSettings({ apiKey: e.target.value })}
                placeholder="sk-..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(theme) => 
                  updateSettings({ theme: theme as 'light' | 'dark' | 'system' })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => updateSettings({ apiKey: '', theme: 'system' })}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}