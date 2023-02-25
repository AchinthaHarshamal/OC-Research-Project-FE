import { FilterList, Photo, Comment, MoreVert } from '@mui/icons-material';
import { Avatar, AvatarGroup, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';

const filtOptions = ["All","New","Updated","Assigned","Unassigned"]
const entry = [{
    "patient": {
        "name":"patient name",
        "patient_id":"patient_id"
    },
    "assignees": [{"name":"P Silva", "availability":false},{"name":"M Perera", "availability":true}],
    "images":["1","2","3"],
    "Complaint":"",
    "startTime":"",
    "endTime":"",
    "findings":"findings findings findings new findings are shown here findings findings findings new findings are shown here findings findings findings new findings are shown here findings findings findings new findings are shown here",
    "currentHabits":"",
    "reports":"",
    "reviews": ["1","2","3","4","5"],
    "createdAt": "2023-05-06 5.00 am",
    "updatedAt": "2023-05-10 10.14 pm"

},{
    "patient": {
        "name":"patient name",
        "patient_id":"patient_id"
    },
    "assignees": [{"name":"M Perera", "availability":true}],
    "images":["1"],
    "Complaint":"",
    "startTime":"",
    "endTime":"",
    "findings":"findings findings findings new findings are shown here findings findings findings new findings are shown here findings findings findings new findings are shown here findings findings findings new findings are shown here",
    "currentHabits":"",
    "reports":"",
    "reviews": [],
    "createdAt": "2023-05-06 5.00 am",
    "updatedAt": "2023-05-10 10.14 pm"

}]

const IconInfo = (props)=>{
    return(
        <div style={{display: 'flex', alignItems:'center', 
        gap:3, marginTop:3}}>
            {props.children}
        </div>
    )
}

const Entries = ({setDetails}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [value, setValue] = React.useState("All");
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilter = (name)=>{
        setValue(name);
        handleClose();
    }

    const handleSelect = (entry)=>{
        setDetails(entry);
    }

    return (
        <div>
            <Stack direction='row' alignItems='center' spacing={1}>
                <IconButton
                    id="fade-button"
                    aria-controls={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                ><FilterList/></IconButton>

                <Typography color='GrayText'>{value}</Typography>
            </Stack>

            <Menu id="fade-menu" MenuListProps={{ 'aria-labelledby': 'fade-button'}} anchorEl={anchorEl} open={open} onClose={handleClose}>
                {filtOptions.map((item,index)=>{ return(<MenuItem key={index} onClick={()=>handleFilter(item)}>{item}</MenuItem>)})}
            </Menu>

            <Stack direction='column' spacing={2} sx={{my:3}}>
            {
                [...Array.from({ length: 4 }, () => entry).flat()].map((entry, index)=>{
                    return(
                    <Paper key={index} sx={{p:1, cursor:'pointer', background: '#fbfbfb', '&:hover':{background: '#f0f0f0'}}} onClick={()=>handleSelect(entry)}>
                        <Typography><strong>{entry.createdAt}</strong></Typography>
                        <Typography>{entry.patient.name} [{entry.patient.patient_id}]</Typography>
                        <Typography color='GrayText' fontSize='small'
                            sx={{
                                display: '-webkit-box',
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 1,
                            }}
                        >
                            {entry.findings}</Typography>
                        <Stack direction='row' spacing={2} sx={{my:1}}>
                            <IconInfo><Photo fontSize='small' color={entry.images.length>0?'info':'action'}/>{entry.images.length}</IconInfo>
                            <IconInfo><Comment fontSize='small' color={entry.reviews.length>0?'success':'warning'}/>{entry.reviews.length}</IconInfo>
                            <IconInfo><Typography color='GrayText' fontSize='small'>Update: {entry.updatedAt}</Typography></IconInfo>
                            <Stack flex={1} justifyContent='flex-end' direction='row'>
                                <AvatarGroup>
                                    {
                                        entry.assignees.map((reviewer, index)=>{
                                            return(<Avatar key={index} alt={reviewer.name} sx={{height:'25px', width:'25px'}} src="/"></Avatar>)
                                        })
                                    }
                                </AvatarGroup>
                            </Stack>
                        </Stack>                        
                    </Paper>
                    )
                })
            }
            </Stack>
           
        </div>
    );
};

export default Entries;