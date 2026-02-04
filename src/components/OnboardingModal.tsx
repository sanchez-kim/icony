import { useState, useEffect } from 'react';
import { X, Palette, Download, Heart, Search, Zap } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Search,
      title: '아이콘 검색 및 선택',
      description: '2,000개 이상의 아이콘을 검색하고, 원하는 아이콘을 클릭하여 선택하세요.',
      tip: '카테고리 필터를 사용하면 더 빠르게 찾을 수 있습니다!',
    },
    {
      icon: Palette,
      title: '색상 커스터마이징',
      description: '색상 스와치를 선택하거나, 커스텀 색상 피커로 원하는 색상을 만드세요.',
      tip: '최근 사용한 색상과 팔레트를 저장할 수 있습니다.',
    },
    {
      icon: Zap,
      title: '크기 조정',
      description: '16px부터 512px까지 슬라이더로 조정하거나 프리셋 버튼을 사용하세요.',
      tip: '직접 숫자를 입력할 수도 있습니다!',
    },
    {
      icon: Download,
      title: '다운로드 & 공유',
      description: 'PNG 또는 SVG 형식으로 다운로드하거나, 클립보드에 복사, 또는 공유 링크를 생성하세요.',
      tip: '공유 링크를 사용하면 설정을 저장하고 공유할 수 있습니다.',
    },
    {
      icon: Heart,
      title: '즐겨찾기 & 히스토리',
      description: '자주 사용하는 아이콘을 즐겨찾기에 추가하고, 최근 사용한 아이콘을 빠르게 찾으세요.',
      tip: '즐겨찾기와 최근 아이콘은 자동으로 저장됩니다.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    localStorage.setItem('icony_onboarding_completed', 'true');
    onClose();
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto">
            <Icon className="text-white" size={32} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {step.description}
          </p>

          {/* Tip */}
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              💡 <strong>Tip:</strong> {step.tip}
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-primary-600'
                    : 'w-2 bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 pt-4">
            {currentStep > 0 ? (
              <button
                onClick={handlePrev}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
              >
                이전
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
              >
                건너뛰기
              </button>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-500">
              {currentStep + 1} / {steps.length}
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {currentStep < steps.length - 1 ? '다음' : '시작하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
