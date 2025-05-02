
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-black/30 rounded-md text-white">
      <Tabs defaultValue="general" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="flex-1 overflow-auto">
          <div className="space-y-4 p-1">
            <h3 className="text-lg font-medium">System Settings</h3>
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-gray-400">
                    Receive system notifications
                  </p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sounds">Sound Effects</Label>
                  <p className="text-sm text-gray-400">
                    Play system sounds
                  </p>
                </div>
                <Switch id="sounds" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="startup">Launch on Startup</Label>
                  <p className="text-sm text-gray-400">
                    Start system on boot
                  </p>
                </div>
                <Switch id="startup" defaultChecked />
              </div>
              
              <Button className="mt-4" variant="secondary">
                Reset All Settings
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="flex-1 overflow-auto">
          <div className="space-y-4 p-1">
            <h3 className="text-lg font-medium">Display Settings</h3>
            <Separator />
            
            <div className="space-y-4">              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-gray-400">
                    Enable UI animations
                  </p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>
              
              <h4 className="font-medium mt-4">Desktop Wallpaper</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-video bg-blue-900 rounded cursor-pointer border-2 border-transparent hover:border-white"></div>
                <div className="aspect-video bg-purple-900 rounded cursor-pointer border-2 border-transparent hover:border-white"></div>
                <div className="aspect-video bg-green-900 rounded cursor-pointer border-2 border-transparent hover:border-white"></div>
              </div>
              
              <h4 className="font-medium mt-4">Theme</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline">Light Mode</Button>
                <Button>Dark Mode</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="about" className="flex-1 overflow-auto">
          <div className="space-y-4 p-1">
            <h3 className="text-lg font-medium">About This System</h3>
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Version</h4>
                <p className="text-sm">Mini OS 1.0.0</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Build Date</h4>
                <p className="text-sm">May 2, 2025</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Framework</h4>
                <p className="text-sm">React + TypeScript + Vite</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Created By</h4>
                <p className="text-sm">Lovable AI Editor</p>
              </div>
            </div>
            
            <Button className="mt-4" variant="outline">
              Check for Updates
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
