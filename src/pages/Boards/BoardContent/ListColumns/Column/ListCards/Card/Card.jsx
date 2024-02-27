import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

function Card({ temporaryHideMedia }) {
  if (temporaryHideMedia) {
    return (
      <MuiCard sx={{
        cursor:'pointer',
        boxShadow:'0 1px 1px rgba(0,0,0,0.2)',
        overflow:'unset'
      }}>
        <CardContent sx={{ p:1.5, '&:last-child':{ p:1.5 } }}>
          <Typography >Card Test 01</Typography>
        </CardContent>
      </MuiCard>
    )
  }

  return (
    <MuiCard sx={{
      cursor:'pointer',
      boxShadow:'0 1px 1px rgba(0,0,0,0.2)',
      overflow:'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image='https://cdn.discordapp.com/attachments/1062032706977931387/1062039388378378318/stretched-1920-1080-1129512.jpg?ex=65e5f141&is=65d37c41&hm=521eb6c153a40bf9be696fc93750e060f36f62df06cfe54ba0064b8bf7ffa8bd&'
        title="green iguana"
      />
      <CardContent sx={{ p:1.5, '&:last-child':{ p:1.5 } }}>
        <Typography >Duong MERNSTACK</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button size="small" startIcon={<GroupIcon/>}>20</Button>
        <Button size="small" startIcon={<CommentIcon/>}>15</Button>
        <Button size="small" startIcon={<AttachmentIcon/>}>10</Button>

      </CardActions>
    </MuiCard>
  )
}

export default Card
