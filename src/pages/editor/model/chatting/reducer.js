export const initState = {
  chattingList:{},
  loading:false,
  error: null,
  room: null,
};

const Action = {
	LOADING:'LOADING',
	ERROR:'ERROR',
	SUCCESS:'SUCCESS',
	CHANGE: 'CHANGE'
}

const setState = (chattingList,loading,error,room) => { return {chattingList,loading,error,room} }

export function reducer(state, action) {
  switch (action.type) {
    case Action.LOADING:
      return setState(state.chattingList, true, null,null)

    case Action.ERROR:
      return setState(state.chattingList, false, action.error, null)
		  
    case Action.SUCCESS:{
	  const newList = [action.msg, ...state.chattingList[action.roomId]]
	  state.chattingList[action.roomId] = newList
      return setState(state.chattingList, false, null, action.roomId)
	}
		  
	case Action.INIT: {
	   const newChatList = action.data.reverse()
	   state.chattingList[action.roomId] = newChatList
	   return setState(state.chattingList, false, null, action.roomId)
	}
		  
	case Action.CHANGE: 
	   return setState(state.chattingList, false, null, action.roomId)
		  
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const createDispatcher = (dispatch) => {
  return {
    loading() {
      dispatch({ type: Action.LOADING });
    },

    success(msg,roomId) {
      dispatch({ type: Action.SUCCESS, msg, roomId});
    },
	  
	init(data,roomId) {
	  dispatch({ type: Action.INIT, data, roomId});
	},
	  
	roomChange(roomId) {
	  dispatch({ type: Action.CHANGE, roomId});
	},

    error(error) {
      dispatch({ type: Action.ERROR, error });
    },
  };
};
