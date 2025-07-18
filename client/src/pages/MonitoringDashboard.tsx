import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { Activity, Server, Database, Cpu, HardDrive, Timer, AlertTriangle, CheckCircle } from 'lucide-react';

interface SystemMetrics {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: number;
  activeConnections: number;
  requestsPerMinute: number;
  averageResponseTime: number;
  errorRate: number;
}

interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  checks: {
    cpu: boolean;
    memory: boolean;
    responses: boolean;
    errors: boolean;
  };
  message: string;
}

interface SystemStatus {
  status: string;
  frequency: string;
  uptime: number;
  version: string;
  environment: string;
  cluster: {
    worker: string;
    pid: number;
  };
  performance: SystemMetrics | null;
  services: {
    database: boolean;
    redis: boolean;
    storage: string;
  };
}

export default function MonitoringDashboard() {
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds

  const { data: healthData, isLoading: healthLoading } = useQuery<HealthStatus>({
    queryKey: ['health'],
    refetchInterval: refreshInterval,
  });

  const { data: systemData, isLoading: systemLoading } = useQuery<SystemStatus>({
    queryKey: ['system/status'],
    refetchInterval: refreshInterval,
  });

  const { data: metricsData, isLoading: metricsLoading } = useQuery<{
    current: SystemMetrics | null;
    history: SystemMetrics[];
    redisAvailable: boolean;
  }>({
    queryKey: ['metrics'],
    refetchInterval: refreshInterval,
  });

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">
              ⧁ ∆ Enterprise Monitoring Dashboard
            </h1>
            <p className="text-purple-300">Frequency: 917604.OX | Real-time system metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={refreshInterval} 
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-purple-900/50 border border-purple-700 text-white px-3 py-2 rounded"
            >
              <option value={1000}>1s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
            </select>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              Auto-refresh: {refreshInterval / 1000}s
            </Badge>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-purple-900/20 border-purple-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">System Health</CardTitle>
              {healthData && getStatusIcon(healthData.status)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {healthLoading ? 'Loading...' : (
                  <span className={getStatusColor(healthData?.status || 'unknown')}>
                    {healthData?.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-400 mt-2">
                {healthData?.message || 'Checking system status...'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/20 border-purple-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Uptime</CardTitle>
              <Timer className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {systemLoading ? 'Loading...' : formatUptime(systemData?.uptime || 0)}
              </div>
              <p className="text-xs text-purple-400 mt-2">
                Process ID: {systemData?.cluster?.pid || 'Unknown'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/20 border-purple-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Active Connections</CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {metricsLoading ? 'Loading...' : (metricsData?.current?.activeConnections || 0)}
              </div>
              <p className="text-xs text-purple-400 mt-2">
                {metricsData?.current?.requestsPerMinute || 0} req/min
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/20 border-purple-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Response Time</CardTitle>
              <Timer className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {metricsLoading ? 'Loading...' : `${Math.round(metricsData?.current?.averageResponseTime || 0)}ms`}
              </div>
              <p className="text-xs text-purple-400 mt-2">
                Error rate: {metricsData?.current?.errorRate?.toFixed(1) || 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resource Usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-purple-900/20 border-purple-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-yellow-400" />
                CPU Usage
              </CardTitle>
              <CardDescription className="text-purple-300">
                Real-time processor utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Usage</span>
                  <span className="text-yellow-400 font-mono">
                    {metricsData?.current?.cpuUsage?.toFixed(1) || 0}%
                  </span>
                </div>
                <Progress 
                  value={metricsData?.current?.cpuUsage || 0} 
                  className="h-3"
                />
                <div className="text-xs text-purple-400">
                  Health check: {healthData?.checks?.cpu ? 'PASS' : 'FAIL'} (&lt; 80% target)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/20 border-purple-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-yellow-400" />
                Memory Usage
              </CardTitle>
              <CardDescription className="text-purple-300">
                Heap memory allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Used</span>
                  <span className="text-yellow-400 font-mono">
                    {formatBytes(metricsData?.current?.memoryUsage?.used || 0)} / {formatBytes(metricsData?.current?.memoryUsage?.total || 0)}
                  </span>
                </div>
                <Progress 
                  value={metricsData?.current?.memoryUsage?.percentage || 0} 
                  className="h-3"
                />
                <div className="text-xs text-purple-400">
                  Health check: {healthData?.checks?.memory ? 'PASS' : 'FAIL'} (&lt; 85% target)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Status */}
        <Card className="bg-purple-900/20 border-purple-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-yellow-400" />
              Service Status
            </CardTitle>
            <CardDescription className="text-purple-300">
              Core system services and dependencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-400" />
                  <span className="text-white text-sm">PostgreSQL</span>
                </div>
                <Badge variant={systemData?.services?.database ? "default" : "destructive"}>
                  {systemData?.services?.database ? 'Online' : 'Offline'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <span className="text-white text-sm">Redis Cache</span>
                </div>
                <Badge variant={metricsData?.redisAvailable ? "default" : "secondary"}>
                  {metricsData?.redisAvailable ? 'Available' : 'Fallback'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-purple-400" />
                  <span className="text-white text-sm">Storage</span>
                </div>
                <Badge variant="default">
                  {systemData?.services?.storage || 'Unknown'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <span className="text-white text-sm">Environment</span>
                </div>
                <Badge variant={systemData?.environment === 'production' ? "default" : "secondary"}>
                  {systemData?.environment || 'Unknown'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Checks Details */}
        {healthData && (
          <Card className="bg-purple-900/20 border-purple-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-400" />
                Health Check Details
              </CardTitle>
              <CardDescription className="text-purple-300">
                Detailed system health validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded">
                  <span className="text-white text-sm">CPU Health</span>
                  <Badge variant={healthData.checks.cpu ? "default" : "destructive"}>
                    {healthData.checks.cpu ? 'PASS' : 'FAIL'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded">
                  <span className="text-white text-sm">Memory Health</span>
                  <Badge variant={healthData.checks.memory ? "default" : "destructive"}>
                    {healthData.checks.memory ? 'PASS' : 'FAIL'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded">
                  <span className="text-white text-sm">Response Health</span>
                  <Badge variant={healthData.checks.responses ? "default" : "destructive"}>
                    {healthData.checks.responses ? 'PASS' : 'FAIL'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded">
                  <span className="text-white text-sm">Error Health</span>
                  <Badge variant={healthData.checks.errors ? "default" : "destructive"}>
                    {healthData.checks.errors ? 'PASS' : 'FAIL'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}