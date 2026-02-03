
import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Camera, RefreshCw, Zap, ShieldCheck, Check, Search, ChefHat, Flame, Coffee, Sun, Moon, Pizza, AlertCircle, Settings } from 'lucide-react';
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

    // 1. Check for Secure Context
    if (!window.isSecureContext) {
      setError('Camera requires HTTPS. Mobile browsers block camera on insecure connections (http://192...).');
      return;
    }

    // 2. Check Browser Support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API not supported in this browser.');
      return;
    }

    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 } 
        }, 
        audio: false 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err: any) {
      console.error("Camera Error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Permission denied. Go to Settings > Apps > FitTrack Pro > Permissions to enable Camera.');
      } else if (err.name === 'NotFoundError') {
        setError('No back camera found.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is in use by another app.');
      } else {
        setError('Camera error: ' + (err.message || 'Unknown'));
      }
    }
  };

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setScanning(true);
    setResult(null);
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              {
                text: `You are a professional nutrition AI. First, analyze the image to determine if it contains an edible food item or a beverage.
                
                If the image contains random objects, electronics, furniture, landscapes, text, or anything that is NOT food, you MUST set "isFood" to false.
                
                If the image contains food, identify it and estimate nutritional content.
                
                Provide a JSON response with:
                1. isFood (boolean)
                2. name (short descriptive name)
                3. calories (total estimated integer)
                4. protein (grams)
                5. carbs (grams)
                6. fat (grams)
                7. confidence (0.0 to 1.0)
                8. reasoning (short 1-sentence analysis explaining why it is or isn't food)`
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
      
      if (data.isFood === false) {
        setError("This doesn't look like food. Please try scanning a plate or ingredient.");
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError('AI Analysis failed. Please ensure the food is clearly visible.');
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
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
          <ChefHat size={14} className="text-lime-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Food AI Scanner</span>
        </div>
        <div className="w-10 h-10"></div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-zinc-900 flex flex-col items-center justify-center">
        {!error ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="p-8 text-center max-w-sm">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Scanner Error</h3>
            <p className="text-zinc-400 text-sm mb-6">{error}</p>
            <div className="space-y-3">
              <button 
                onClick={() => startCamera()}
                className="bg-lime-400 text-black px-6 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all w-full flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* Scanning Overlay */}
        {!result && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-64 h-64 border-2 rounded-[32px] relative transition-all duration-500 ${scanning ? 'border-lime-400 border-4 scale-105' : 'border-white/20'}`}>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-[9px] font-black text-white/80 uppercase tracking-[0.2em] border border-white/5 whitespace-nowrap">
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-lime-400 animate-pulse">Analyzing Macros...</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Results Card */}
        {result && (
          <div className="absolute bottom-10 left-6 right-6 bg-[#121212]/95 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-6 animate-in slide-in-from-bottom duration-500 shadow-2xl">
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
      {!result && !error && (
        <div className="h-32 bg-black flex flex-col items-center justify-center px-6 pb-safe">
          <button 
            onClick={handleScan}
            disabled={scanning}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black">
              {scanning ? <RefreshCw size={24} className="animate-spin" /> : <Camera size={24} />}
            </div>
          </button>
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
