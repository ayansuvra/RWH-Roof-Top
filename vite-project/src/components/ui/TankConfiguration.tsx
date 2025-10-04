import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
<<<<<<< HEAD
import type { UserData } from "../../App"
=======
import type { UserData } from "../../types"
>>>>>>> 91035f242822e29c6a25f48256e59c13c7364b5f

interface TankConfigurationProps {
  userData: UserData
  onNext: (data: Partial<UserData>) => void
  onBack: () => void
}

export function TankConfiguration({ userData, onNext, onBack }: TankConfigurationProps) {
  const [capacity, setCapacity] = useState(userData.tankCapacity || 1000)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ tankCapacity: capacity })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Tank Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="capacity">Tank Capacity (Liters)</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              min="100"
              max="50000"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
