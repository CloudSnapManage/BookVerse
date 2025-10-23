'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useSettings } from '@/hooks/use-settings';
import { Switch } from './ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function SettingsDialog({ children }: { children?: React.ReactNode }) {
  const { isTmdbEnabled, tmdbApiKey, setTmdbEnabled, saveTmdbApiKey } = useSettings();
  const [localApiKey, setLocalApiKey] = useState(tmdbApiKey || '');
  const [localTmdbEnabled, setLocalTmdbEnabled] = useState(isTmdbEnabled);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    saveTmdbApiKey(localApiKey);
    setTmdbEnabled(localTmdbEnabled);
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated.',
    });
    setIsOpen(false);
  };
  
  // Sync local state when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setLocalApiKey(tmdbApiKey || '');
      setLocalTmdbEnabled(isTmdbEnabled);
    }
    setIsOpen(open);
  }

  const Trigger = children ? <DialogTrigger asChild>{children}</DialogTrigger> : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {Trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage application settings and API keys.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-medium">TMDb (Movies & K-Dramas)</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="tmdb-enabled" className="flex flex-col gap-1">
                    <span>Enable Movie & K-Drama Search</span>
                    <span className="font-normal text-xs text-muted-foreground">Requires a TMDb API Key.</span>
                </Label>
                <Switch
                    id="tmdb-enabled"
                    checked={localTmdbEnabled}
                    onCheckedChange={setLocalTmdbEnabled}
                />
              </div>
            <div className="space-y-2">
                <Label htmlFor="tmdb-api-key">TMDb API Key (v3 Auth)</Label>
                <Input
                    id="tmdb-api-key"
                    type="password"
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    placeholder="Enter your TMDb API Key"
                />
                 <p className="text-xs text-muted-foreground">
                    Don't have a key?{' '}
                    <Button variant="link" asChild className="p-0 h-auto text-xs">
                        <Link href="https://www.themoviedb.org/signup" target="_blank" rel="noopener noreferrer">
                            Get one for free from TMDb <ExternalLink className='inline-block ml-1 h-3 w-3' />
                        </Link>
                    </Button>
                </p>
            </div>
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                 <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
