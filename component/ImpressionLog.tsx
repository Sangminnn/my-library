import { PropsWithChildren } from 'react'

import { Log } from '@models/interfaces/log'
import ImpressionArea from '@components/impressionComponent/ImpressionArea'
import useLog from '@hooks/useLog'
import { useLogParams } from '@components/loggingClick/LogScreen'

interface Props {
  params: Log
  isActivated?: boolean
}

const ImpressionLog = ({ params, isActivated = true, children }: PropsWithChildren<Props>) => {
  const { onImpressionLog } = useLog()
  const pageLogContext = useLogParams()

  const sendImpressionLog = () => {
    if (!isActivated) return

    onImpressionLog({ ...pageLogContext, ...params })
  }

  return <ImpressionArea onImpressionStart={sendImpressionLog}>{children}</ImpressionArea>
}

export default ImpressionLog
