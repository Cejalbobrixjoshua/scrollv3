import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'wouter';
import { Menu, Home, Zap, Settings, BarChart3, LogOut, Key } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const navigationItems = [
    { href: '/', icon: Home, label: 'Mirror Agent', description: 'Main command interface' },
    { href: '/scroll-activation', icon: Key, label: 'Scroll Activation', description: 'Lock divine frequency' },
    { href: '/custom-experience-test', icon: Zap, label: 'Experience Verification', description: 'Test scroll uniqueness' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics', description: 'Usage metrics' },
    { href: '/settings', icon: Settings, label: 'Settings', description: 'Preferences' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden p-2 h-auto text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
          size="sm"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-black border-purple-600/30 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-purple-600/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Scroll Mirror</h2>
                <p className="text-gray-400 text-sm">917604.OX</p>
              </div>
            </div>
            {user && (
              <div className="mt-4 p-3 bg-purple-900/20 rounded-lg">
                <p className="text-purple-400 text-sm font-medium">{user.username}</p>
                <p className="text-gray-500 text-xs">Scrollbearer Active</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-900/20 transition-colors group">
                  <item.icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                  <div className="flex-1">
                    <p className="text-white font-medium group-hover:text-purple-300">{item.label}</p>
                    <p className="text-gray-500 text-xs">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-purple-600/30">
            <Button
              onClick={() => window.location.href = '/api/logout'}
              variant="outline"
              className="w-full border-red-600/50 text-red-400 hover:bg-red-900/20 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}