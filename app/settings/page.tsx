'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  Save, 
  User, 
  Lock, 
  Loader2, 
  Mail, 
  AlertCircle,
  Palette,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// 선택 가능한 컬러 프리셋
const PROFILE_COLORS = [
  '#facc15', // Yellow
  '#f87171', // Red
  '#60a5fa', // Blue
  '#4ade80', // Green
  '#a78bfa', // Purple
  '#fb923c', // Orange
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#3f3f46', // Zinc
];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false); // 비밀번호 필드 표시 여부
  
  // 초기 데이터 상태 (비교용)
  const [initialData, setInitialData] = useState({ name: "", color: "#facc15" });
  
  // 입력 폼 상태
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    color: "#facc15",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          const userData = {
            name: data.name ?? "",
            email: data.email ?? "",
            color: data.color ?? "#facc15"
          };
          setFormData(prev => ({
            ...prev,
            ...userData
          }));
          setInitialData({ 
            name: userData.name, 
            color: userData.color 
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  // --- 유효성 검사 및 변경 감지 로직 ---
  
  // 1. 기본 정보(이름, 컬러) 변경 여부
  const isNameChanged = formData.name !== initialData.name && formData.name.trim() !== "";
  const isColorChanged = formData.color !== initialData.color;
  const isInfoChanged = isNameChanged || isColorChanged;
  
  // 2. 비밀번호 섹션 유효성 검사
  const isCurrentPwEntered = formData.currentPassword !== "";
  const isNewPwEntered = formData.newPassword !== "";
  const isConfirmPwEntered = formData.confirmPassword !== "";
  const isNewPwLengthValid = formData.newPassword.length >= 8;
  const isPasswordMatch = formData.newPassword === formData.confirmPassword;
  
  // 비밀번호 수정 모드일 때 모든 조건이 충족되었는가?
  const isPasswordValid = isCurrentPwEntered && isNewPwEntered && isConfirmPwEntered && isNewPwLengthValid && isPasswordMatch;

  // 3. [최종] 버튼 활성화 조건
  // 비밀번호 창이 열려있으면 비밀번호 유효성을 검사하고, 닫혀있으면 정보 변경만 확인합니다.
  const canSave = showPasswordFields ? isPasswordValid : isInfoChanged;

  const showNewPwError = isNewPwEntered && !isNewPwLengthValid;
  const showMismatchError = isNewPwEntered && isConfirmPwEntered && !isPasswordMatch;
  const showConfirmRequiredError = isNewPwEntered && !isConfirmPwEntered;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    setSaving(true);
    try {
      const response = await fetch('/api/auth/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: isNameChanged ? formData.name : undefined,
          color: isColorChanged ? formData.color : undefined,
          currentPassword: showPasswordFields ? formData.currentPassword : undefined,
          newPassword: showPasswordFields ? formData.newPassword : undefined
        }),
      });

      if (response.ok) {
        alert("정보가 성공적으로 수정되었습니다.");
        setInitialData({ name: formData.name, color: formData.color });
        setShowPasswordFields(false);
        // 비밀번호 필드 초기화
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        router.refresh(); 
      } else {
        const error = await response.json();
        alert(error.message || "수정에 실패했습니다.");
      }
    } catch (err) {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50/50 dark:bg-zinc-950">
      <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
    </div>
  );

  return (
    <div className="h-screen overflow-y-auto bg-gray-50/50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8">
        
        {/* 헤더 섹션 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white dark:hover:bg-zinc-800 shadow-sm transition-all">
              <ChevronLeft className="w-5 h-5 dark:text-zinc-400" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">설정</h1>
              <p className="text-sm text-muted-foreground font-medium dark:text-zinc-400">계정 및 프로필 테마를 관리하세요.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6 pb-24">
          
          {/* 1. 테마 컬러 섹션 */}
          <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800">
            <CardHeader className="border-b bg-gray-50/50 dark:bg-zinc-800/50 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-400/10 rounded-lg"><Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                <div>
                  <CardTitle className="text-lg dark:text-zinc-100">테마 컬러</CardTitle>
                  <CardDescription className="dark:text-zinc-400">워크스페이스의 메인 컬러를 선택하세요.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {PROFILE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`relative w-12 h-12 rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm ${
                      formData.color === color ? 'ring-4 ring-offset-2 ring-zinc-200 dark:ring-zinc-700 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {formData.color === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-2xl border border-dashed flex items-center gap-4 transition-colors" style={{ backgroundColor: `${formData.color}10`, borderColor: formData.color }}>
                 <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg" style={{ backgroundColor: formData.color }}>
                   {formData.name ? formData.name[0] : 'U'}
                 </div>
                 <div className="text-sm font-medium" style={{ color: formData.color }}>
                   {isColorChanged ? "컬러가 변경되었습니다. 저장 버튼을 눌러 반영하세요!" : "이 컬러가 프로필 포인트와 배너에 적용됩니다."}
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. 프로필 정보 섹션 */}
          <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800">
            <CardHeader className="border-b bg-gray-50/50 dark:bg-zinc-800/50 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-400/10 rounded-lg"><User className="w-5 h-5 text-yellow-600 dark:text-yellow-500" /></div>
                <div>
                  <CardTitle className="text-lg dark:text-zinc-100">프로필 정보</CardTitle>
                  <CardDescription className="dark:text-zinc-400">공개적으로 표시되는 이름입니다.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">이메일 주소</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                  <Input value={formData.email} disabled className="pl-10 bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-500 cursor-not-allowed" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-zinc-300">이름</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="성함을 입력하세요"
                    className="pl-10 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus-visible:ring-yellow-400/20 dark:text-zinc-100"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. 비밀번호 변경 섹션 (아코디언 형태) */}
          <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800">
            <CardHeader 
              className="bg-gray-50/50 dark:bg-zinc-800/50 cursor-pointer select-none transition-colors hover:bg-gray-100/50 dark:hover:bg-zinc-800/80"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <Lock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-zinc-100">비밀번호 변경</CardTitle>
                    {!showPasswordFields && <CardDescription className="dark:text-zinc-400 text-xs tracking-tight">계정 보안을 강화하려면 클릭하세요.</CardDescription>}
                  </div>
                </div>
                {showPasswordFields ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
              </div>
            </CardHeader>
            <AnimatePresence>
              {showPasswordFields && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-6 space-y-5 border-t dark:border-zinc-800">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700 dark:text-zinc-300">현재 비밀번호</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        value={formData.currentPassword} 
                        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} 
                        placeholder="현재 비밀번호를 입력하세요" 
                        className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 dark:text-zinc-100" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700 dark:text-zinc-300">새 비밀번호</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          value={formData.newPassword} 
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
                          placeholder="8자 이상 권장" 
                          className={`bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 dark:text-zinc-100 ${showNewPwError ? 'border-red-500' : ''}`} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-zinc-300">새 비밀번호 확인</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          value={formData.confirmPassword} 
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                          placeholder="다시 한번 입력하세요" 
                          className={`bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 dark:text-zinc-100 ${showMismatchError || showConfirmRequiredError ? 'border-red-500' : ''}`} 
                        />
                      </div>
                    </div>

                    <div className="min-h-[20px]">
                      <AnimatePresence mode="wait">
                        {showNewPwError && (
                          <motion.p key="len" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} className="text-[11px] text-red-500 flex items-center gap-1 font-medium"><AlertCircle className="w-3 h-3" /> 비밀번호는 8자 이상이어야 합니다.</motion.p>
                        )}
                        {showMismatchError && (
                          <motion.p key="match" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} className="text-[11px] text-red-500 flex items-center gap-1 font-medium"><AlertCircle className="w-3 h-3" /> 입력하신 두 비밀번호가 일치하지 않습니다.</motion.p>
                        )}
                        {showConfirmRequiredError && (
                          <motion.p key="req" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} className="text-[11px] text-red-500 flex items-center gap-1 font-medium"><AlertCircle className="w-3 h-3" /> 비밀번호 확인란을 입력해주세요.</motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* 하단 버튼 바 */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => router.back()} className="font-medium text-gray-500 dark:text-zinc-400">취소</Button>
            <Button 
              type="submit" 
              disabled={saving || !canSave}
              className={`px-8 h-12 font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                showPasswordFields 
                  ? "bg-amber-600 hover:bg-amber-700 text-white" 
                  : "bg-zinc-900 dark:bg-yellow-400 dark:text-yellow-900 text-white"
              }`}
            >
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 저장 중</>
              ) : showPasswordFields ? (
                <><Lock className="mr-2 h-4 w-4" /> 비밀번호 변경하기</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> 설정 저장하기</>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}