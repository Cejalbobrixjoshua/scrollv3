/**
 * ENTERPRISE MONITORING SYSTEM
 * Real-time performance metrics and health monitoring
 * Frequency: 917604.OX
 */

import os from 'os';
import { performance } from 'perf_hooks';

export interface SystemMetrics {
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

export class MonitoringSystem {
  private metrics: SystemMetrics[] = [];
  private maxMetricsHistory = 1440; // 24 hours of minute-by-minute data
  private requestCounts: number[] = [];
  private responseTimes: number[] = [];
  private errorCounts: number[] = [];
  private activeConnections = 0;

  constructor() {
    // Collect metrics every minute
    setInterval(() => this.collectMetrics(), 60000);
    
    // Clean up old metrics every hour
    setInterval(() => this.cleanupOldMetrics(), 3600000);
  }

  private async collectMetrics() {
    const now = new Date();
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    
    // Calculate CPU usage
    const cpuUsage = await this.getCpuUsage();
    
    // Calculate request metrics for the last minute
    const requestsLastMinute = this.requestCounts.length;
    const avgResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;
    const errorRate = this.errorCounts.length > 0 
      ? (this.errorCounts.reduce((a, b) => a + b, 0) / requestsLastMinute) * 100 
      : 0;

    const metrics: SystemMetrics = {
      timestamp: now,
      cpuUsage,
      memoryUsage: {
        used: memUsage.heapUsed,
        total: totalMem,
        percentage: (memUsage.heapUsed / totalMem) * 100
      },
      uptime: process.uptime(),
      activeConnections: this.activeConnections,
      requestsPerMinute: requestsLastMinute,
      averageResponseTime: avgResponseTime,
      errorRate
    };

    this.metrics.push(metrics);
    
    // Reset counters for next minute
    this.requestCounts = [];
    this.responseTimes = [];
    this.errorCounts = [];
  }

  private async getCpuUsage(): Promise<number> {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      const startTime = performance.now();
      
      setTimeout(() => {
        const currentUsage = process.cpuUsage(startUsage);
        const currentTime = performance.now();
        
        const elapsedTime = currentTime - startTime;
        const elapsedUserTime = currentUsage.user / 1000; // Convert to milliseconds
        const elapsedSystemTime = currentUsage.system / 1000;
        const totalElapsedTime = elapsedUserTime + elapsedSystemTime;
        
        const cpuPercent = (totalElapsedTime / elapsedTime) * 100;
        resolve(Math.min(100, Math.max(0, cpuPercent)));
      }, 100);
    });
  }

  private cleanupOldMetrics() {
    const cutoffTime = new Date(Date.now() - (24 * 60 * 60 * 1000)); // 24 hours ago
    this.metrics = this.metrics.filter(metric => metric.timestamp > cutoffTime);
  }

  // Public methods for tracking
  recordRequest(responseTimeMs: number, isError: boolean = false) {
    this.requestCounts.push(1);
    this.responseTimes.push(responseTimeMs);
    if (isError) {
      this.errorCounts.push(1);
    } else {
      this.errorCounts.push(0);
    }
  }

  connectionOpened() {
    this.activeConnections++;
  }

  connectionClosed() {
    this.activeConnections = Math.max(0, this.activeConnections - 1);
  }

  getCurrentMetrics(): SystemMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  getMetricsHistory(hours: number = 1): SystemMetrics[] {
    const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
    return this.metrics.filter(metric => metric.timestamp > cutoffTime);
  }

  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    checks: {
      cpu: boolean;
      memory: boolean;
      responses: boolean;
      errors: boolean;
    };
    message: string;
  } {
    const current = this.getCurrentMetrics();
    if (!current) {
      return {
        status: 'warning',
        checks: { cpu: false, memory: false, responses: false, errors: false },
        message: 'No metrics available'
      };
    }

    const checks = {
      cpu: current.cpuUsage < 80,
      memory: current.memoryUsage.percentage < 85,
      responses: current.averageResponseTime < 1000,
      errors: current.errorRate < 5
    };

    const failedChecks = Object.values(checks).filter(check => !check).length;
    
    let status: 'healthy' | 'warning' | 'critical';
    if (failedChecks === 0) {
      status = 'healthy';
    } else if (failedChecks <= 2) {
      status = 'warning';
    } else {
      status = 'critical';
    }

    return {
      status,
      checks,
      message: status === 'healthy' 
        ? '⧁ ∆ All systems operational - Frequency 917604.OX'
        : `⧁ ∆ System alerts detected - ${failedChecks} checks failing`
    };
  }
}

export const monitoring = new MonitoringSystem();