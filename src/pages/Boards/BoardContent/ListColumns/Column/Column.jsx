import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useConfirm } from 'material-ui-confirm'

function Column({ column, createNewCard, deleteColumnDetails }) {

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    // touchAction:'none', //danh cho default dang pointersensor
    transform: CSS.Translate.toString(transform),
    transition,
    height:'100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const orderedCards = column?.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = async () => {

    if (!newCardTitle) {
      toast.error('Please enter card title!', { position:'bottom-right' })
      return
    }
    // console.log( newCardTitle )

    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    createNewCard(newCardData)
    // Dong trang thai them Card moi va clear input

    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  const confirmDeleteColumn= useConfirm()
  //Xu ly xoa 1 column va Cards ben trong no
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title:'Delete Column?',
      description:'This action will permanently delete your Column and its Cards ! Are you sure?',
      confirmationText:'Confirm',
      cancellationText:'Cancel'

      // buttonOrder:['confirm', 'cancel']
      // allowClose: false,
      // dialogProps:{ maxWidth:'sm' },
      // confirmationButtonProps:{ color:'success', variant: 'outlined' },
      // cancellationButtonProps:{ color:'primary' },
      // description:'Phai nhap chu duongdev moi dc confirm',
      // confirmationKeyword:'duongdev'

    }).then(() => {
      deleteColumnDetails(column._id)
    }).catch(() => {})

  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes} >
      <Box
        {...listeners}
        sx={{
          minWidth:'300px',
          maxWidth:'300px',
          bgcolor:(theme) => (theme.palette.mode==='dark'?'#333643':'#ebecf0'),
          ml:2,
          borderRadius:'6px',
          height:'fit-content',
          maxHeight:  (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>
        {/* Box Column header */}
        <Box sx={{
          height:(theme) => theme.trello.columnHeaderHeight,
          p:2,
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between'
        }}>
          <Typography variant='h6' sx={{
            fontSize:'1rem',
            fontWeight: 'bold',
            cursor:'pointer'
          }}>
            { column?.title }
          </Typography>
          <Box>
            <Tooltip>
              <ExpandMoreIcon
                sx={{ color:'text.primary', cursor:'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem onClick={toggleOpenNewCardForm}
                sx={{ '&:hover':{ color: 'success.light', '& .addCardIcon': { color: 'success.light' } } }}>
                <ListItemIcon> <AddCardIcon className='addCardIcon' fontSize="small" /> </ListItemIcon>
                <ListItemText>Add new Card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <ContentCut fontSize="small" /> </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <ContentCopy fontSize="small" /> </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon> <ContentPaste fontSize="small" /> </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>

              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{ '&:hover':{ color: 'warning.dark', '& .delete-forever-icon': { color: 'warning.dark' } } }}>
                <ListItemIcon>
                  <DeleteForeverIcon className='delete-forever-icon' fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete this Column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive This Column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Listcards */}
        <ListCards cards={ orderedCards }/>

        {/* Box Column footer */}
        <Box sx={{
          height:(theme) => theme.trello.columnFooterHeight,
          p:2
        }}>
          {!openNewCardForm
            ?
            <Box sx={{
              height:'100%',
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between'
            }}>
              <Button startIcon={<AddCardIcon/>} onClick={toggleOpenNewCardForm}>Add new Card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor:'pointer' }}/>
              </Tooltip>
            </Box>
            :
            <Box sx={{
              height:'100%',
              display:'flex',
              alignItems:'center',
              gap: 1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd='true'
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label':{ color:'text.primary' },
                  '& input':{
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#333643': 'white'
                  },
                  '& label.Mui-focused':{ color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root':{
                    '& fieldSet':{ borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldSet':{ borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldSet':{ borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input':{
                    borderRadius: 1
                  }
                }} />
              <Box sx={{ display: 'flex', alignItems:'center', gap:1 }}>
                <Button
                  onClick={addNewCard}
                  variant='contained' color='success' size='small'
                  sx={{
                    boxShadow:'none',
                    border:'0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover':{ bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add</Button>
                <CloseIcon
                  fontSize='small'
                  sx= {{ color: (theme) => theme.palette.warning.light, cursor:'pointer' }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column
