"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Manage your application preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="autoUpdate">Enable Automatic Updates</Label>
            <Switch
              id="autoUpdate"
              checked={autoUpdateEnabled}
              onCheckedChange={setAutoUpdateEnabled}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label>Theme</Label>
            <ModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
