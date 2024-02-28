import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE= {
  COLUMN:'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD:'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  //neu dung poiter sensor thi phai ket hop vs css touch-action nhung van bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  //yeu cau chuot di chuyen 10px thi moi kich hoat event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay:250, tolerance: 500 } })

  // const sensors =useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumn, setOrderedColumn] = useState([])

  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderedColumn(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board] )

  //khi bat dau keo 1 phan tu
  const handleDragStart= (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  //khi ket thuc 1 hanh dong keo (drag) la hanh dong tha drop
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
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles:{ active:{ opacity:0.5 } } })
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Box sx={{
        bgcolor:(theme) => (theme.palette.mode==='dark'?'#34495e':'#1976d2'),
        width:'100%',
        height: (theme) => theme.trello.boardContentHeight,
        p:'10px 0'
      }}>
        <ListColumns columns={orderedColumn} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {( !activeDragItemType && null)}
          {( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
