import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector} from 'react-redux';
import axios from 'axios';
import config from '../config.json';

export default function AssigneeDropdown({assignee, setAssignee}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const selectorData = useSelector(state => state.data);
  const [userData, setUserData] = useState(selectorData);
  const loading = open && options.length === 0;

  const handleAddAssignee = (item)=>{
    if(item === null) return;
    let newList = assignee.filter((newAssignee)=> {return newAssignee.reg_no !== item.reg_no});
    if(newList.length>=3){
      newList.pop();
    }

    newList.unshift(item);
    setAssignee(newList);
  }

  React.useEffect(() => {

    if (!loading) {
      return undefined;
    }

    (async () => {
    axios.get(`${config['path']}/user/patient/reviewer/all`,
    { headers: {
      'Authorization': `Bearer ${userData.accessToken.token}`,
      'email': JSON.parse(sessionStorage.getItem("info")).email,
    }}
    ).then(resp =>{
        setOptions(resp.data);
    }).catch(function (error) {
        if(error.response){
            alert(error.response.data.message)
        }else{
            alert(error)
        }
    });
    })();

  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      size='small'
      fullWidth
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.username === value.username}
      getOptionLabel={(option) => option.username}
      options={options}
      loading={loading}
      onChange={(e, value)=>handleAddAssignee(value)}
      renderInput={(params) => (
        <TextField
          size='small'
          {...params}
          name='assignee'
          label="Assign Reviewers"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

