import React from 'react';
import { ChattingContext } from '../model/chatting';


function useChatting() {
  	const props = React.useContext(ChattingContext)
	return props
}

export default useChatting;