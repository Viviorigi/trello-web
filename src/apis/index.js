import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
// Board
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //luu y axios se tra ket qua property cua no la data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)

  return response.data
}


//Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  //luu y axios se tra ket qua property cua no la data
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)

  return response.data
}

export const DeleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

//Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  //luu y axios se tra ket qua property cua no la data
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_cards`, updateData)
  return response.data
}
