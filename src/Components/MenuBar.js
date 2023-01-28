import React, {useState, useEffect} from 'react';
import{ AppBar, Menu,Container,Avatar,MenuItem, Divider} from '@mui/material';
import{ Box,Toolbar,IconButton,Typography, Button} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import config from '../config.json';
import { useSelector, useDispatch } from 'react-redux';
import { trySilentRefresh } from '../utils/authUtils';
import {setAccessToken } from '../Reducers/userDataSlice';
import { AccountBox, LogoutOutlined} from '@mui/icons-material';

function stringToColor(string) {
  let i, hash = 0;
  let color = '#';

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}


function stringAvatar(name) {
  return {
  sx: {bgcolor: stringToColor(name), width: 32, height: 32},
  children: `${name.split(' ')[0][0]}`,
  };
}

const displayRole = (role)=>{
    let roleName = "";
    switch(role[0]){
      case 1:
        roleName = "Admin"
        break;
      case 2:
        roleName = "Reviewer"
        break;
      case 3:
        roleName = "Clinician"
        break;
      default:
        roleName = ""
    }

    return <Typography fontSize='small' color='GrayText'>{roleName}</Typography>;
}

function MenuBar({roles,username}) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const open = Boolean(anchorElUser);
  const open2 = Boolean(anchorElNav);

  const userData = useSelector(state => state.userData.data);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const timeout = 1000 * 60 * 15;
  
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const GoToProfile = ()=>{
    navigate('/profile');
  }

  const Logout = ()=>{
    
    axios.post(`${config['path']}/auth/revokeToken`, {},
    { headers: {
      'Authorization': `Bearer ${userData.accessToken.token}`,
      'email': userData.email,
  },
      withCredentials: true}
    )
    .then(()=>{
      sessionStorage.removeItem("info")
      navigate("/login");
    });
  }
  useEffect(() => {
		// Silence refresh.
		setInterval(async () => {
			const res = await trySilentRefresh().then((data) => {
				if (data) {
					dispatch(setAccessToken(data.accessToken));
					return true;
				}
				return false;
			});

			if (!res) {
				localStorage.setItem('loggedOut', 'Your session has been expired! Please log in again.');
				Logout();
			}
		}, timeout);
	}, []);

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl" >
        <Toolbar disableGutters>
            <Typography variant="h5" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
                <img src={logo} alt="logo" style={{width: '100%', height : "30px"}} />
            </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={handleOpenNavMenu} size="large" aria-controls={open2 ? 'nav-menu' : undefined} aria-haspopup="true" aria-expanded={open2 ? 'true' : undefined} color="inherit">
                <MenuIcon />
            </IconButton>
          </Box>
        
          <Menu
            anchorEl={anchorElNav}
            id="nav-menu"
            open={open2}
            onClose={handleCloseNavMenu}
            onClick={handleCloseNavMenu}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  left: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
                <MenuItem>
                  <Typography textAlign="center"><Link to="/upload" replace>Upload</Link></Typography>
                </MenuItem>
                <MenuItem>
                  <Typography textAlign="center"><Link to="/images" replace>Images</Link></Typography>
                </MenuItem>
                <MenuItem>
                  <Typography textAlign="center"><Link to="/patients" replace>Patients</Link></Typography>
                </MenuItem>
                {roles.includes(1) && 
                <MenuItem>
                  <Typography textAlign="center"><Link to="/adminportal" replace>Admin Portal</Link></Typography>
                </MenuItem>}
                              
          </Menu>
         
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex'}}}>
                <Button sx={{ my: 2, color: 'white', display: 'block', m:0}}>
                    <Link to="/manage/images">Manage</Link>
                </Button>
                { roles.includes(1) &&
                  <Button sx={{ my: 2, color: 'white', display: 'block', m:0}} variant='outlined' color='secondary'>
                    <Link to="/adminportal/requests">Admin Portal</Link>
                </Button>}
            </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          
          <Button
            onClick={handleOpenUserMenu}
            size="small"
            sx={{ m:0, ml: 2, borderRadius: 5, p:0}}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            color="inherit"
          >
            <Typography sx={{ m: 1, textTransform: 'none'}}>{username}</Typography>
            <Avatar {...stringAvatar(username)}/>
          </Button>
      </Box>
      <Menu
        anchorEl={anchorElUser}
        id="account-menu"
        open={open}
        onClose={handleCloseUserMenu}
        onClick={handleCloseUserMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
 
        <Box sx={{mx:3, my:2}}>
          <Typography>{username}</Typography>
          {displayRole(roles)}
          <Divider/>
        </Box>
        <MenuItem sx={{width:'200px'}}>
          <Button onClick={GoToProfile} color='inherit' startIcon={<AccountBox/>}>Profile</Button>
        </MenuItem>
        <MenuItem sx={{width:'200px'}}>
          <Button onClick={Logout} color='inherit' startIcon={<LogoutOutlined/>}>Logout</Button>
        </MenuItem>
      </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default MenuBar;