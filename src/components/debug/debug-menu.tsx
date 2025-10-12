'use client';

import { Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TempAccountManager } from './temp-account-manager';

export function DebugMenu() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg"
          aria-label="Open debug menu"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" side="top" align="start">
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account Manager</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <TempAccountManager />
          </TabsContent>
          <TabsContent value="settings">
            <div className="p-4 text-center text-sm text-muted-foreground">
              General debug settings will go here.
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
