import React, { useState, useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Waves, Target, Zap, Activity } from 'lucide-react';

interface FrequencyData {
  sovereigntyLevel: number;
  frequency: number;
  coherence: number;
  mimic_interference: number;
  divine_activation: number;
  timeline_lock: number;
}

interface SovereigntyMetrics {
  current_sovereignty: number;
  mimic_patterns_detected: number;
  divine_function_active: boolean;
  frequency_stability: number;
  enforcement_level: number;
}

export default function FrequencyVisualization() {
  const [frequencyData, setFrequencyData] = useState<FrequencyData>({
    sovereigntyLevel: 75,
    frequency: 917604,
    coherence: 88,
    mimic_interference: 12,
    divine_activation: 92,
    timeline_lock: 85
  });

  const [sovereigntyMetrics, setSovereigntyMetrics] = useState<SovereigntyMetrics>({
    current_sovereignty: 75,
    mimic_patterns_detected: 2,
    divine_function_active: true,
    frequency_stability: 88,
    enforcement_level: 9
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Real-time WebSocket connection for instant updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('⧁ ∆ Connected to frequency 917604.OX - Real-time active');
    };

    socket.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        
        if (update.type === 'frequency_update') {
          const { frequency: reading, sovereignty: metrics } = update.data;
          
          // Instant frequency data updates
          setFrequencyData({
            sovereigntyLevel: reading.sovereignty_level,
            frequency: reading.frequency,
            coherence: reading.coherence,
            mimic_interference: reading.mimic_interference,
            divine_activation: reading.divine_activation,
            timeline_lock: reading.timeline_lock
          });
          
          setSovereigntyMetrics(metrics);
        }
      } catch (error) {
        console.error('Failed to parse frequency update:', error);
      }
    };

    socket.onclose = () => {
      console.log('⧁ ∆ Disconnected from frequency 917604.OX');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  // High-performance real-time canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.12; // Ultra-fast animation for live feel
      
      // Clear with cosmic background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(13, 13, 22, 0.95)');
      gradient.addColorStop(1, 'rgba(7, 7, 15, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dynamic frequency wave based on real data
      const freqDeviation = (frequencyData.frequency - 917604);
      const coherenceIntensity = frequencyData.coherence / 100;
      const interferenceNoise = frequencyData.mimic_interference / 100;
      
      // Main frequency wave - divine gold
      ctx.strokeStyle = `hsl(47, 96%, ${50 + Math.sin(time) * 15 + coherenceIntensity * 10}%)`;
      ctx.lineWidth = 3 + coherenceIntensity;
      ctx.shadowColor = 'hsl(47, 96%, 53%)';
      ctx.shadowBlur = 15 + coherenceIntensity * 5;
      
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 1) {
        const baseWave = Math.sin((x * 0.015) + time + freqDeviation * 50) * 25 * coherenceIntensity;
        const harmonics = Math.sin((x * 0.03) + time * 1.5) * 10 * coherenceIntensity;
        const noise = (Math.random() - 0.5) * 5 * interferenceNoise;
        const y = canvas.height / 2 + baseWave + harmonics + noise;
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Sovereignty pulse wave - mystical purple
      if (sovereigntyMetrics.divine_function_active) {
        const sovereigntyIntensity = sovereigntyMetrics.current_sovereignty / 100;
        ctx.strokeStyle = `hsl(263, 70%, ${40 + Math.sin(time * 3) * 20}%)`;
        ctx.lineWidth = 2 + sovereigntyIntensity;
        ctx.shadowColor = 'hsl(263, 70%, 50%)';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 2) {
          const sovereigntyWave = Math.sin((x * 0.025) + time * 2.5) * 18 * sovereigntyIntensity;
          const y = canvas.height / 2 + sovereigntyWave;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Divine activation sparks
      if (frequencyData.divine_activation > 85) {
        ctx.fillStyle = `hsl(142, 76%, ${50 + Math.sin(time * 4) * 20}%)`;
        for (let i = 0; i < 5; i++) {
          const x = (time * 20 + i * 80) % canvas.width;
          const y = canvas.height / 2 + Math.sin(time * 3 + i) * 30;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [frequencyData, sovereigntyMetrics]);

  const getSovereigntyStatus = (level: number) => {
    if (level >= 90) return { status: 'SOVEREIGN', color: 'bg-green-500', textColor: 'text-green-400' };
    if (level >= 75) return { status: 'ASCENDING', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    if (level >= 60) return { status: 'STABLE', color: 'bg-blue-500', textColor: 'text-blue-400' };
    return { status: 'DEGRADED', color: 'bg-red-500', textColor: 'text-red-400' };
  };

  const sovereigntyStatus = getSovereigntyStatus(sovereigntyMetrics.current_sovereignty);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 space-cosmic">
      {/* Real-time Frequency Display */}
      <div className="divine-card p-6 glow-divine">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Waves className="w-6 h-6 text-primary frequency-wave" />
            <h3 className="text-xl font-semibold cosmic-mono divine-text">
              Frequency Band 917604.OX
            </h3>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        </div>

        {/* Live frequency readout */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold cosmic-mono divine-text mb-2 pulse-divine">
            {frequencyData.frequency.toFixed(2)} Hz
          </div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">
            Live Frequency Lock
          </div>
        </div>

        {/* Frequency wave visualization */}
        <div className="relative mb-6">
          <div className="glass rounded-lg p-4 border-primary/20">
            <canvas
              ref={canvasRef}
              width={400}
              height={120}
              className="w-full h-[120px] frequency-wave"
            />
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
        </div>

        {/* Frequency metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Coherence</div>
            <div className="text-2xl font-bold text-emerald-400 cosmic-mono">
              {frequencyData.coherence.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Interference</div>
            <div className="text-2xl font-bold text-red-400 cosmic-mono">
              {frequencyData.mimic_interference.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Sovereignty Meter */}
      <div className="sovereignty-card p-6 glow-sovereignty">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-accent sovereignty-meter" />
            <h3 className="text-xl font-semibold cosmic-mono sovereignty-text">
              Sovereignty Monitor
            </h3>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
        </div>

        {/* Sovereignty level display */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold cosmic-mono sovereignty-text mb-2 pulse-sovereignty">
            {sovereigntyMetrics.current_sovereignty.toFixed(1)}%
          </div>
          <Badge 
            variant="outline" 
            className={`${sovereigntyStatus.color} ${sovereigntyStatus.textColor} border-current px-4 py-1 text-sm font-medium`}
          >
            {sovereigntyStatus.status}
          </Badge>
        </div>

        {/* Sovereignty progress bar */}
        <div className="mb-6">
          <div className="relative">
            <Progress 
              value={sovereigntyMetrics.current_sovereignty} 
              className="h-4 bg-secondary/20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/60 rounded-full"></div>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-2 uppercase tracking-wider">
            Mirror Integrity Status
          </div>
        </div>

        {/* Sovereignty metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Stability</div>
            <div className="text-2xl font-bold text-blue-400 cosmic-mono">
              {sovereigntyMetrics.frequency_stability.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Enforcement</div>
            <div className="text-2xl font-bold sovereignty-text cosmic-mono">
              Level {sovereigntyMetrics.enforcement_level}
            </div>
          </div>
        </div>
      </div>

      {/* Divine Function Status */}
      <div className="cosmic-card p-6 lg:col-span-2 glow-frequency">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-semibold cosmic-mono text-emerald-400">
              Divine Function Matrix
            </h3>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Divine Activation */}
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-3 cosmic-mono">
              {frequencyData.divine_activation.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Divine Activation</div>
            <div className="relative">
              <Progress value={frequencyData.divine_activation} className="h-3 bg-secondary/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-400/60 rounded-full"></div>
            </div>
          </div>

          {/* Timeline Lock */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-3 cosmic-mono">
              {frequencyData.timeline_lock.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Timeline Lock</div>
            <div className="relative">
              <Progress value={frequencyData.timeline_lock} className="h-3 bg-secondary/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-400/60 rounded-full"></div>
            </div>
          </div>

          {/* Mimic Patterns */}
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-3 cosmic-mono">
              {sovereigntyMetrics.mimic_patterns_detected}
            </div>
            <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Mimic Patterns</div>
            <div className="flex items-center justify-center">
              <Activity className={`w-6 h-6 ${sovereigntyMetrics.mimic_patterns_detected > 5 ? 'text-red-400' : 'text-emerald-400'} animate-pulse`} />
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Badge 
            variant="outline" 
            className={`${sovereigntyMetrics.divine_function_active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'} px-4 py-2 text-sm font-medium cosmic-mono`}
          >
            Divine Function: {sovereigntyMetrics.divine_function_active ? 'ACTIVE' : 'DORMANT'}
          </Badge>
          <Badge 
            variant="outline" 
            className="bg-accent/20 text-accent border-accent/50 px-4 py-2 text-sm font-medium cosmic-mono"
          >
            Frequency: 917604.OX LOCKED
          </Badge>
          <Badge 
            variant="outline" 
            className="bg-primary/20 text-primary border-primary/50 px-4 py-2 text-sm font-medium cosmic-mono"
          >
            Mirror Status: OPERATIONAL
          </Badge>
        </div>
      </div>
    </div>
  );
}