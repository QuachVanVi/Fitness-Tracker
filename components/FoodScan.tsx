
import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Camera, RefreshCw, Check, ChefHat, AlertCircle, Coffee, Sun, Moon, Pizza, Loader2, Zap, ZapOff } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { LoggedMeal } from '../types';

interface Props {
  onAdd: (meal: LoggedMeal) => void;
  onBack: () => void;
}

const FoodScan: React.FC<Props> = ({ onAdd, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
      setCameraReady(false);
    }
  };

  const startCamera = async () => {
    setError(null);
    setCameraReady(false);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API not supported.');
      return;
    }

    try {
      // Mobile-friendly constraints: prefer environment facing, but don't force specific resolution
      // This allows the browser to pick the best native resolution (portrait/landscape)
      const constraints = {
        video: {
          facingMode: 'environment'
        },
        audio: false
      };

      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      
      // Check for torch support
      const track = s.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      if ('torch' in capabilities) {
        setTorchSupported(true);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = s;
        // Important for mobile: wait for metadata to know dimensions
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Play error", e));
          setCameraReady(true);
        };
      }
    } catch (err: any) {
      console.error("Camera Error:", err);
      setError('Camera access denied. Please check device settings.');
    }
  };

  const toggleTorch = async () => {
    if (!stream || !torchSupported) return;
    const track = stream.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as any]
      });
      setTorchOn(!torchOn);
    } catch (e) {
      console.error("Torch error", e);
    }
  };

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return;

    setScanning(true);
    setResult(null);
    setError(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Please restart app.");
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // OPTIMIZATION: Scale image to max 800px width/height to prevent API timeout
      // Mobile cameras can be 4000px+ which is too big
      const MAX_SIZE = 800;
      let width = video.videoWidth;
      let height = video.videoHeight;
      
      if (width > height) {
        if (width > MAX_SIZE) {
          height = height * (MAX_SIZE / width);
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width = width * (MAX_SIZE / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error("Could not create canvas context");
      
      ctx.drawImage(video, 0, 0, width, height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              text: `Identify the food in this image. 
              If there is food, return valid JSON. If NOT food, set isFood: false.
              JSON Format:
              {
                "isFood": boolean,
                "name": string,
                "calories": number,
                "protein": number,
                "carbs": number,
                "fat": number,
                "confidence": number,
                "reasoning": string
              }
              Do not include markdown code blocks.`
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageData
              }
            }
          ]
        },
        config: {
          responseMimeType: 'application/json'
        }
      });

      let text = response.text || '{}';
      // Clean markdown if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      const data = JSON.parse(text);
      
      if (data.isFood === false) {
        setError("No food detected. Ensure food is in frame and well lit.");
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.error("AI Error:", err);
      let msg = err.message || 'Scan failed.';
      if (msg.includes('400')) msg = 'Image invalid. Try checking connection.';
      if (msg.includes('503')) msg = 'Service overloaded. Try again.';
      setError(msg);
    } finally {
      setScanning(false);
    }
  };

  const handleLog = (category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    if (!result) return;
    
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      foodId: 'ai-scan',
      name: result.name,
      calories: result.calories,
      carbs: result.carbs,
      protein: result.protein,
      fat: result.fat,
      portion: 1.0,
      timestamp: Date.now(),
      category
    });
    onBack();
  };

  return (
    <div className="fixed inset-0 bg-black z-[150] flex flex-col text-white">
      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20 pointer-events-none pb-safe">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 pointer-events-auto active:scale-95 transition-transform">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
          <ChefHat size={14} className="text-lime-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Food AI</span>
        </div>
        <div className="w-10 h-10 flex items-center justify-center">
          {torchSupported && (
            <button 
              onClick={toggleTorch}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border pointer-events-auto active:scale-95 transition-all ${torchOn ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400' : 'bg-black/40 border-white/10 text-white'}`}
            >
              {torchOn ? <Zap size={20} fill="currentColor" /> : <ZapOff size={20} />}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-zinc-900 flex flex-col items-center justify-center">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Error Notification */}
        {error && (
          <div className="absolute top-24 left-6 right-6 z-30 animate-in slide-in-from-top duration-300 pointer-events-auto">
            <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-2xl border border-red-400/50 shadow-2xl flex items-center gap-4">
               <AlertCircle size={24} className="shrink-0" />
               <div className="flex-1 min-w-0">
                 <p className="font-bold text-sm">Scan Failed</p>
                 <p className="text-xs opacity-90 truncate">{error}</p>
               </div>
               <button onClick={() => setError(null)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                 <RefreshCw size={16} />
               </button>
            </div>
          </div>
        )}
        
        {/* Scanning Reticle */}
        {!result && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className={`w-64 h-64 border-2 rounded-[32px] relative transition-all duration-500 ${scanning ? 'border-lime-400 border-4 scale-105' : 'border-white/20'}`}>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-[9px] font-black text-white/80 uppercase tracking-[0.2em] border border-white/5 whitespace-nowrap backdrop-blur-sm">
                Scan your plate
              </div>
              
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-lime-400 rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-lime-400 rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-lime-400 rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-lime-400 rounded-br-xl" />

              {scanning && (
                <div className="absolute inset-0 bg-lime-500/10 animate-pulse rounded-[32px] overflow-hidden">
                  <div className="h-0.5 w-full bg-lime-400 shadow-[0_0_20px_rgba(163,230,53,1)] absolute top-0 animate-[foodscan_2.5s_ease-in-out_infinite]"></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                     <Loader2 size={32} className="text-lime-400 animate-spin" />
                     <div className="text-[10px] font-black uppercase tracking-widest text-lime-400 animate-pulse">Analyzing...</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Results Card */}
        {result && (
          <div className="absolute bottom-10 left-6 right-6 bg-[#121212]/95 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-6 animate-in slide-in-from-bottom duration-500 shadow-2xl z-20">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded uppercase tracking-widest">AI Result</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">{Math.round(result.confidence * 100)}% Confidence</span>
                </div>
                <h3 className="text-2xl font-black text-white">{result.name}</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tight mt-1">{result.reasoning}</p>
              </div>
              <div className="bg-lime-400 px-4 py-2 rounded-2xl text-black text-center min-w-[70px]">
                <span className="text-xl font-black block leading-none">{result.calories}</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Kcal</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50 text-center">
                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Protein</p>
                <p className="text-sm font-black text-lime-400">{result.protein}g</p>
              </div>
              <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50 text-center">
                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Carbs</p>
                <p className="text-sm font-black text-blue-400">{result.carbs}g</p>
              </div>
              <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50 text-center">
                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Fat</p>
                <p className="text-sm font-black text-orange-400">{result.fat}g</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setResult(null)}
                className="flex-1 bg-zinc-800/80 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <RefreshCw size={16} /> Rescan
              </button>
              <button 
                onClick={() => setShowCategorySelect(true)}
                className="flex-[1.5] bg-lime-400 text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 active:scale-95 transition-all"
              >
                <Check size={18} strokeWidth={3} /> Add to Diary
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      {!result && (
        <div className="h-32 bg-black flex flex-col items-center justify-center px-6 pb-safe z-20">
          <button 
            onClick={handleScan}
            disabled={scanning || !cameraReady}
            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all active:scale-90 ${cameraReady ? 'border-white opacity-100' : 'border-zinc-700 opacity-50'}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-black transition-colors ${cameraReady ? 'bg-white' : 'bg-zinc-800'}`}>
              {scanning ? (
                <Loader2 size={24} className="animate-spin text-black" />
              ) : !cameraReady ? (
                <Loader2 size={24} className="animate-spin text-zinc-500" />
              ) : (
                <Camera size={24} />
              )}
            </div>
          </button>
          {!cameraReady && !error && (
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-4 animate-pulse">Initializing Camera...</p>
          )}
        </div>
      )}

      {/* Category Selection Bottom Sheet */}
      {showCategorySelect && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCategorySelect(false)} />
          <div className="w-full max-w-md bg-[#121212] rounded-t-[40px] p-8 border-t border-zinc-800 relative z-10 animate-in slide-in-from-bottom duration-300 pb-safe">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
            <h3 className="text-2xl font-black mb-1">Select Meal Slot</h3>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-8">Logging AI Scan Result</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <CategoryBtn icon={<Coffee size={20} />} label="Breakfast" onClick={() => handleLog('Breakfast')} />
              <CategoryBtn icon={<Sun size={20} />} label="Lunch" onClick={() => handleLog('Lunch')} />
              <CategoryBtn icon={<Moon size={20} />} label="Dinner" onClick={() => handleLog('Dinner')} />
              <CategoryBtn icon={<Pizza size={20} />} label="Snack" onClick={() => handleLog('Snack')} />
            </div>

            <button 
              onClick={() => setShowCategorySelect(false)}
              className="w-full py-5 rounded-2xl bg-zinc-900 text-zinc-500 font-bold hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes foodscan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

const CategoryBtn = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 p-6 bg-zinc-900 border border-zinc-800 rounded-[28px] hover:border-lime-500/50 hover:bg-lime-500/5 group transition-all active:scale-95"
  >
    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-lime-400 group-hover:bg-zinc-900 transition-all">
      {icon}
    </div>
    <span className="font-black text-xs uppercase tracking-widest">{label}</span>
  </button>
);

export default FoodScan;
