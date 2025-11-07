"use client"

interface SalesProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function SalesProgressBar({ currentStep, totalSteps }: SalesProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100
  const steps = ["Customer", "Products", "Payment", "Complete"]

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="relative h-2 bg-background rounded-full overflow-hidden border border-border">
        <div
          className="absolute top-0 left-0 h-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-xs font-medium">
        {steps.map((stepName, idx) => (
          <span key={idx} className={`${idx <= currentStep ? "text-accent" : "text-muted-foreground"}`}>
            {stepName}
          </span>
        ))}
      </div>
    </div>
  )
}
