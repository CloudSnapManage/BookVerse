'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useSettings } from '@/hooks/use-settings';
import { Loader2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SettingsDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { tmdbApiKey, setTmdbApiKey } = useSettings();
  const [keyInput, setKeyInput] = useState(tmdbApiKey || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (tmdbApiKey) {
      setKeyInput(tmdbApiKey);
    }
  }, [tmdbApiKey]);

  const handleSave = () => {
    setIsSaving(true);
    setTmdbApiKey(keyInput);
    setTimeout(() => {
        toast({
            title: 'Settings Saved',
            description: 'Your TMDb API key has been updated.',
        });
        setIsSaving(false);
        setOpen(false);
    }, 500);
  };

  const Trigger = children ? (
    <DialogTrigger asChild>{children}</DialogTrigger>
  ) : (
    <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Settings className="h-4 w-4" />
        <span className="sr-only">Settings</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {Trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application settings here. Your API keys are stored securely in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tmdb-api-key" className="text-right">
              TMDb API Key
            </Label>
            <Input
              id="tmdb-api-key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="col-span-3"
              placeholder="Enter your v3 API key"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
