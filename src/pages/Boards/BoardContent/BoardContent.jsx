import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({ board }) {
  //neu dung poiter sensor thi phai ket hop vs css touch-action nhung van bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  //yeu cau chuot di chuyen 10px thi moi kich hoat event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay:250, tolerance: 500 } })

  // const sensors =useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumn, setOrderedColumn] = useState([])
  useEffect(() => {
    setOrderedColumn(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board] )
  const handleDragEnd= (event) => {
    // console.log('handleDragEnd', event)
    const { active, over }= event
    //kiem tra neu khong ton tai over tranh loi
    if (!over) return
    //Neu vi tri sau khi keo tha khac vi tri ban dau
    if (active.id !== over.id) {
      // lay vi tri cu
      const oldIndex = orderedColumn.findIndex(c => c._id === active.id)
      // lay vi tri moi
      const newIndex = orderedColumn.findIndex(c => c._id === over.id)

      //dung arraymove san de sap xep lai mang
      const dndorderedColumns = arrayMove(orderedColumn, oldIndex, newIndex)
      // 2 cai nay goi api de xu ly
      // const dndorderedColumnsIds = dndorderedColumns.map(c => c._id )
      // console.log(dndorderedColumns)
      // console.log(dndorderedColumnsIds)

      //cap nhat lai state sau khi da keo tha
      setOrderedColumn(dndorderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor:(theme) => (theme.palette.mode==='dark'?'#34495e':'#1976d2'),
        width:'100%',
        height: (theme) => theme.trello.boardContentHeight,
        p:'10px 0'
      }}>
        <ListColumns columns={orderedColumn} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
