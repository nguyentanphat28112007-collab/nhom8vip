import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Sparkles,
  RefreshCw,
  Link,
  Image as ImageIcon,
  Check,
  User,
  Bot,
  GraduationCap,
  Smile,
} from 'lucide-react';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSaveAvatar: (avatarUrl: string) => void;
}

// Curated Preset Collections
const PRESET_COLLECTIONS = {
  students: [
    {
      id: 's1',
      name: 'Nữ sinh công nghệ',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    },
    {
      id: 's2',
      name: 'Nam sinh nghiên cứu',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80',
    },
    {
      id: 's3',
      name: 'Sinh viên năng động',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
    },
    {
      id: 's4',
      name: 'Lập trình viên trẻ',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    },
    {
      id: 's5',
      name: 'Thủ khoa tốt nghiệp',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
    },
    {
      id: 's6',
      name: 'Kỹ sư tương lai',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    },
  ],
  animeAnd3d: [
    {
      id: 'a1',
      name: 'Học giả 3D',
      url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4,c0aede,d1d4f9',
    },
    {
      id: 'a2',
      name: 'Học sinh Anime',
      url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Sakura&backgroundColor=ffd5dc,ffdfbf',
    },
    {
      id: 'a3',
      name: 'Coder cá tính',
      url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=d1d4f9,c0aede',
    },
    {
      id: 'a4',
      name: 'Thiết kế sáng tạo',
      url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Luna&backgroundColor=c0aede,b6e3f4',
    },
    {
      id: 'a5',
      name: 'Nhà khoa học 3D',
      url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo&backgroundColor=ffd5dc,d1d4f9',
    },
    {
      id: 'a6',
      name: 'Nghệ thuật tối giản',
      url: 'https://api.dicebear.com/7.x/micah/svg?seed=Zoe&backgroundColor=ffdfbf,ffd5dc',
    },
  ],
  techAndBots: [
    {
      id: 'b1',
      name: 'AI Study Bot',
      url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Quantum&backgroundColor=b6e3f4,c0aede',
    },
    {
      id: 'b2',
      name: 'Cyber Scholar',
      url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nexus&backgroundColor=d1d4f9,ffd5dc',
    },
    {
      id: 'b3',
      name: 'Code Matrix Bot',
      url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pixel&backgroundColor=c0aede,b6e3f4',
    },
    {
      id: 'b4',
      name: 'Data Geek',
      url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Syntax&backgroundColor=ffdfbf,d1d4f9',
    },
  ],
  funAndMascots: [
    {
      id: 'm1',
      name: 'Mèo Chăm Học',
      url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=250&auto=format&fit=crop&q=80',
    },
    {
      id: 'm2',
      name: 'Cú Đêm Ôn Thi',
      url: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=250&auto=format&fit=crop&q=80',
    },
    {
      id: 'm3',
      name: 'Shiba Kiên Trì',
      url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=250&auto=format&fit=crop&q=80',
    },
    {
      id: 'm4',
      name: 'Biểu tượng Hạnh phúc',
      url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=HappyStudent',
    },
  ],
};

