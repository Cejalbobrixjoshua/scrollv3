/**
 * MODULE 7: BROADCAST + EXPORT PANEL
 * UI interface for instant scroll distribution and export
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Share2, 
  FileText, 
  FileImage, 
  Music, 
  Send,
  Copy,
  Eye,
  Zap,
  Radio
} from "lucide-react";

interface ExportOptions {
  format: 'txt' | 'md' | 'json' | 'pdf' | 'mp3';
  include_metadata: boolean;
  include_signature: boolean;
  encryption: boolean;
}

interface BroadcastOptions {
  platform: 'tiktok' | 'threads' | 'twitter' | 'instagram' | 'whop' | 'email';
  customTemplate?: string;
}

interface BroadcastExportPanelProps {
  content: string;
  userId: number;
  sessionId?: number;
  onExport?: (result: any) => void;
  onBroadcast?: (result: any) => void;
}

export function BroadcastExportPanel({
  content,
  userId,
  sessionId,
  onExport,
  onBroadcast
}: BroadcastExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportOptions['format']>('txt');
  const [selectedPlatform, setSelectedPlatform] = useState<BroadcastOptions['platform']>('threads');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'txt',
    include_metadata: true,
    include_signature: true,
    encryption: false
  });
  const [broadcastPreview, setBroadcastPreview] = useState<string>('');
  const [customTemplate, setCustomTemplate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const exportFormats = [
    { value: 'txt' as const, label: 'TXT', icon: FileText, description: 'Raw decree records' },
    { value: 'md' as const, label: 'Markdown', icon: FileText, description: 'Git-based archiving' },
    { value: 'json' as const, label: 'JSON', icon: FileText, description: 'AI training loops' },
    { value: 'pdf' as const, label: 'PDF', icon: FileImage, description: 'Professional documents' },
    { value: 'mp3' as const, label: 'Audio', icon: Music, description: 'Scroll audio enforcement' }
  ];

  const broadcastPlatforms = [
    { value: 'tiktok' as const, label: 'TikTok', limit: 2200, description: 'Caption-ready format' },
    { value: 'threads' as const, label: 'Threads', limit: 500, description: 'Optimized decree post' },
    { value: 'twitter' as const, label: 'Twitter/X', limit: 280, description: 'Force-compressed threads' },
    { value: 'instagram' as const, label: 'Instagram', limit: 2200, description: 'Story + Reel overlay' },
    { value: 'whop' as const, label: 'WHOP', limit: 1000, description: 'Member update feed' },
    { value: 'email' as const, label: 'Email', limit: 0, description: 'HTML transmission' }
  ];

  const handleExport = async () => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "No scroll content available for export",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/broadcast/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          userId,
          sessionId,
          options: { ...exportOptions, format: selectedFormat }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Export Complete",
          description: `Scroll exported as ${result.fileName}`,
        });
        onExport?.(result);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export scroll content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateBroadcastPreview = async () => {
    try {
      const response = await fetch('/api/broadcast/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platform: selectedPlatform,
          customTemplate: customTemplate || undefined
        })
      });
      
      const result = await response.json();
      setBroadcastPreview(result.content);
    } catch (error) {
      toast({
        title: "Preview Failed",
        description: "Failed to generate broadcast preview",
        variant: "destructive",
      });
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastPreview.trim()) {
      await generateBroadcastPreview();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/broadcast/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: broadcastPreview,
          platform: selectedPlatform,
          userId,
          sessionId
        })
      });
      
      const result = await response.json();
      
      toast({
        title: "Broadcast Ready",
        description: `Content prepared for ${selectedPlatform}`,
      });
      onBroadcast?.(result);
    } catch (error) {
      toast({
        title: "Broadcast Failed",
        description: "Failed to prepare broadcast content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <Card className="border-green-600/20 bg-black/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Radio className="h-6 w-6" />
            MODULE 7: BROADCAST + EXPORT SYSTEM
            <Badge variant="outline" className="text-green-400 border-green-600">
              917604.OX
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-300">
            Transform every scroll output into broadcast-ready content or archivable divine documents. 
            Instant distribution across platforms with divine frequency encoding.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Export Section */}
        <Card className="border-blue-600/20 bg-blue-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Scroll Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Format Selection */}
            <div>
              <label className="text-sm text-blue-400 mb-2 block">Export Format:</label>
              <div className="grid grid-cols-2 gap-2">
                {exportFormats.map((format) => (
                  <Button
                    key={format.value}
                    onClick={() => {
                      setSelectedFormat(format.value);
                      setExportOptions(prev => ({ ...prev, format: format.value }));
                    }}
                    variant={selectedFormat === format.value ? "default" : "outline"}
                    className={`justify-start ${
                      selectedFormat === format.value 
                        ? 'bg-blue-600 text-white' 
                        : 'border-blue-600/40 text-blue-400 hover:bg-blue-600/20'
                    }`}
                  >
                    <format.icon className="h-4 w-4 mr-2" />
                    {format.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-2">
              <label className="text-sm text-blue-400 block">Export Options:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-blue-300">
                  <input
                    type="checkbox"
                    checked={exportOptions.include_metadata}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, include_metadata: e.target.checked 
                    }))}
                    className="rounded border-blue-600"
                  />
                  Include Divine Metadata
                </label>
                <label className="flex items-center gap-2 text-sm text-blue-300">
                  <input
                    type="checkbox"
                    checked={exportOptions.include_signature}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, include_signature: e.target.checked 
                    }))}
                    className="rounded border-blue-600"
                  />
                  Include Frequency Signature
                </label>
                <label className="flex items-center gap-2 text-sm text-blue-300">
                  <input
                    type="checkbox"
                    checked={exportOptions.encryption}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, encryption: e.target.checked 
                    }))}
                    className="rounded border-blue-600"
                  />
                  Divine Encryption
                </label>
              </div>
            </div>

            <Button 
              onClick={handleExport}
              disabled={loading || !content.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {loading ? 'Exporting...' : 'Export Scroll'}
            </Button>
          </CardContent>
        </Card>

        {/* Broadcast Section */}
        <Card className="border-purple-600/20 bg-purple-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Broadcast Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Platform Selection */}
            <div>
              <label className="text-sm text-purple-400 mb-2 block">Broadcast Platform:</label>
              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as any)}
                className="w-full bg-black/60 border border-purple-600/40 text-purple-400 rounded px-3 py-2"
              >
                {broadcastPlatforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label} {platform.limit > 0 ? `(${platform.limit} chars)` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Template */}
            <div>
              <label className="text-sm text-purple-400 mb-2 block">Custom Template (Optional):</label>
              <Textarea
                value={customTemplate}
                onChange={(e) => setCustomTemplate(e.target.value)}
                placeholder="Use {CONTENT} as placeholder for scroll content..."
                className="bg-black/60 border border-purple-600/40 text-purple-300 min-h-20"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={generateBroadcastPreview}
                variant="outline"
                className="flex-1 border-purple-600/40 text-purple-400 hover:bg-purple-600/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              
              <Button 
                onClick={handleBroadcast}
                disabled={loading || !content.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Prepare
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Broadcast Preview */}
      {broadcastPreview && (
        <Card className="border-purple-600/20 bg-purple-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Broadcast Preview - {selectedPlatform.toUpperCase()}
              <Button
                onClick={() => copyToClipboard(broadcastPreview)}
                variant="ghost"
                size="sm"
                className="ml-auto"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-black/60 rounded border border-purple-600/40">
              <pre className="text-purple-300 text-sm whitespace-pre-wrap font-mono">
                {broadcastPreview}
              </pre>
            </div>
            
            <div className="mt-3 flex justify-between items-center text-sm">
              <span className="text-purple-400">
                Character Count: {broadcastPreview.length}
              </span>
              {broadcastPlatforms.find(p => p.value === selectedPlatform)?.limit && (
                <span className={`${
                  broadcastPreview.length > (broadcastPlatforms.find(p => p.value === selectedPlatform)?.limit || 0)
                    ? 'text-red-400' : 'text-green-400'
                }`}>
                  Limit: {broadcastPlatforms.find(p => p.value === selectedPlatform)?.limit}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="border-green-600/20 bg-black/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              onClick={() => copyToClipboard(content)}
              variant="outline"
              size="sm"
              className="border-green-600/40 text-green-400 hover:bg-green-600/20"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy Raw
            </Button>
            
            <Button
              onClick={() => {
                setSelectedFormat('txt');
                setExportOptions(prev => ({ ...prev, format: 'txt' }));
                handleExport();
              }}
              variant="outline"
              size="sm"
              className="border-green-600/40 text-green-400 hover:bg-green-600/20"
            >
              <FileText className="h-4 w-4 mr-1" />
              Quick TXT
            </Button>
            
            <Button
              onClick={() => {
                setSelectedPlatform('threads');
                generateBroadcastPreview();
              }}
              variant="outline"
              size="sm"
              className="border-green-600/40 text-green-400 hover:bg-green-600/20"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Threads
            </Button>
            
            <Button
              onClick={() => {
                setSelectedPlatform('tiktok');
                generateBroadcastPreview();
              }}
              variant="outline"
              size="sm"
              className="border-green-600/40 text-green-400 hover:bg-green-600/20"
            >
              <Music className="h-4 w-4 mr-1" />
              TikTok
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}