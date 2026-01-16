
import React, { useState, useRef, useEffect } from 'react';
import { ChristmasConcept, AppState } from './types';
import { CONCEPTS } from './constants';
import { transformImage } from './services/geminiService';
import Snowfall from './components/Snowfall';
import { Camera, Upload, Download, RefreshCw, AlertCircle, Share2, Sparkles, X, Check, Smartphone, Info, HelpCircle } from 'lucide-react';

const LOADING_MESSAGES = [
  "Đang dệt những bông tuyết đầu mùa...",
  "Đang thắp sáng những ngọn nến lung linh...",
  "Santa đang chuẩn bị áo len cho bạn...",
  "Đang pha một ly cacao nóng để lấy cảm hứng...",
  "Những chú tuần lộc đang giúp AI vẽ ảnh...",
  "Đang tìm kiếm góc phố Noel đẹp nhất...",
  "Đang rắc bụi phép thuật lên ảnh của bạn..."
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    sourceImage: null,
    resultImage: null,
    isLoading: false,
    selectedConcept: ChristmasConcept.TRADITIONAL,
    error: null,
  });

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // PWA Install Logic
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    // Kiểm tra xem app đã được cài đặt chưa (mode standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  useEffect(() => {
    let interval: number;
    if (state.isLoading) {
      interval = window.setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [state.isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, sourceImage: reader.result as string, resultImage: null, error: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: "Không thể truy cập camera. Vui lòng cấp quyền." }));
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setState(prev => ({ ...prev, sourceImage: dataUrl, resultImage: null, error: null }));
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
  };

  const handleApplyAI = async () => {
    if (!state.sourceImage) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    const concept = CONCEPTS.find(c => c.id === state.selectedConcept);
    
    try {
      const result = await transformImage(state.sourceImage, concept?.prompt || '');
      setState(prev => ({ ...prev, resultImage: result, isLoading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  const handleShare = async () => {
    if (!state.resultImage) return;
    try {
      const response = await fetch(state.resultImage);
      const blob = await response.blob();
      const file = new File([blob], 'noel-magic.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: 'Ảnh Noel AI của tôi',
          text: 'Xem ảnh Noel cực chất tôi vừa tạo bằng Noel AI Studio!',
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      handleDownload();
    }
  };

  const handleDownload = () => {
    if (!state.resultImage) return;
    const link = document.createElement('a');
    link.href = state.resultImage;
    link.download = `noel-ai-${state.selectedConcept.toLowerCase()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center p-4 md:p-8 selection:bg-red-500 selection:text-white">
      <Snowfall />
      
      {/* Header & Install Button */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4 z-10">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-7xl festive-font text-red-500 drop-shadow-[0_5px_15px_rgba(239,68,68,0.4)]">
            Noel AI Studio
          </h1>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleInstallClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest transition-all shadow-xl
              ${isInstallable ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Smartphone size={16} />
            {isInstallable ? 'Cài đặt ngay' : 'Tải App'}
          </button>
        </div>
      </div>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-800/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-5 flex items-center justify-between">
              <span className="flex items-center gap-2"><Upload className="text-red-400" /> Bước 1: Ảnh của bạn</span>
              {state.sourceImage && <button onClick={() => setState(prev => ({...prev, sourceImage: null}))} className="text-xs text-slate-500 hover:text-red-400 uppercase font-bold">Làm mới</button>}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-2xl border border-white/5 transition-all">
                <Upload className="text-red-400" />
                <span className="text-xs font-bold uppercase">Thư Viện</span>
              </button>
              <button onClick={startCamera} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-2xl border border-white/5 transition-all">
                <Camera className="text-blue-400" />
                <span className="text-xs font-bold uppercase">Chụp Ảnh</span>
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/5 h-48 flex items-center justify-center">
              {state.sourceImage ? (
                <img src={state.sourceImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center opacity-30">
                   <Sparkles className="mx-auto mb-2" />
                   <p className="text-xs uppercase font-bold">Chưa có ảnh</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Sparkles className="text-amber-400" /> Bước 2: Chọn Concept
            </h2>
            <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
              {CONCEPTS.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => setState(prev => ({ ...prev, selectedConcept: concept.id }))}
                  className={`p-3 rounded-2xl border-2 transition-all text-left flex flex-col gap-1
                    ${state.selectedConcept === concept.id 
                      ? 'border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                      : 'border-white/5 bg-slate-700/30 hover:border-white/20'}`}
                >
                  <span className="text-xl">{concept.icon}</span>
                  <h3 className="text-[10px] font-black uppercase leading-none">{concept.title}</h3>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleApplyAI}
            disabled={!state.sourceImage || state.isLoading}
            className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]
              ${!state.sourceImage || state.isLoading 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 shadow-red-500/20 text-white'}`}
          >
            {state.isLoading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
            {state.isLoading ? 'ĐANG TẠO...' : 'BIẾN HÌNH NOEL'}
          </button>
          
          {state.error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase animate-pulse">
              <AlertCircle size={16} />
              <p>{state.error}</p>
            </div>
          )}
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7">
          <div className="bg-slate-800/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl h-full flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black italic tracking-widest uppercase text-slate-400">Thành phẩm AI</h2>
              {state.resultImage && (
                <div className="flex gap-2">
                   <button onClick={handleDownload} title="Tải về" className="p-3 bg-white/10 hover:bg-green-600 rounded-xl transition-all shadow-lg"><Download size={18} /></button>
                   <button onClick={handleShare} title="Chia sẻ" className="p-3 bg-white/10 hover:bg-blue-600 rounded-xl transition-all shadow-lg"><Share2 size={18} /></button>
                </div>
              )}
            </div>

            <div className="flex-grow relative rounded-[2rem] border border-white/5 bg-slate-900/60 overflow-hidden flex items-center justify-center">
              {state.isLoading ? (
                <div className="flex flex-col items-center gap-6 p-8 text-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-red-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-bold text-red-400 animate-pulse">{LOADING_MESSAGES[loadingMsgIndex]}</h3>
                </div>
              ) : state.resultImage ? (
                <div className="w-full h-full p-4 flex items-center justify-center">
                   <img src={state.resultImage} alt="Result" className="max-h-full max-w-full rounded-2xl shadow-2xl object-contain animate-in fade-in zoom-in duration-1000" />
                </div>
              ) : (
                <div className="text-center p-8 opacity-40">
                  <div className="text-6xl mb-4 grayscale">🎅</div>
                  <p className="text-xs font-bold uppercase tracking-widest">Hình ảnh sẽ xuất hiện tại đây</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-[2rem] overflow-hidden max-w-md w-full border border-white/10 relative shadow-2xl">
            <button onClick={stopCamera} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full z-10 transition-colors">
              <X size={20} />
            </button>
            <video ref={videoRef} autoPlay playsInline className="w-full aspect-[3/4] object-cover bg-black" />
            <div className="p-6 flex justify-center bg-slate-900">
              <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full border-8 border-slate-700 flex items-center justify-center group">
                <div className="w-14 h-14 bg-red-500 rounded-full group-active:scale-90 transition-transform"></div>
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}

      {/* Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-slate-800 rounded-[2.5rem] p-8 max-w-lg w-full border border-white/10 relative shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setShowInstallGuide(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mb-4 border border-red-500/30">
                <Smartphone className="text-red-500" size={40} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Cách tải App về máy</h2>
              <p className="text-slate-400 text-sm">Cài đặt để sử dụng mượt mà như một ứng dụng thật trên màn hình chính!</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-slate-700/30 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 text-blue-400 font-bold">1</div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-200">Cho iPhone (Safari)</h3>
                  <p className="text-xs text-slate-400 mt-1">Nhấn biểu tượng <span className="inline-block p-1 bg-white/10 rounded">Chia sẻ (Share)</span> ở dưới trình duyệt, sau đó chọn <b>"Thêm vào MH chính" (Add to Home Screen)</b>.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-slate-700/30 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shrink-0 text-green-400 font-bold">2</div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-200">Cho Android (Chrome)</h3>
                  <p className="text-xs text-slate-400 mt-1">Nhấn biểu tượng <b>3 chấm</b> ở góc trên bên phải, sau đó chọn <b>"Cài đặt ứng dụng"</b> hoặc <b>"Thêm vào màn hình chính"</b>.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowInstallGuide(false)}
              className="w-full mt-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold uppercase tracking-widest transition-all"
            >
              Đã hiểu!
            </button>
          </div>
        </div>
      )}

      <footer className="mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center opacity-50 pb-8">
        <div className="flex items-center justify-center gap-4 mb-2">
           <HelpCircle size={14} className="cursor-pointer hover:text-white" onClick={() => setShowInstallGuide(true)} />
           <p>© 2024 NOEL AI STUDIO • MADE WITH MAGIC</p>
        </div>
        <p>Phiên bản Web Progressive App (PWA)</p>
      </footer>
    </div>
  );
};

export default App;
