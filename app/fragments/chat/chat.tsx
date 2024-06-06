import React from 'react'
import dynamic from 'next/dynamic'
import { GPTAssistantMessage, GPTAssistantMessagesList } from "@/app/api/client"
import classNames from 'classnames'
import usePublicUrl from '@/utils/next-public-url'

import { useAPIMutation, useAPIQuery } from "@/core/api/client"
import * as Auth from 'next-auth/react'

import krg from '@/app/krg'
import { AssembleState } from '@/app/api/v1/chat/utils'
import { useRouter } from 'next/router'
import * as dict from '@/utils/dict'
import { useFPL } from '../metapath'
import { StoryProvider } from '../story'
import { Waypoint, useWaypoints } from '@/app/components/waypoint'
import { Breadcrumbs } from '../breadcrumbs'
import { DataBreadcrumb, ProcessBreadcrumb } from '@/app/fragments/graph/breadcrumb'
import { extend_icon, func_icon, start_icon, variable_icon } from '@/icons'
import ReportButton from '../graph/report-button'
import Link from 'next/link'

const Cell = dynamic(() => import('@/app/fragments/report/cell'))
const Message = dynamic(() => import('@/app/fragments/chat/message'))
const SessionStatus = dynamic(() => import('@/app/fragments/session-status'))

