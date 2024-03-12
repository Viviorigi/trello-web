import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tam thoi fix cung boardId
    const boardId = '65ea8052593c3da2488e290b'
    //CallAPI
    fetchBoardDetailsAPI(boardId).then((board) => {

      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards =[generatePlaceholderCard(column)]
          column.cardOrderIds=[generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])

  // func nay co nhiem vu goi api tao moi column va lam moi du lieu state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards =[generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds=[generatePlaceholderCard(createdColumn)._id]

    //cap nhat state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  // func nay co nhiem vu goi api tao moi card va lam moi du lieu state board
  const createNewCard = async (newCardData) => {
    const createCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    //cap nhat state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id ===createCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createCard]
        columnToUpdate.cardOrderIds= [createCard._id]
      } else {
        columnToUpdate.cards.push(createCard)
        columnToUpdate.cardOrderIds.push(createCard._id)
      }
    }
    setBoard(newBoard)
  }

  // func nay co nhiem vu goi API va xu ly khi keo tha column chi can thay vi tri trong mang columnOrderIds trong board chua no
  const moveColumns = (dndorderedColumns) => {
    // update cho chuan du lieu state board
    const dndorderedColumnsIds = dndorderedColumns.map(c => c._id )
    const newBoard = { ...board }
    newBoard.columns = dndorderedColumns
    newBoard.columnOrderIds = dndorderedColumnsIds
    setBoard(newBoard)

    //goi api update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }
  // khi di chuyen card trong column chi can goi API cap nhat mang cardOrderIds trong column chua no
  const moveCardInTheSameColumn = (dndorderedCards, dndOrderedCardIds, columnId) => {
    // update cho chuan du lieu state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndorderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)
    //goi api update board
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDifferentColumn= (currentCardId, preColumnId, nextColumnId, dndorderedColumns ) => {

    // update cho chuan du lieu state board
    const dndorderedColumnsIds = dndorderedColumns.map(c => c._id )
    const newBoard = { ...board }
    newBoard.columns = dndorderedColumns
    newBoard.columnOrderIds = dndorderedColumnsIds
    setBoard(newBoard)

    //Goi API xu ly phia BE
    let prevCardOrderIds = dndorderedColumns.find(c => c._id === preColumnId)?.cardOrderIds
    //Xu ly van de khi keo card cuoi cung khoi column column rong co placeholder card can xoa no truoc khi gui cho be
    if (prevCardOrderIds[0].includes('placeholder-card')) {
      prevCardOrderIds=[]
    }

    moveCardToDifferentColumnAPI({
      currentCardId,
      preColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndorderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems:'center',
        justifyContent:'center',
        gap: 2,
        width:'100vw',
        height:'100vh'
      }}>
        <CircularProgress />
        <Typography />
      </Box>
    )
  }


  return (
    <Container disableGutters maxWidth={ false } sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={ board } />
      <BoardContent
        board={ board }
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
