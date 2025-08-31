import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationAPI } from '../../lib/api'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { DialogFooter } from '../ui/dialog'
import { toast } from 'sonner'

const ReservationForm = ({ reservation, onClose }) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: reservation?.name || '',
    phone: reservation?.phone || '',
    email: reservation?.email || '',
    reservation_date: reservation?.reservation_date || '',
    reservation_time: reservation?.reservation_time || '',
    party_size: reservation?.party_size || 1,
    special_requests: reservation?.special_requests || '',
    status: reservation?.status || 'pending',
  })

  useEffect(() => {
    if (reservation) {
      setFormData({
        name: reservation.name || '',
        phone: reservation.phone || '',
        email: reservation.email || '',
        reservation_date: reservation.reservation_date || '',
        reservation_time: reservation.reservation_time || '',
        party_size: reservation.party_size || 1,
        special_requests: reservation.special_requests || '',
        status: reservation.status || 'pending',
      })
    }
  }, [reservation])

  const handleChange = (e) => {
    const { id, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'number' ? parseInt(value) : value,
    }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }))
  }

  const createMutation = useMutation({
    mutationFn: reservationAPI.createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReservations'])
      toast.success('Reservation created successfully!')
      onClose()
    },
    onError: (error) => {
      toast.error('Failed to create reservation.', { description: error.message })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => reservationAPI.updateReservationStatus(id, data.status), // Assuming updateReservationStatus handles all fields
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReservations'])
      toast.success('Reservation updated successfully!')
      onClose()
    },
    onError: (error) => {
      toast.error('Failed to update reservation.', { description: error.message })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (reservation) {
      updateMutation.mutate({ id: reservation.id, data: formData })
    } else {
      createMutation.mutate(formData)
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
        <Label htmlFor="phone" className="text-right">
          Phone
        </Label>
        <Input
          id="phone"
          value={formData.phone}
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
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="reservation_date" className="text-right">
          Date
        </Label>
        <Input
          id="reservation_date"
          type="date"
          value={formData.reservation_date}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="reservation_time" className="text-right">
          Time
        </Label>
        <Input
          id="reservation_time"
          type="time"
          value={formData.reservation_time}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="party_size" className="text-right">
          Party Size
        </Label>
        <Input
          id="party_size"
          type="number"
          value={formData.party_size}
          onChange={handleChange}
          className="col-span-3"
          required
          min="1"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="special_requests" className="text-right">
          Special Requests
        </Label>
        <Textarea
          id="special_requests"
          value={formData.special_requests}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Select value={formData.status} onValueChange={handleSelectChange}>
          <SelectTrigger id="status" className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {reservation ? 'Update Reservation' : 'Create Reservation'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default ReservationForm