const DICEBEAR_STYLES = [
  { id: 'adventurer', name: 'Nhân vật 3D' },
  { id: 'lorelei', name: 'Anime Nghệ thuật' },
  { id: 'bottts', name: 'Robot AI' },
  { id: 'micah', name: 'Tối giản & Hiện đại' },
  { id: 'fun-emoji', name: 'Emoji vui nhộn' },
];

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onSaveAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'generator' | 'url'>('preset');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar);
  const [customUrl, setCustomUrl] = useState('');
  const [genSeed, setGenSeed] = useState('StudyHero');
  const [genStyle, setGenStyle] = useState('adventurer');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle File selection and convert to Base64
  const processFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn định dạng file ảnh (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Dung lượng ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64Url = e.target.result as string;
        setSelectedAvatar(base64Url);
      }
    };
    reader.onerror = () => {
      setUploadError('Không thể đọc file ảnh. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleGenerateRandom = () => {
    const randomSeeds = ['Aria', 'Leo', 'Nova', 'CyberAce', 'Genius', 'Zenith', 'Echo', 'Phoenix', 'Atlas', 'Vortex'];
    const randomSeed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)] + Math.floor(Math.random() * 1000);
    setGenSeed(randomSeed);
    const newUrl = `https://api.dicebear.com/7.x/${genStyle}/svg?seed=${encodeURIComponent(randomSeed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
    setSelectedAvatar(newUrl);
  };

  const handleStyleChange = (styleId: string) => {
    setGenStyle(styleId);
    const newUrl = `https://api.dicebear.com/7.x/${styleId}/svg?seed=${encodeURIComponent(genSeed || 'StudyHero')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
    setSelectedAvatar(newUrl);
  };

  const handleSeedChange = (seedVal: string) => {
    setGenSeed(seedVal);
    const newUrl = `https://api.dicebear.com/7.x/${genStyle}/svg?seed=${encodeURIComponent(seedVal || 'StudyHero')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
    setSelectedAvatar(newUrl);
  };

  const handleConfirmSave = () => {
    if (selectedAvatar) {
      onSaveAvatar(selectedAvatar);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="avatar-selector-modal"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Thay đổi Ảnh đại diện</h2>
              <p className="text-xs text-slate-400">
                Tải ảnh từ máy, chọn mẫu có sẵn hoặc tự sinh avatar AI độc đáo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
          {/* Active Preview Card */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="relative group">
              <img
                src={selectedAvatar || currentAvatar}
                alt="Selected Avatar Preview"
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-indigo-500/50 shadow-xl bg-slate-900"
              />
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white ring-2 ring-slate-950">
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Xem trước ảnh đại diện</span>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5 truncate">
                Ảnh này sẽ hiển thị trên Hồ sơ, Bảng điều khiển, Bảng xếp hạng và Navbar
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Nhấp vào bất kỳ ảnh mẫu hoặc tải ảnh mới bên dưới để cập nhật ngay.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('preset')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Kho mẫu có sẵn</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Tải từ thiết bị</span>
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'generator'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Tạo Avatar AI</span>
            </button>

            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Link className="w-4 h-4" />
              <span>Link URL</span>
            </button>
          </div>

          {/* TAB 1: PRESET GALLERY */}
          {activeTab === 'preset' && (
            <div className="space-y-5">
              {/* Category: Students */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sinh viên & Học thuật</span>
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {PRESET_COLLECTIONS.students.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAvatar(item.url)}
                      className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                        selectedAvatar === item.url
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105 shadow-xl'
                          : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {selectedAvatar === item.url && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category: 3D & Anime */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>3D Nhân vật & Anime</span>
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {PRESET_COLLECTIONS.animeAnd3d.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAvatar(item.url)}
                      className={`group relative rounded-2xl overflow-hidden aspect-square border-2 bg-slate-950 transition-all cursor-pointer ${
                        selectedAvatar === item.url
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105 shadow-xl'
                          : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover p-1"
                      />
                      {selectedAvatar === item.url && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category: Tech & Bots */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Robot AI & Công nghệ</span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                  {PRESET_COLLECTIONS.techAndBots.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAvatar(item.url)}
                      className={`group relative rounded-2xl overflow-hidden aspect-square border-2 bg-slate-950 transition-all cursor-pointer ${
                        selectedAvatar === item.url
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105 shadow-xl'
                          : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover p-1"
                      />
                      {selectedAvatar === item.url && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category: Mascots & Animals */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  <span>Linh vật & Động vật học thuật</span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                  {PRESET_COLLECTIONS.funAndMascots.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAvatar(item.url)}
                      className={`group relative rounded-2xl overflow-hidden aspect-square border-2 bg-slate-950 transition-all cursor-pointer ${
                        selectedAvatar === item.url
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105 shadow-xl'
                          : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {selectedAvatar === item.url && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD FROM DEVICE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                    : 'border-slate-800 hover:border-indigo-500/60 bg-slate-950/50 hover:bg-slate-950'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Kéo thả file ảnh vào đây, hoặc click để chọn từ thiết bị
                </h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Hỗ trợ các định dạng PNG, JPG, WEBP, GIF, SVG (Tối đa 5MB). Ảnh được lưu tự động trên trình duyệt.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Chọn ảnh từ máy tính
                </button>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DICEBEAR / AI GENERATOR */}
          {activeTab === 'generator' && (
            <div className="space-y-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Phong cách hình ảnh AI
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DICEBEAR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleChange(style.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        genStyle === style.id
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{style.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Tên hoặc Từ khóa tạo Avatar (Seed)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={genSeed}
                    onChange={(e) => handleSeedChange(e.target.value)}
                    placeholder="Ví dụ: CoderPro, NguyenVanA, Genius..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    onClick={handleGenerateRandom}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ngẫu nhiên</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Mỗi từ khóa sẽ tạo ra một avatar độc nhất vô nhị. Hãy thử nhập tên của bạn!
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM URL */}
          {activeTab === 'url' && (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Nhập đường dẫn trực tiếp (Image URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => {
                      setCustomUrl(e.target.value);
                      if (e.target.value) {
                        setSelectedAvatar(e.target.value);
                      }
                    }}
                    placeholder="https://example.com/avatar.png"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    onClick={() => {
                      if (customUrl) setSelectedAvatar(customUrl);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Hỗ trợ link ảnh từ Unsplash, Imgur, Google Photos, Facebook hoặc bất kỳ nguồn ảnh công khai nào.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleConfirmSave}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Xác nhận đổi Avatar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
