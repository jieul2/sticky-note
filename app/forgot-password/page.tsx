'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, StickyNote, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    boardTitle: "",
    newPassword: "",
    confirmPassword: ""
  });

  // --- 유효성 검사 로직 ---
  const isEmailEntered = formData.email.trim() !== "";
  const isBoardTitleEntered = formData.boardTitle.trim() !== "";
  const isNewPasswordEntered = formData.newPassword !== "";
  const isConfirmPasswordEntered = formData.confirmPassword !== "";

  const isPasswordLengthValid = formData.newPassword.length >= 8;
  const isPasswordMatch = formData.newPassword === formData.confirmPassword;

  const canSubmit = 
    isEmailEntered && 
    isBoardTitleEntered && 
    isNewPasswordEntered && 
    isConfirmPasswordEntered && 
    isPasswordLengthValid && 
    isPasswordMatch;

  const showLengthError = isNewPasswordEntered && !isPasswordLengthValid;
  const showMismatchError = isNewPasswordEntered && isConfirmPasswordEntered && !isPasswordMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password-by-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        const error = await response.json();
        alert(error.message || "인증에 실패했습니다. 정보를 다시 확인해주세요.");
      }
    } catch (err) {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="w-full max-w-md text-center p-6 border-none shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl mb-2">재설정 완료!</CardTitle>
            <p className="text-muted-foreground">비밀번호가 성공적으로 변경되었습니다.<br/>잠시 후 로그인 페이지로 이동합니다.</p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-gray-500 hover:bg-white transition-all">
          <ChevronLeft className="w-4 h-4" /> 뒤로 가기
        </Button>
        
        <Card className="shadow-2xl border-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">비밀번호 찾기</CardTitle>
            <CardDescription>가입 이메일과 보유하신 보드 제목 하나를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-sm">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="example@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="boardTitle" className="font-semibold text-sm">인증용 보드 제목</Label>
                <div className="relative">
                  <StickyNote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="boardTitle" 
                    placeholder="작성했던 보드 제목 중 하나"
                    className="pl-10"
                    value={formData.boardTitle}
                    onChange={(e) => setFormData({...formData, boardTitle: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="pt-4 border-t mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-semibold">새 비밀번호</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    placeholder="8자 이상 입력"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className={showLengthError ? "border-red-500 focus-visible:ring-red-500/20" : ""}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">새 비밀번호 확인</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    placeholder="다시 입력"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className={showMismatchError ? "border-red-500 focus-visible:ring-red-500/20" : ""}
                    required 
                  />
                </div>
              </div>

              {/* [수정] 각 motion.p에 고유한 key를 추가했습니다. */}
              <AnimatePresence mode="wait">
                {showLengthError && (
                  <motion.p 
                    key="password-length-error"
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0 }} 
                    className="text-xs text-red-500 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5" /> 비밀번호는 8자 이상이어야 합니다.
                  </motion.p>
                )}
                {showMismatchError && (
                  <motion.p 
                    key="password-mismatch-error"
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0 }} 
                    className="text-xs text-red-500 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5" /> 비밀번호가 일치하지 않습니다.
                  </motion.p>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                className="w-full mt-6 shadow-lg active:scale-95 transition-all" 
                disabled={loading || !canSubmit}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                비밀번호 변경하기
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}