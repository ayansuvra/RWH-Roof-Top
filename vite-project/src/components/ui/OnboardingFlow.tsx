// src/components/OnboardingFlow.tsx
import { useState } from "react"
import { motion } from "framer-motion"
import { Progress } from "./progress"
import { LocationSelection } from "./LocationSelection"
import { UseTypeSelection } from "./UseTypeSelection"
import { TankConfiguration } from "./TankConfiguration"
import { RooftopDetails } from "./RooftopDetails"
import { TankCapacitySelection } from "./TankCapacitySelection"
import { WaterSourceSelection } from "./WaterSourceSelection"
import { Button } from "./button"
import { ArrowLeft } from "lucide-react"
import type { UserData } from "../../types"

interface OnboardingFlowProps {
  onComplete: (data: UserData) => void
  initialData: Partial<UserData>
  onBack: () => void
}

const steps = [
  "Location",
  "Use Type",
  "Tank Configuration",
  "Rooftop Details",
  "Tank Capacity",
  "Water Source",
]

export function OnboardingFlow({
  onComplete,
  initialData,
  onBack,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<UserData>>(initialData)
  const [isLoading, setIsLoading] = useState(false)

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = async (stepData: Partial<UserData>) => {
    setIsLoading(true)

    // Fake loading effect
    await new Promise((resolve) => setTimeout(resolve, 800))

    const updatedData = { ...formData, ...stepData }
    setFormData(updatedData)

    if (currentStep === steps.length - 1) {
      onComplete(updatedData as UserData)
    } else {
      setCurrentStep((prev) => prev + 1)
    }

    setIsLoading(false)
  }

  const handleBack = () => {
    if (currentStep === 0) {
      onBack()
    } else {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const renderCurrentStep = () => {
    const stepProps = {
      onNext: handleNext,
      isLoading,
      data: formData,
    }

    switch (currentStep) {
      case 0:
        return <LocationSelection {...stepProps} />
      case 1:
        return <UseTypeSelection {...stepProps} />
      case 2:
        return <TankConfiguration {...stepProps} userData={formData as any} onBack={() => setCurrentStep(currentStep - 1)} />
      case 3:
        return <RooftopDetails {...stepProps} />
      case 4:
        return <TankCapacitySelection {...stepProps} />
      case 5:
        return <WaterSourceSelection {...stepProps} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header with progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="bg-white/80 backdrop-blur rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <h2 className="text-blue-800 font-semibold">
                Setup Your Rainwater Harvesting System
              </h2>
            </div>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{steps[currentStep]}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Current step content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {renderCurrentStep()}
      </motion.div>

      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-8 flex items-center gap-4 shadow-xl">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700">Processing your information...</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
