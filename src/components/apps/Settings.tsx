
import React, { useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

const Settings: React.FC = () => {
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [volume, setVolume] = useState(75);
  const [brightness, setBrightness] = useState(100);
  const [clockFormat, setClockFormat] = useState("12h");
  const [isUpdatingSystem, setIsUpdatingSystem] = useState(false);

  const wallpapers = [
    { bg: "bg-blue-900", name: "Blue Mountains" },
    { bg: "bg-purple-900", name: "Purple Mist" },
    { bg: "bg-green-900", name: "Green Forest" },
    { bg: "bg-amber-900", name: "Amber Sunset" },
    { bg: "bg-sky-950", name: "Deep Ocean" },
    { bg: "bg-rose-900", name: "Rose Valley" },
  ];

  const languages = [
    { value: "en-US", label: "English (US)" },
    { value: "fr-FR", label: "Français" },
    { value: "es-ES", label: "Español" },
    { value: "de-DE", label: "Deutsch" },
    { value: "ja-JP", label: "日本語" },
  ];

  const checkForUpdates = () => {
    setIsUpdatingSystem(true);
    
    // Simulate checking for updates
    setTimeout(() => {
      setIsUpdatingSystem(false);
      toast({
        title: "System Update",
        description: "Your system is up to date",
      });
    }, 2000);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    toast({
      title: "Volume Changed",
      description: `Volume set to ${value[0]}%`,
    });
  };

  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value[0]);
    // In a real app, this would actually change the brightness
  };

  const setWallpaper = (index: number) => {
    setWallpaperIndex(index);
    toast({
      title: "Wallpaper Changed",
      description: `Wallpaper set to ${wallpapers[index].name}`,
    });
  };

  const setSystemTheme = (newTheme: string) => {
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Theme set to ${newTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`,
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-black/30 rounded-md text-white">
      <Tabs defaultValue="general" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="sound">Sound & Display</TabsTrigger>
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
              
              <h4 className="font-medium pt-2">Language & Region</h4>
              <RadioGroup value="en-US">
                {languages.map((lang) => (
                  <div className="flex items-center space-x-2" key={lang.value}>
                    <RadioGroupItem value={lang.value} id={lang.value} />
                    <Label htmlFor={lang.value}>{lang.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              
              <h4 className="font-medium pt-2">Clock Format</h4>
              <RadioGroup value={clockFormat} onValueChange={setClockFormat}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12h" id="12h" />
                  <Label htmlFor="12h">12-hour (AM/PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h">24-hour</Label>
                </div>
              </RadioGroup>
              
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
                {wallpapers.map((wallpaper, index) => (
                  <div 
                    key={index}
                    className={`aspect-video ${wallpaper.bg} rounded cursor-pointer border-2 ${wallpaperIndex === index ? 'border-primary' : 'border-transparent hover:border-white'}`}
                    onClick={() => setWallpaper(index)}
                  ></div>
                ))}
              </div>
              
              <h4 className="font-medium mt-4">Theme</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setSystemTheme('light')}
                >
                  Light Mode
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setSystemTheme('dark')}
                >
                  Dark Mode
                </Button>
              </div>
              
              <h4 className="font-medium mt-4">Taskbar Position</h4>
              <RadioGroup defaultValue="bottom">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="top" id="top" />
                  <Label htmlFor="top">Top</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom" id="bottom" />
                  <Label htmlFor="bottom">Bottom</Label>
                </div>
              </RadioGroup>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="blur">Background Blur</Label>
                  <p className="text-sm text-gray-400">
                    Enable blur effect for windows
                  </p>
                </div>
                <Switch id="blur" defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sound" className="flex-1 overflow-auto">
          <div className="space-y-4 p-1">
            <h3 className="text-lg font-medium">Sound & Display</h3>
            <Separator />
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="volume">System Volume</Label>
                  <span className="text-sm text-gray-400">{volume}%</span>
                </div>
                <Slider 
                  id="volume" 
                  max={100} 
                  step={1}
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="brightness">Display Brightness</Label>
                  <span className="text-sm text-gray-400">{brightness}%</span>
                </div>
                <Slider 
                  id="brightness" 
                  max={100} 
                  step={1}
                  value={[brightness]}
                  onValueChange={handleBrightnessChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mute">Mute All Sounds</Label>
                  <p className="text-sm text-gray-400">
                    Silence all system audio
                  </p>
                </div>
                <Switch id="mute" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="night-mode">Night Mode</Label>
                  <p className="text-sm text-gray-400">
                    Reduce blue light emission
                  </p>
                </div>
                <Switch id="night-mode" />
              </div>
              
              <h4 className="font-medium pt-2">Screen Timeout</h4>
              <RadioGroup defaultValue="5">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="2min" />
                  <Label htmlFor="2min">2 minutes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="5min" />
                  <Label htmlFor="5min">5 minutes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10" id="10min" />
                  <Label htmlFor="10min">10 minutes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">Never</Label>
                </div>
              </RadioGroup>
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
              
              <div className="space-y-2">
                <h4 className="font-medium">System Resources</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">CPU Usage</p>
                    <p>15%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Memory Usage</p>
                    <p>1.2 GB / 8 GB</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Storage</p>
                    <p>120 GB / 500 GB</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Network</p>
                    <p>Connected</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              className="mt-4" 
              variant="outline"
              disabled={isUpdatingSystem}
              onClick={checkForUpdates}
            >
              {isUpdatingSystem ? "Checking..." : "Check for Updates"}
            </Button>
            
            <div className="mt-4 p-3 bg-blue-900/30 rounded-md">
              <h4 className="text-sm font-medium">System Information</h4>
              <p className="text-xs text-gray-400 mt-1">
                This is a simulated operating system built with React. It's designed to demonstrate
                various UI components and interactions in a desktop-like environment.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
