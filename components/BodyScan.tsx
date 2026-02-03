
import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Camera, RefreshCw, Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { User } from '../types';

interface Props {
  user: User | null;
  onBack: () => void;
}

const BodyScan: React.FC<Props> = ({ user, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    setError(null);
    stopCamera();

    if (!window.isSecureContext) {
      setError('Camera requires HTTPS/Secure Context.');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API not supported.');
      return;
    }

    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user'
        }, 
        audio: false 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err: any) {
      console.error("Camera Error:", err);
      setError('Camera access denied. Please check settings.');
    }
  };

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current || !user) return;
    
    // Ensure video is ready
    if (videoRef.current.readyState !== 4) {
      setError("Camera is loading...");
      return;
    }

    setScanning(true);
    setResult(null);
    setError(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key is missing in app configuration.");
      }

      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Draw image without mirroring for AI analysis (AI expects real orientation)
      ctx?.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              {
                text: `Analyze this person's physical health composition based on the visual input. 
                User stats: Weight ${user.currentWeight} lbs.
                Provide a JSON response with:
                1. muscle_ratio (estimated percentage)
                2. fat_percentage (estimated)
                3. health_score (0-100)
                4. visual_assessment (short text description)
                5. recommendation (one tip).
                Be encouraging and professional.`
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageData
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analysis failed. Check internet connection.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col text-white">
      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
          <Zap size={14} className="text-lime-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Visual Health Scan</span>
        </div>
        <div className="w-10 h-10"></div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-zinc-900 flex flex-col items-center justify-center">
        {/* Video always visible to avoid black screen on error */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ transform: 'rotateY(180deg)' }}
        />

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analysis Error</h3>
              <p className="text-zinc-400 text-sm mb-6">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="bg-lime-400 text-black px-6 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all w-full flex items-center justify-center gap-2"
              >
                 <RefreshCw size={18} /> Resume Scanning
              </button>
            </div>
          </div>
        )}
        
        {/* Scanning Frame */}
        {!result && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className={`w-72 h-96 border-2 rounded-[40px] relative transition-all duration-500 ${scanning ? 'border-lime-400 border-4' : 'border-white/30'}`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 backdrop-blur-sm">
                Align Body
              </div>
              {scanning && (
                <div className="absolute inset-0 bg-lime-500/10 animate-pulse rounded-[40px]">
                  <div className="h-0.5 w-full bg-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.8)] absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
              )}
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Results Card */}
        {result && (
          <div className="absolute bottom-32 left-6 right-6 bg-[#121212]/95 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 animate-in slide-in-from-bottom duration-500 z-20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black">Scan Complete</h3>
                <p className="text-zinc-500 text-sm">{result.visual_assessment}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-lime-400 flex flex-col items-center justify-center text-black">
                <span className="text-xs font-bold leading-none">Score</span>
                <span className="text-lg font-black">{result.health_score}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Muscle Ratio</p>
                <p className="text-xl font-black text-lime-400">{result.muscle_ratio}%</p>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Estimated Fat</p>
                <p className="text-xl font-black text-orange-400">{result.fat_percentage}%</p>
              </div>
            </div>

            <div className="bg-lime-400/10 border border-lime-400/20 p-4 rounded-2xl mb-6 flex gap-3">
              <ShieldCheck className="text-lime-400 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-0.5">Recommendation</p>
                <p className="text-sm font-medium">{result.recommendation}</p>
              </div>
            </div>

            <button 
              onClick={() => setResult(null)}
              className="w-full bg-zinc-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Rescan
            </button>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="h-32 bg-black flex items-center justify-center px-6 z-20">
        {!result && !error && (
          <button 
            onClick={handleScan}
            disabled={scanning}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black">
              {scanning ? <RefreshCw size={24} className="animate-spin" /> : <Camera size={24} />}
            </div>
          </button>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default BodyScan;
