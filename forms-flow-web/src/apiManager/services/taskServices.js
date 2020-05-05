import {  httpGETRequest, httpPOSTRequest } from '../httpRequestHandler'
import API from '../endpoints'
import { setTaskList, setTaskCount, serviceActionError, setLoader, setTaskDetail } from '../../actions/taskActions'

export const fetchTaskList = () =>{
    return dispatch => {
      httpPOSTRequest(API.GET_TASK_API,{"taskVariables":[]}).then(res => {
          if (res.data) {
            dispatch(setTaskList(res.data))
            dispatch(setLoader(false))
          } else {
            console.log('Error',res);
            dispatch(serviceActionError(res))
            dispatch(setLoader(false))
          }
        }).catch((error) => {
          console.log('Error',error);
          dispatch(serviceActionError(error))
          dispatch(setLoader(false))
        })
      }
}
export const getTaskCount = () =>{
    return dispatch => {
      httpPOSTRequest(API.GET_TASK_COUNT,{"taskVariables":[]}).then(res => {
          if (res.data) {
            dispatch(setTaskCount(res.data))
          } else {
            console.log('Error',res);
            dispatch(serviceActionError(res))
          }
        }).catch((error) => {
          console.log('Error',error);
          dispatch(serviceActionError(error))
        })
      }
}

export const getTaskDetail = (id) =>{
  return dispatch=>{
    httpGETRequest(`${API.TASK_ACTION_API}/${id}`).then(res=>{
      if(res.status === 200){
        dispatch(setTaskDetail(res.data))
        dispatch(setLoader(false))
      }
    })
    .catch(error=>{
      dispatch(serviceActionError(error))
      dispatch(setLoader(false))
    })
  }
}

export const claimTask = (id,user)=>{
  // console.log("Claimed",id,user)
  return dispatch=>{
    httpPOSTRequest(`${API.TASK_ACTION_API}/${id}/claim`,{userId:user}).then(res=>{
      if(res.status === 204){
        dispatch(setLoader(true))
        dispatch(fetchTaskList())
      }
    }).catch(error=>{
      console.log('Error',error)
      dispatch(serviceActionError(error))
    })
  }
}
export const unClaimTask = (id)=>{
  return dispatch=>{
    httpPOSTRequest(`${API.TASK_ACTION_API}/${id}/unclaim`).then(res=>{
      if(res.status === 204){
        dispatch(setLoader(true))
        dispatch(fetchTaskList())
      }
    }).catch(error=>{
      console.log('Error',error)
      dispatch(serviceActionError(error))
    })
  }
}
export const completeTask=(id,reviewStatus)=>{
  const data={
    "variables": {
      "action": {
        "value":  reviewStatus
        }
   }
  }
  return dispatch=>{
    httpPOSTRequest(`${API.TASK_ACTION_API}/${id}/complete`,data).then(res=>{
      dispatch(fetchTaskList())
    }).catch(error=>{
      console.log('Error',error)
      dispatch(serviceActionError(error))
    })
  }
}
