import React from 'react'
import {useAppContext} from '../../context/AppContext'
import TextMessage from './TextMessage'
import ImageMessage from './ImageMessage'
import FileMessage from './FileMessage'
import VoiceMessage from './VoiceMessage'

const Message = (message) => {
  const {user} = useAppContext()
  if (message.type === 'text') {
      return <TextMessage {...message} />
  } else if (message.type === 'image') {
      return <ImageMessage {...message}/>
  } else if (message.type === 'file') {
    return <FileMessage {...message} />
  } else if (message.type === 'voice') {
    return <VoiceMessage {...message} />
  }
}

export default Message