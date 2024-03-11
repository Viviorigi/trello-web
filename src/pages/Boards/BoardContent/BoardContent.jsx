import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
  // closestCenter
} from '@dnd-kit/core'

import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatter'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE= {
  COLUMN:'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD:'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewColumn, createNewCard, moveColumns, moveCardInTheSameColumn }) {
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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  // diem va cham cuoi cung xu ly thuat toan phat hien va cham
  const lastOverId= useRef(null)

  useEffect(() => {
    setOrderedColumn(board?.columns)
  }, [board] )

  //tim 1 column theo cardId
  const findColumnByCardId = (cardId) => {

    return orderedColumn.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //cap nhat lai satete trong truong hop di chuyen card giua cac column khac nhau
  const moveCardBetweenDifferrentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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

        //them placeholdecard neu column rong bi keo het card di khong con cai nao nua
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards =[generatePlaceholderCard(nextActiveColumn)]
        }
        //cap nhat lai mang cardorderid cho du lieu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      //column moi
      if (nextOverColumn) {
        //kiem tra xem card dang keo co ton tai o overcolumn chua neu co thi xoa no truoc
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        //doi voi dragend thi phai cap nhat lai chuan du lieu columnId trong card  sau khi keo gia 2 column khac nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        //tiep theo them cai card dang keo vao overcolumn theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        //xoa placeholder card di neu no dang ton tai
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        //cap nhat lai mang cardorderid cho du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  //khi bat dau keo 1 phan tu
  const handleDragStart= (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // neu keo card thi moi thuc hien hanh dong set gia tri oldcolumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active.id))
    }
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
    const { id: activeDraggingCardId, data:{ current: activeDraggingCardData } } = active
    // overcard: la card dang duoc tuong tac tren hoac duoi so voi card keo o tren
    const { id:overCardId } =over

    //tim 2 column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    //neu khong ton tai 1 trong 2 column ko lam gi het
    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferrentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }

  }

  //khi ket thuc 1 hanh dong keo (drag) la hanh dong tha drop
  const handleDragEnd= (event) => {

    // console.log('handleDragEnd', event)
    const { active, over }= event

    //kiem tra neu khong ton tai over hoac active tranh loi crash trang
    if (!active || !over) return

    // xu ly keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {

      //  activedragingcard la card dang duoc keo
      const { id: activeDraggingCardId, data:{ current: activeDraggingCardData } } = active
      // overcard: la card dang duoc tuong tac tren hoac duoi so voi card keo o tren
      const { id:overCardId } =over

      //tim 2 column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      //neu khong ton tai 1 trong 2 column ko lam gi het
      if (!activeColumn || !overColumn) return


      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //Hanh Dong keo tha giua 2 column
        if ( oldColumnWhenDraggingCard._id !== overColumn._id ) {
          moveCardBetweenDifferrentColumns(
            overColumn,
            overCardId,
            active,
            over,
            activeColumn,
            activeDraggingCardId,
            activeDraggingCardData
          )
        }
      } else {
        //Hanh Dong keo tha trong cung 1 column

        // lay vi tri cu tu oldColumnWhenDraggingCard

        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // lay vi tri moi
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        //dung arrayMove keo card tuong tu logic trong boardcontent
        const dndorderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndorderedCards.map(i => i._id)

        setOrderedColumn(preveColumns => {
          const nextColumns = cloneDeep(preveColumns)

          //tim toi column dang tha
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)

          // cap nhat lai 2 gia tri moi
          targetColumn.cards = dndorderedCards
          targetColumn.cardOrderIds=dndorderedCards.map(i => i._id)

          //tra ve gia tri state moi chuan vi tri
          return nextColumns
        })

        moveCardInTheSameColumn(dndorderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }

    // xu ly keo tha columns trong board content
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //Neu vi tri sau khi keo tha khac vi tri ban dau
      if (active.id !== over.id) {
        // lay vi tri cu tu thang active
        const oldColumnIndex = orderedColumn.findIndex(c => c._id === active.id)
        // lay vi tri moi
        const newColumnIndex = orderedColumn.findIndex(c => c._id === over.id)

        //dung arraymove san de sap xep lai mang
        const dndorderedColumns = arrayMove(orderedColumn, oldColumnIndex, newColumnIndex)


        //cap nhat lai state sau khi da keo tha
        setOrderedColumn(dndorderedColumns)


        moveColumns(dndorderedColumns)

      }
    }

    //nhung du lieu sau khi keo tha nay luon phai dua ve gia tri null mac dinh ban dau
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles:{ active:{ opacity:0.5 } } })
  }

  const collisionDetectionStraegy = useCallback((args ) => {
    // custom lai thuat toan va cham
    // truong hop keo column dung closestCorners
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    //tim cac diem va cham
    const pointerIntersections = pointerWithin(args)

    // fix triet de flickering
    if (!pointerIntersections?.length) return
    // thuat toan phat hien va cham tra ve mang cac va cham o day
    // const intersections = !! pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)
    // tim over id dau tien trong dam pointerIntersections o tren
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      const checkColumn = orderedColumn.find(column => column._id ===overId)
      if (checkColumn) {
        overId= closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    // neu overId la null thi tra ve mang rong tranh crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumn])

  return (
    <DndContext
      //cam bien
      sensors={sensors}
      // thuat toan phat hien va cham
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStraegy}

      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor:(theme) => (theme.palette.mode==='dark'?'#34495e':'#1976d2'),
        width:'100%',
        height: (theme) => theme.trello.boardContentHeight,
        p:'10px 0'
      }}>
        <ListColumns
          columns={orderedColumn}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
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
