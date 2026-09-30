import { useState } from 'react'
import { submitContactMessage } from '../lib/endpoints'
import { ApiError } from '../lib/api'
import PageHeader from '../components/common/PageHeader'
import './Contact.css'

/**
 * Contact — plan §23. Submits to POST /api/v1/contact.
 *
 * The backend validates server-side (Backend/src/modules/contact/contact.schema.ts:
 * name 1-100, valid email <=255, subject <=200, message 1-2000). The same
 * limits are mirrored here so the visitor gets an immediate, specific error
 * instead of a round-trip rejection.
 *
 * No CAPTCHA is included: §25 requires one for public forms, but the backend
 * notes no provider exists yet, so it is deliberately absent rather than faked.
 */
const LIMITS = { name: 100, email: 255, subject: 200, message: 2000 }

const validate = (values) => {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  else if (values.name.trim().length > LIMITS.name) errors.name = 'Name is too long.'

  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = 'Please enter a valid email address.'
  else if (values.email.trim().length > LIMITS.email) errors.email = 'Email is too long.'

  if (values.subject.length > LIMITS.subject) errors.subject = 'Subject is too long.'

  if (!values.message.trim()) errors.message = 'Please enter your message.'
  else if (values.message.trim().length > LIMITS.message)
    errors.message = `Message is too long (max ${LIMITS.message} characters).`

  return errors
}

const EMPTY = { name: '', email: '', subject: '', message: '' }

const Contact = () => {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | sent
  const [submitError, setSubmitError] = useState(null)

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setStatus('submitting')
    try {
      await submitContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim() || undefined,
        message: values.message.trim(),
      })
      setStatus('sent')
      setValues(EMPTY)
    } catch (error) {
      setStatus('idle')
      setSubmitError(
        error instanceof ApiError
          ? error
          : new ApiError('Your message could not be sent. Please try again.'),
      )
    }
  }

  return (
    <>
      <PageHeader
        title="Contact"
        lead="Reach the PM SETU Cell at the Department of Skill Development, IT & Innovation, Government of Andhra Pradesh."
        breadcrumb={[{ label: 'Contact' }]}
      />

      <div className="container page-section contact">
        <div className="contact__details">
          <h2 className="page-subtitle">PM SETU Cell</h2>
          <address className="contact__address">
            Department of Skill Development, IT &amp; Innovation
            <br />
            Government of Andhra Pradesh
          </address>
          <p className="contact__note">
            For queries about clusters, industry partnerships, Special Purpose
            Vehicles or Government Orders, please use the form and include the
            relevant reference number where you have one.
          </p>
        </div>

        <div className="contact__form-wrap">
          {status === 'sent' ? (
            <div className="form-success" role="status">
              <h2 className="form-success__title">Thank you</h2>
              <p>
                Your message has been received by the PM SETU Cell. A reply will
                be sent to the email address you provided.
              </p>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  setStatus('idle')
                  setSubmitError(null)
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={onSubmit} noValidate>
              {submitError && (
                <p className="form-error" role="alert">
                  {submitError.message}
                </p>
              )}

              <label className="field">
                <span className="field__label">
                  Name <span aria-hidden="true">*</span>
                </span>
                <input
                  className="field__input"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={update('name')}
                  maxLength={LIMITS.name}
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <span className="field__error" id="name-error">
                    {errors.name}
                  </span>
                )}
              </label>

              <label className="field">
                <span className="field__label">
                  Email <span aria-hidden="true">*</span>
                </span>
                <input
                  className="field__input"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={update('email')}
                  maxLength={LIMITS.email}
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <span className="field__error" id="email-error">
                    {errors.email}
                  </span>
                )}
              </label>

              <label className="field">
                <span className="field__label">Subject</span>
                <input
                  className="field__input"
                  type="text"
                  name="subject"
                  value={values.subject}
                  onChange={update('subject')}
                  maxLength={LIMITS.subject}
                  aria-invalid={!!errors.subject}
                />
                {errors.subject && <span className="field__error">{errors.subject}</span>}
              </label>

              <label className="field">
                <span className="field__label">
                  Message <span aria-hidden="true">*</span>
                </span>
                <textarea
                  className="field__input"
                  name="message"
                  rows={6}
                  value={values.message}
                  onChange={update('message')}
                  maxLength={LIMITS.message}
                  required
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <span className="field__error" id="message-error">
                    {errors.message}
                  </span>
                )}
              </label>

              <button
                type="submit"
                className="btn btn--primary"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default Contact
