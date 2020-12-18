import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase';
import {Modal, makeStyles, Button, Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const classes = useStyles();
  const[modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([  ]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const unsuscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){

        console.log(authUser);

        setUser(authUser);
        
      }else{
        setUser(null);
      }
    })

    return ()=>{
      // perform some cleanup actions
      unsuscribe();
    }

  }  
  ,[user, username]);

  // useEffect only run in a specific condition

  useEffect(()=>{
    // this is where code runs

    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a document is added or modified it will run
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });

  }, []);

  const signUp = (event)=>{
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      });
    })
    .catch((err) => alert(err.message));

    setOpen(false);
  };

  const signIn = (event)=>{
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setOpenSignIn(false);
  };
  
  return (
    <div className="app">



      <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""  
              />
            </center>

              <Input 
                placeholder="username"
                type="text"
                value={username}
                onChange={(e)=>{setUsername(e.target.value)}}
              />

              <Input 
                placeholder="email"
                type="email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
              />

              <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
              />

              <Button
                onClick={signUp}
              >Sign up</Button>

          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""  
              />
            </center>

              <Input 
                placeholder="email"
                type="email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
              />

              <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
              />

              <Button
                onClick={signIn}
              >Sign in</Button>

          </form>
        </div>
      </Modal>
      
      {/* Header */}
 
      <div className="app__header">
        <img 
        className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""
        />

        {
          user ? (
            <Button className="app__buttonLogout" onClick={()=>{auth.signOut()}}>Logout</Button>
          ) :(
            <div className="app__loginContainer">
              <Button className="app__buttonSignup" onClick={()=>{ setOpen(true)}}>Sign Up</Button>
              <Button className="app__buttonSignin" onClick={()=>{ setOpenSignIn(true)}}>Sign In</Button>
            </div>
          )
        }

      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {/* Posts */}
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>

        <div className="app__postsRight">
          <InstagramEmbed 
            url="https://www.instagram.com/p/BqBbYlbncH2/"
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={()=>{}}
            onSuccess={()=>{}}
            onAfterRender={()=>{}}
            onFailure={()=>{}}
          />
        </div>

      </div>

      
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ):(
        <h3>Sorry you need to login to upload</h3>
      )}
      
    </div>
  );
}

export default App;
