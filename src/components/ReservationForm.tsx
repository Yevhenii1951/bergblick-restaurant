import { useState, type FormEvent } from 'react'
import type { Dictionary } from '../i18n/types'

export default function ReservationForm({ dict }: { dict: Dictionary }) {
  const [submitted, setSubmitted] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState('2')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return <p className="text-success">{dict.reservation.success}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-200 p-6">
      <div className="grid grid-cols-2 gap-3">
        <label className="form-control mb-3 gap-8">
          <span className="label-text">{dict.reservation.date}</span>
          <input
            className="input input-bordered"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label className="form-control mb-3 gap-8">
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
      <label className="form-control mb-3 gap-8">
        <span className="label-text">{dict.reservation.guests}</span>
        <input
          className="input input-bordered"
          type="number"
          min={1}
          max={30}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          required
        />
      </label>
      <label className="form-control mb-3 gap-8">
        <span className="label-text">{dict.reservation.name}</span>
        <input
          className="input input-bordered"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="form-control mb-3 gap-8">
        <span className="label-text">{dict.reservation.phone}</span>
        <input
          className="input input-bordered"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </label>
      <label className="form-control mb-3 gap-8">
        <span className="label-text">{dict.reservation.email}</span>
        <input
          className="input input-bordered"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="form-control mb-4 gap-8">
        <span className="label-text">{dict.reservation.note}</span>
        <textarea
          className="textarea textarea-bordered"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <button type="submit" className="btn btn-primary w-full rounded-lg font-semibold text-success!">
        {dict.reservation.submit}
      </button>
    </form>
  )
}