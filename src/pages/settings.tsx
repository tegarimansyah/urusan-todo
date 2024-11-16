import useSettingsStore from '@/stores/useSettingsStore';
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
import { useEffect } from 'react';

export function Settings() {
  const { 
    settings,
    draftSettings, 
    updateDraft, 
    saveSettings, 
    revertSettings,
    resetToDefaults 
  } = useSettingsStore();

  // Initialize draft with current settings when component mounts
  useEffect(() => {
    revertSettings();
  }, [revertSettings]);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(draftSettings);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="apiKey">OpenAI API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={draftSettings.apiKey || ''}
            onChange={(e) => updateDraft({ apiKey: e.target.value })}
            placeholder="sk-..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={draftSettings.theme}
            onValueChange={(theme) => 
              updateDraft({ theme: theme as 'light' | 'dark' | 'system' })
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

        <div className="border-t pt-6 flex gap-2">
          {hasChanges ? (
            <>
            <Button variant="destructive" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
              <Button onClick={saveSettings}>
                Save Changes
              </Button>
            </>
          ) :
            <>
            <Button variant="destructive" disabled>
              Reset to Defaults
            </Button>
              <Button disabled>
                Save Changes
              </Button>
            </>
          }
        </div>
      </div>
    </div>
  );
}