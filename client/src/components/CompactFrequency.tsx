import { useState, useEffect, useRef } from 'react';

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

export default function CompactFrequency() {
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

  // Compact canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.15; // Fast animation
      
      // Clear with cosmic background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(13, 13, 22, 0.95)');
      gradient.addColorStop(1, 'rgba(7, 7, 15, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Compact frequency waves
      const centerY = canvas.height / 2;
      const amplitude = 20;
      
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.7 + Math.sin(time) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 2) {
        const y = centerY + Math.sin((x + time * 50) * 0.02) * amplitude * (frequencyData.divine_activation / 100);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Sovereignty pulse
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.5 + Math.sin(time * 2) * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 3) {
        const y = centerY + Math.sin((x + time * 30) * 0.03) * 15 * (frequencyData.sovereigntyLevel / 100);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      animationId = requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [frequencyData]);

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-lg border border-purple-500/20 p-2 shadow-xl">
      {/* Minimal Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          <h2 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            ⧁ ∆ 917604.OX
          </h2>
        </div>
        <div className="text-xs text-gray-400 font-mono">LIVE</div>
      </div>

      {/* Ultra-Compact Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {/* Frequency */}
        <div className="bg-black/60 rounded p-2 border border-yellow-500/30">
          <div className="text-xs text-gray-400">FREQ</div>
          <div className="text-sm font-bold text-yellow-400 font-mono">
            {frequencyData.frequency.toFixed(1)}
          </div>
        </div>

        {/* Sovereignty */}
        <div className="bg-black/60 rounded p-2 border border-purple-500/30">
          <div className="text-xs text-gray-400">SOV</div>
          <div className="text-sm font-bold text-purple-400">
            {frequencyData.sovereigntyLevel.toFixed(0)}%
          </div>
        </div>

        {/* Divine */}
        <div className="bg-black/60 rounded p-2 border border-orange-500/30">
          <div className="text-xs text-gray-400">DIV</div>
          <div className="text-sm font-bold text-orange-400">
            {frequencyData.divine_activation.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Minimal Canvas */}
      <div className="bg-black/60 rounded border border-purple-500/30 overflow-hidden mb-2">
        <canvas 
          ref={canvasRef}
          width={300}
          height={50}
          className="w-full h-[50px]"
        />
      </div>

      {/* Micro Status Grid */}
      <div className="grid grid-cols-4 gap-1 mb-2">
        <div className="bg-black/40 rounded p-1 text-center">
          <div className="text-xs text-blue-400 font-bold">
            {frequencyData.coherence.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">COH</div>
        </div>
        
        <div className="bg-black/40 rounded p-1 text-center">
          <div className="text-xs text-green-400 font-bold">
            {frequencyData.timeline_lock.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">TL</div>
        </div>
        
        <div className="bg-black/40 rounded p-1 text-center">
          <div className="text-xs text-red-400 font-bold">
            {frequencyData.mimic_interference.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">MIM</div>
        </div>

        <div className="bg-black/40 rounded p-1 text-center">
          <div className="text-xs text-yellow-400 font-bold">
            L{sovereigntyMetrics.enforcement_level}
          </div>
          <div className="text-xs text-gray-500">ENF</div>
        </div>
      </div>

      {/* Minimal Status Line */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          <div className={`w-1.5 h-1.5 rounded-full ${sovereigntyMetrics.divine_function_active ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-gray-300">
            {sovereigntyMetrics.divine_function_active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        <div className="text-gray-400">
          M:{sovereigntyMetrics.mimic_patterns_detected}
        </div>
      </div>
    </div>
  );
}