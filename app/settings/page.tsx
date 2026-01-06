// app/settings/page.tsx
'use client';

import { useSettings } from '../components/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// 1. 컴포넌트를 외부로 분리하여 정의
interface ToggleProps {
  label: string;
  value: boolean;
  keyName: string;
  description: string;
  onToggle: (key: string, val: boolean) => void;
}

const ToggleSetting = ({ label, value, keyName, description, onToggle }: ToggleProps) => (
  <div className="flex items-center justify-between p-4 border-b last:border-0">
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <Button 
      variant={value ? "default" : "outline"}
      onClick={() => onToggle(keyName, !value)}
    >
      {value ? "ON" : "OFF"}
    </Button>
  </div>
);

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();

  // 토글 핸들러 함수
  const handleToggle = (key: string, val: boolean) => {
    updateSettings({ [key]: val });
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">설정</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>편집 모드 설정</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ToggleSetting 
            label="위치 이동 허용" 
            description="Ctrl + 방향키로 메모 위치를 수정할 수 있습니다."
            value={settings.isMoveEnabled} 
            keyName="isMoveEnabled" 
            onToggle={handleToggle}
          />
          <ToggleSetting 
            label="크기 조절 허용" 
            description="Alt + 방향키로 메모 크기를 수정할 수 있습니다."
            value={settings.isResizeEnabled} 
            keyName="isResizeEnabled" 
            onToggle={handleToggle}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>캔버스 시각 효과</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ToggleSetting 
            label="겹침 경고 표시" 
            description="메모가 겹쳤을 때 빨간 점선 영역을 표시합니다."
            value={settings.showOverlapWarning} 
            keyName="showOverlapWarning" 
            onToggle={handleToggle}
          />
          <ToggleSetting 
            label="격자 스냅 (Grid Snap)" 
            description="이동 시 10px 단위로 정렬합니다."
            value={settings.useGridSnap} 
            keyName="useGridSnap" 
            onToggle={handleToggle}
          />
        </CardContent>
      </Card>
    </div>
  );
}