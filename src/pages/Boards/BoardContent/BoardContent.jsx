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

import { cloneDeep } from 'lodash'

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

  //tim 1 column theo cardId
  const findColumnByCardId = (cardId) => {

    return orderedColumn.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //khi bat dau keo 1 phan tu
  const handleDragStart= (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

  }

  //trigger trong qua trinh keo (drag) 1 phan tu
  const handleDragOver= (event) => {

    //khong lam gi neu keo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) return

    //con keo card xu ly them de keo card qua lai cac columns
    // console.log('handleDragOver', event)

    const { active, over }=event
    //kiem tra neu khong ton tai over hoac active tranh loi crash trang
    if (!active || !over) return

    //  activedragingcard la card dang duoc keo
    const { id: activeDraggingCardId, data:{ current: activeDraggingCardData } } =active
    // overcard: la card dang duoc tuong tac tren hoac duoi so voi card keo o tren
    const { id:overCardId } =over

    //tim 2 column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    //neu khong ton tai 1 trong 2 column ko lam gi het
    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      setOrderedColumn(preveColumns => {

        //tim vi tri cua overcard trong column dich (noi activecard sap dc tha)

        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0

        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        const nextColumns = cloneDeep(preveColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn =nextColumns.find(column => column._id === overColumn._id)

        //column cu
        if (nextActiveColumn) {
          // xoa card o cai column active
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

          //cap nhat lai mang cardorderid cho du lieu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        //column moi
        if (nextOverColumn) {
          //kiem tra xem card dang keo co ton tai o overcolumn chua neu co thi xoa no truoc
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

          //tiep theo them cai card dang keo vao overcolumn theo vi tri index moi
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDragItemData)
          //cap nhat lai mang cardorderid cho du lieu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })
    }

  }

  //khi ket thuc 1 hanh dong keo (drag) la hanh dong tha drop
  const handleDragEnd= (event) => {
    // console.log('handleDragEnd', event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('hanh dong keo tha card tam thoi lm gi ca')
      return
    }

    const { active, over }= event

    //kiem tra neu khong ton tai over hoac active tranh loi crash trang
    if (!active || !over) return

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
      onDragOver={handleDragOver}
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
