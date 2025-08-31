import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'

const SettingsForm = () => {
  const [settings, setSettings] = useState({
    restaurantName: 'Oasis Tides Restaurant',
    contactEmail: 'info@oasistides.com',
    contactPhone: '+1234567890',
    address: '123 Ocean View, Coastal City, CA 90210',
    // Add more settings as needed
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real application, you would send these settings to a backend API
    console.log('Saving settings:', settings)
    toast.success('Settings saved successfully! (Frontend only)')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="restaurantName" className="text-right">
          Restaurant Name
        </Label>
        <Input
          id="restaurantName"
          value={settings.restaurantName}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contactEmail" className="text-right">
          Contact Email
        </Label>
        <Input
          id="contactEmail"
          type="email"
          value={settings.contactEmail}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contactPhone" className="text-right">
          Contact Phone
        </Label>
        <Input
          id="contactPhone"
          value={settings.contactPhone}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address" className="text-right">
          Address
        </Label>
        <Textarea
          id="address"
          value={settings.address}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      {/* Add more setting fields here */}
      <div className="flex justify-end">
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  )
}

export default SettingsForm


