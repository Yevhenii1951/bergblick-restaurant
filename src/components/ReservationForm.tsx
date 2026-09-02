import { useState, type FormEvent } from 'react'
import type { Dictionary } from '../i18n/types'

export default function ReservationForm({ dict }: { dict: Dictionary }) {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState('2')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return <p className="text-success">{dict.reservation.success}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-200 p-6">
      <label className="form-control mb-3">
        <span className="label-text">{dict.takeaway.name}</span>
        <input
          className="input input-bordered"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="form-control mb-3">
          <span className="label-text">{dict.reservation.date}</span>
          <input
            className="input input-bordered"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label className="form-control mb-3">
          <span className="label-text">{dict.reservation.time}</span>
          <input
            className="input input-bordered"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>
      </div>
      <label className="form-control mb-4">
        <span className="label-text">{dict.reservation.guests}</span>
        <input
          className="input input-bordered"
          type="number"
          min={1}
          max={30}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
      </label>
      <button type="submit" className="btn btn-primary">
        {dict.reservation.submit}
      </button>
    </form>
  )
}
