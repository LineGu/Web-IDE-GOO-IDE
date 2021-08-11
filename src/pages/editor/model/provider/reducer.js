export const initState = {
  data:null,
  loading:false,
  error: null
};

const Action = {
	LOADING:'LOADING',
	ERROR:'ERROR',
	SUCCESS:'SUCCESS'
}

const setState = (data,loading,error) => {return {data,loading,error}}

export function reducer(state, action) {
  switch (action.type) {
    case Action.LOADING:
      return setState(null, true, null)

    case Action.ERROR:
      return setState(null, false, action.error)
		  
    case Action.SUCCESS:
      return setState(action.data, false, null)
		  
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const createDispatcher = (dispatch) => {
  return {
    loading() {
      dispatch({ type: Action.LOADING });
    },

    success(data) {
      dispatch({ type: Action.SUCCESS, data});
    },

    error(error) {
      dispatch({ type: Action.ERROR, error });
    },
  };
};
