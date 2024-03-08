import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatter'
const MENU_STYLES= {
  color:'white',
  bgcolor:'transparent',
  border:'none',
  paddingX:'5px',
  borderRadius:'4px',
  '.MuiSvgIcon-root':{
    color:'white'
  },
  '&:hover': {
    bgcolor:'primary.50'
  }
}

function BoardBar({ board }) {

  return (
    <Box sx={{
      width:'100%',
      height: (theme) => theme.trello.boardBarHeight,
      display:'flex',
      alignItems:'center',
      justifyContent:'space-between',
      gap:2,
      paddingX:2,
      overflowX:'auto',
      bgcolor:(theme) => (theme.palette.mode==='dark'?'#34495e':'#1976d2'),
      '&::-webkit-scrollbar-track':{ m : 2 }
    }}>
      <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip> 
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filter"
          clickable
        />
      </Box>
      <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon/>}
          sx={{
            color: 'white',
            borderColor:'white',
            '&:hover': { borderColor:'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            gap:'10px',
            '& .MuiAvatar-root':{
              width:'34px',
              height:'34px',
              fontSize:'16px',
              border:'none',
              color:'white',
              cursor:'pointer',
              '&:first-of-type':{ bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="Duongdev">
            <Avatar
              alt="Duongdev"
              src="https://cdn.discordapp.com/attachments/1062032706977931387/1062042979331752006/cropped-1920-1080-1109284.png?ex=65e5f49a&is=65d37f9a&hm=a6091d5356acf0941ccb9d6e1a9c5ecf3a731d9edf2b9c5b571f7b610bf981a4&" />
          </Tooltip>
          <Tooltip title="Duongdev">
            <Avatar
              alt="Duongdev"
              src="https://cdn.discordapp.com/attachments/1062032706977931387/1062039388378378318/stretched-1920-1080-1129512.jpg?ex=65e5f141&is=65d37c41&hm=521eb6c153a40bf9be696fc93750e060f36f62df06cfe54ba0064b8bf7ffa8bd&" />
          </Tooltip>
          <Tooltip title="Duongdev">
            <Avatar
              alt="Duongdev"
              src="https://cdn.discordapp.com/attachments/1062032706977931387/1062039388378378318/stretched-1920-1080-1129512.jpg?ex=65e5f141&is=65d37c41&hm=521eb6c153a40bf9be696fc93750e060f36f62df06cfe54ba0064b8bf7ffa8bd&" />
          </Tooltip>
          <Tooltip title="Duongdev">
            <Avatar
              alt="Duongdev"
              src="https://cdn.discordapp.com/attachments/1062032706977931387/1062042979331752006/cropped-1920-1080-1109284.png?ex=65e5f49a&is=65d37f9a&hm=a6091d5356acf0941ccb9d6e1a9c5ecf3a731d9edf2b9c5b571f7b610bf981a4&" />
          </Tooltip>
          <Tooltip title="Duongdev">
            <Avatar
              alt="Duongdev"
              src="https://cdn.discordapp.com/attachments/1062032706977931387/1062036283419021412/xinh.png?ex=65e5ee5d&is=65d3795d&hm=6014f1cd4c77651604d7c822fc0d0b981e7bf09840cef4649ec925c34d2004b2&" />
          </Tooltip>
          <Tooltip title="Duongdev">
            <Avatar
              alt="Duongdev"
              src="https://cdn.discordapp.com/attachments/1062032706977931387/1062036283419021412/xinh.png?ex=65e5ee5d&is=65d3795d&hm=6014f1cd4c77651604d7c822fc0d0b981e7bf09840cef4649ec925c34d2004b2&" />
          </Tooltip>
          <Tooltip title="Duongdev">
            <Avatar
              alt="Duongdev"
              src="https://cdn.discordapp.com/attachments/1062032706977931387/1062036283419021412/xinh.png?ex=65e5ee5d&is=65d3795d&hm=6014f1cd4c77651604d7c822fc0d0b981e7bf09840cef4649ec925c34d2004b2&" />
          </Tooltip>
          <Tooltip title="Duongdev">
            <Avatar
              alt="Duongdev"
              src="https://cdn.discordapp.com/attachments/1062032706977931387/1062039388378378318/stretched-1920-1080-1129512.jpg?ex=65e5f141&is=65d37c41&hm=521eb6c153a40bf9be696fc93750e060f36f62df06cfe54ba0064b8bf7ffa8bd&" />
          </Tooltip>
          <Tooltip title="Duongdev">
            <Avatar
              alt="Duongdev"
              src="https://cdn.discordapp.com/attachments/1062032706977931387/1062039388378378318/stretched-1920-1080-1129512.jpg?ex=65e5f141&is=65d37c41&hm=521eb6c153a40bf9be696fc93750e060f36f62df06cfe54ba0064b8bf7ffa8bd&" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
