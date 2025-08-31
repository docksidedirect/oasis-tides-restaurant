import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authAPI } from '../../lib/api'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { DialogFooter } from '../ui/dialog'
import { toast } from 'sonner'

const UserForm = ({ user, onClose }) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    phone: user?.phone || '',
    address: user?.address || '',
    role: user?.role || 'client',
    is_active: user?.is_active || true,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Passwords are not pre-filled for security
        password_confirmation: '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || 'client',
        is_active: user.is_active || true,
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  const createUserMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers'])
      toast.success('User created successfully!')
      onClose()
    },
    onError: (error) => {
      toast.error('Failed to create user.', { description: error.message })
    },
  })

  // Laravel doesn't have a direct 'update user' endpoint for admin, 
  // so we'll simulate it by calling register with existing user data
  // In a real app, you'd have a dedicated admin user update endpoint.
  const updateUserMutation = useMutation({
    mutationFn: (data) => authAPI.register(data), // Re-using register for simplicity, ideally a dedicated update endpoint
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers'])
      toast.success('User updated successfully!')
      onClose()
    },
    onError: (error) => {
      toast.error('Failed to update user.', { description: error.message })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (user) {
      // For updating, we only send fields that are changed or necessary
      const dataToUpdate = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
        is_active: formData.is_active,
      }
      if (formData.password) {
        dataToUpdate.password = formData.password
        dataToUpdate.password_confirmation = formData.password_confirmation
      }
      updateUserMutation.mutate(dataToUpdate)
    } else {
      createUserMutation.mutate(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="col-span-3"
          placeholder={user ? 'Leave blank to keep current' : ''}
          required={!user}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password_confirmation" className="text-right">
          Confirm Password
        </Label>
        <Input
          id="password_confirmation"
          type="password"
          value={formData.password_confirmation}
          onChange={handleChange}
          className="col-span-3"
          required={!user}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Phone
        </Label>
        <Input
          id="phone"
          value={formData.phone}
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
          value={formData.address}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">
          Role
        </Label>
        <Select value={formData.role} onValueChange={handleSelectChange}>
          <SelectTrigger id="role" className="col-span-3">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="is_active" className="text-right">
          Is Active
        </Label>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={createUserMutation.isPending || updateUserMutation.isPending}>
          {user ? 'Update User' : 'Add User'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default UserForm