export default function Page({ thread_id, session_id, embedded = false }: { thread_id: string, session_id?: string, embedded?: boolean }) {
  const router = useRouter()
  const publicUrl = usePublicUrl()
  const [message, setMessage] = React.useState('')
  const [collapse, setCollapse] = React.useState(false)
  const { data: session } = Auth.useSession()
  const { data: { messages, fpl } = { messages: undefined, fpl: null }, mutate } = useAPIQuery(GPTAssistantMessagesList, { thread_id })
  const { trigger, isMutating } = useAPIMutation(GPTAssistantMessage, { thread_id })
  // const { trigger: triggerDelete } = useAPIMutation(GPTAssistantDelete, { thread_id })
  const playbookState = React.useMemo(() => messages ? AssembleState(messages, { with_value: true }) : undefined, [messages])
  const submit = React.useCallback(async (body: { message: string } | { step: { id: number, value?: string } }) => {
    const res = await trigger({ body })
    if (res?.fpl) {
      router.push(`${session_id ? `/session/${session_id}` : ''}/report/${res.fpl}?thread=${thread_id}`)
    } else {
      await mutate((current) => ({ messages: [...current?.messages ?? [], ...res?.messages ?? []], fpl: null }))
    }
  }, [trigger, session_id, thread_id])
  const { data: metapath } = useFPL(fpl ? fpl : undefined)
  const { fpl_to_metapath, process_to_step } = React.useMemo(() => metapath ? {
    fpl_to_metapath: dict.init(metapath.map(h => ({ key: h.id, value: h }))),
    process_to_step: dict.init(metapath.map(h => ({ key: h.process.id, value: `${h.id}:${h.process.id}` }))),
  } : {
    fpl_to_metapath: {},
    process_to_step: {},
  }, [metapath])
  const head = React.useMemo(() => metapath ? metapath[metapath.length - 1] : undefined, [metapath])
  const { waypoints, scrollTo } = useWaypoints()
  return (
    <>
      <SessionStatus session_id={session_id}>
        <StoryProvider krg={krg} metapath={metapath ?? []}>
          {!embedded && metapath ?
          <>
            <Waypoint id="head" className="sticky top-0 left-0 z-20 bg-white dark:bg-current w-full flex flex-row place-items-center">
            <Breadcrumbs>
              <DataBreadcrumb
                key="start"
                index={0}
                id="start"
                label="Start"
                active={waypoints.get('start')?.active !== false}
                icon={[start_icon]}
                parents={[]}
                onClick={() => {
                  scrollTo('top')
                }}
              />
              {metapath.flatMap((step, i) => {
                const process = krg.getProcessNode(step.process.type)
                if (process === undefined) return []
                return [
                  <ProcessBreadcrumb
                    key={step.id}
                    index={i * 2 + 1}
                    id={step.id}
                    label={process.meta.label}
                    head={step}
                    active={false}
                    icon={process.meta.icon || [func_icon]}
                    parents={dict.isEmpty(step.process.inputs) ? ['start'] : dict.values(step.process.inputs).map(({ id }) => process_to_step[id])}
                    onClick={() => {
                      // setCellMetadata((cellMetadata) => ({ ...cellMetadata, [step.id]: { ...cellMetadata[step.id], process_visible: true, id: '' } }))
                      scrollTo(`${step.id}:process`)
                    }}
                  />,
                  <DataBreadcrumb
                    key={`${step.id}:${step.process.id}`}
                    index={i * 2 + 2}
                    id={`${step.id}:${step.process.id}`}
                    label={process.output.meta.label}
                    head={step}
                    active={!!waypoints.get(`${step.id}:data`)?.active}
                    icon={process.output.meta.icon || [variable_icon]}
                    parents={[step.id]}
                    onClick={() => {
                      // setCellMetadata((cellMetadata) => ({ ...cellMetadata, [step.id]: { ...cellMetadata[step.id], data_visible: true, id: '' } }))
                      scrollTo(`${step.id}:data`)
                    }}
                  />,
                ]
              })}
              <ProcessBreadcrumb
                key="extend"
                index={metapath.length * 2 + 1}
                id="extend"
                label="Extend"
                active={false}
                icon={extend_icon}
                parents={[head ? `${head.id}:${head.process.id}` : `start`]}
                onClick={() => {
                  scrollTo(`bottom`)
                }}
              />
            </Breadcrumbs>
            <ReportButton session_id={session_id} graph_id={fpl ?? 'start'} thread_id={thread_id} />
            </Waypoint>
            </>
            : null}
          <div className={classNames('flex flex-col', {"absolute top-0 left-1/2 w-1/2 z-30 h-screen max-h-screen mb-5 mr-5 pr-10 bg-transparent justify-end overflow-hidden pointer-events-none": embedded})}>
            <div className={classNames('flex flex-col bg-white p-2', { 'border rounded-xl border-black mt-48 pointer-events-auto overflow-hidden': embedded})}>
              <div className={classNames('flex-grow flex flex-row my-1', {'hidden': !embedded})}>
                <div className="prose">Text to Workflow</div>
                <div className="flex-grow">&nbsp;</div>
                <div className="btn btn-sm" onClick={() => {setCollapse(c => !c)}}>{collapse ? <>&#x2795;</> : <>&#x1F5D5;</>}</div>
                <Link href={`/chat/${thread_id}`}><div className="btn btn-sm">&#128470;</div></Link>
                <Link href={`/report/${fpl}`} shallow><div className="btn btn-sm bg-red-500">X</div></Link>
              </div>
              <div className={classNames('flex-grow flex flex-col overflow-hidden overflow-y-auto', {'hidden': collapse})}>
                <div className={classNames("flex-grow max-w-none flex flex-col justify-center items-center")}>
                  <img
                    className="w-32"
                    src={`${publicUrl}/PWB-logo.svg`}
                  />
                  <div className="prose"><h1>How can I help you today?</h1></div>
                </div>
                <Message role="welcome" session={session}>
                  I'm an AI-powered chat assistant interface designed to help you access the functionality of the playbook workflow builder.
                  Please start by asking your question of interest, and I'll try my best to help you answer it through the construction of a playbook workflow.
                </Message>
                <div className="flex flex-row flex-wrap justify-center gap-2 place-self-center prose overflow-hidden">
                  {[
                    'Show me the expression of ACE2 in healthy human tissues from GTEx',
                    'Find drugs from the LINCS L1000 Chemical Perturbations that up regulate STAT3',
                  ].map((suggestion, i) => {
                    return (
                      <button
                        key={i}
                        className="btn btn-ghost border border-primary btn-rounded rounded-lg btn-sm"
                        onClick={evt => {submit({ message: suggestion })}}
                      >{suggestion}</button>
                    )
                  })}
                </div>
                {messages?.map((message, i) => {
                  const head = !embedded && 'fpl' in message && message.fpl && fpl_to_metapath[message.fpl]
                  return (
                    <React.Fragment key={i}>
                      {head ?
                        <Cell
                          key={message.fpl}
                          session_id={session_id}
                          krg={krg}
                          id={fpl ?? ''}
                          head={head}
                          cellMetadata={{ [head.id]: head.cell_metadata ?? { id: head.id, label: '', description: '', data_visible: true, process_visible: true } }}
                          setCellMetadata={() => {}}
                        />
                      : null}
                      {'message' in message ?
                        <Message
                          thread_id={thread_id}
                          message_id={message.id}
                          role={message.role}
                          session={session}
                        >{message.message}</Message>
                        : null}
                      {message.role === 'assistant' && message.suggestions.length > 1 ?
                        <div className="flex flex-row flex-wrap justify-center gap-2 place-self-center">
                          {message.suggestions.map((suggestion: any) => {
                            const suggestionProcess = playbookState?.all_nodes[suggestion.id]
                            const suggestionNode = suggestionProcess ? krg.getProcessNode(suggestionProcess.name) : undefined
                            if (!suggestionNode) return null
                            return (
                              <div key={suggestion.id} className="tooltip" data-tip={suggestionNode.meta.description}>
                                <button
                                  className="btn btn-ghost border border-primary btn-rounded rounded-lg btn-sm"
                                  onClick={evt => {submit({ step: suggestion })}}
                                >{suggestionNode.meta.label}</button>
                              </div>
                            )
                          })}
                        </div>
                        : null}
                    </React.Fragment>
                  )
                })}
                {isMutating ?
                  <Message role="assistant" session={session}>
                    <progress className="progress w-full"></progress>
                  </Message>
                  : null}
                <Message role="user" session={session}>
                  <form
                    className="flex flex-row items-center"
                    onSubmit={async (evt) => {
                      evt.preventDefault()
                      await submit({ message })
                      setMessage(() => '')
                    }}
                  >
                    <input
                      type="text"
                      className="input w-full bg-transparent rounded-full"
                      placeholder="Type your questions here"
                      value={message}
                      onChange={evt => setMessage(() => evt.target.value)}
                    />
                    <button type="submit" className="btn btn-sm" disabled={!message}>Send</button>
                  </form>
                </Message>
              </div>
            </div>
          </div>
        </StoryProvider>
      </SessionStatus>
    </>
  )
}