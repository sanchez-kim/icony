import { useState, useEffect } from 'react';
import { X, Palette, Download, Heart, Search, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      title: t.onboarding.steps[0].title,
      description: t.onboarding.steps[0].description,
      tip: t.onboarding.steps[0].tip,
    },
    {
      icon: Palette,
      title: t.onboarding.steps[1].title,
      description: t.onboarding.steps[1].description,
      tip: t.onboarding.steps[1].tip,
    },
    {
      icon: Zap,
      title: t.onboarding.steps[2].title,
      description: t.onboarding.steps[2].description,
      tip: t.onboarding.steps[2].tip,
    },
    {
      icon: Download,
      title: t.onboarding.steps[3].title,
      description: t.onboarding.steps[3].description,
      tip: t.onboarding.steps[3].tip,
    },
    {
      icon: Heart,
      title: t.onboarding.steps[4].title,
      description: t.onboarding.steps[4].description,
      tip: t.onboarding.steps[4].tip,
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
                {t.onboarding.buttons.previous}
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
              >
                {t.onboarding.buttons.skip}
              </button>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-500">
              {currentStep + 1} / {steps.length}
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {currentStep < steps.length - 1 ? t.onboarding.buttons.next : t.onboarding.buttons.start}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
