import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { start_icon, restart_icon } from '@/icons'
import { Alert } from '@blueprintjs/core'

const Icon = dynamic(() => import('@/app/components/icon'))

export default function RestartButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const onConfirm = React.useCallback(() => {
    setIsOpen(false)
    router.push(`/graph/start/extend`, undefined, { shallow: true })
  }, [router])
  if (router.asPath === '/graph/start/extend') return null
  return (
    <>
      <button className="bp4-button bp4-minimal" onClick={evt => {
        if (evt.shiftKey) {
          onConfirm()
        } else {
          setIsOpen(true)
        }
      }}>
        <Icon icon={restart_icon} />
      </button>
      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Restart"
        icon="reset"
        intent="warning"
        isOpen={isOpen}
        canEscapeKeyCancel
        canOutsideClickCancel
        onCancel={() => {setIsOpen(false)}}
        onConfirm={() => {onConfirm()}}
      >
        <p className="prose">
          Are you sure you want to restart? If you haven't saved the this session, it might be deleted.
        </p>
        <p className="prose">
          If you want to continue this session with additional inputs, you should instead click the <Icon icon={start_icon} /> icon in the breadcrumbs.
        </p>
        <p className="prose">
          <b>Tip:</b> Hold shift when clicking to skip this confirmation.
        </p>
      </Alert>
    </>
  )
}