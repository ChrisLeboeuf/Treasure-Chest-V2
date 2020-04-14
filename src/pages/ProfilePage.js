import * as React from 'react'
import Button from 'react-bootstrap/Button';
import ImagePicker from '../components/ImagePicker';
import axios from 'axios'
import {useLocation} from 'react-router-dom'

function ProfilePage({ title }) {
    let location = useLocation();
    title("Profile");
    console.log(window.$user);
    const [userName, setUserName] = React.useState(window.$user.name);
    const [description, setDescription] = React.useState('');
    const [image, setImage] = React.useState(window.$user.icon);
    const [edit, setEdit] = React.useState(false);
    const [sellList, setSellList] = React.useState([]);
    const [soldList, setSoldList] = React.useState([]);
    const [favList, setFavList] = React.useState([]);
    const [show, setShow] = React.useState(0)
 
    let url = 'localhost'; 
   
    const getProfile = async (id) => {
     await axios.get(`http://${url}:8080/user/id/${id}`)
       .then(post => {
         // console.log(post);
         setUserName(post.data.name)
         setDescription(post.data.bio)
         setImage(post.data.icon)
       })
       .catch(e => console.error(e));
   }
   const patchProfile = async (id, name, bio, icon) => {
    let post = await axios.post(`http://${url}:8080/user/update/${id}`, { name, bio, icon, id})
    setUserName(post.data.name)
    setDescription(post.data.bio)
    setImage(post.data.icon)
   }
 
   const getSellListings = async (id) => {
     await axios.get(`http://${url}:8080/listing/user/${id}/0`)
       .then(post => setSellList(post.data))
       .catch(e => console.error(e));
    }
 
    const getSoldListings = async (id) => {
     await axios.get(`http://${url}:8080/listing/user/${id}/1`)
       .then(post => setSoldList(post.data))
       .catch(e => console.error(e));
    }
 
    const getFavListings = async (id) => {
     await axios.get(`http://${url}:8080/favorite/${id}`)
       .then(post => {
         console.log(post.data)
         setFavList(post.data)
       })
       .catch(e => console.error(e));
    }
 
   const chooseImage = (img) => {
     setImage('' + img);
     console.log(`This is chosen: ${img}`);
   };
 
   let idUser = location.state === undefined ? window.$user.id : location.state.id;
   React.useEffect(() =>{
     getProfile(idUser)
     getSellListings(idUser)
     getSoldListings(idUser)
     getFavListings(idUser)
   }, [])
 
    return (
        <div>
           <div style={{flexDirection: 'row'}}>
        <img alt=""
          style={{ margin: 30, height: 150, width: 150, borderRadius: 75, resizeMode: "contain" }}
          src={ image }
        />
        <div>
          {edit ? <ImagePicker chooseImage={chooseImage}/> : null}
          <h4 style={{marginVertical: 25 ,fontSize: 24}} >{userName}</h4>
          { edit ? <input
            type="text"
            value={userName}
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChange={(e) => setUserName(e.target.value)}
            placeholder='Input User Name...'
          /> : null}
          {location.state ? 
            <Button style={{width: 125,
              height: 35,
              borderRadius: 5,
              backgroundColor: '#3FC184',
              marginRight: 15,}} 
              onClick={() => alert('Todo') /*to={{ pathname: '/chat', state: { id_recipient: location.state.id },}}*/} >
                Message
                </Button>
              : 
            <Button style={{width: 125,
              height: 35,
              borderRadius: 5,
              backgroundColor: '#3FC184',
              marginRight: 15,}} 
              onClick={() => setEdit(!edit)}>
                Edit Profile
            </Button> }
        </div>
      </div>
      <div style={{marginHorizontal: 30}}>
          <p style={{fontSize: 18}}>{description || 'no bio'}</p>
          { edit ? <textarea
            value={description}
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Input Description...'
          /> : null}          
          {edit ? <Button onClick={() => { 
            patchProfile(idUser, userName, description, image);
            setEdit(false);
          }}>
            Update Profile
          </Button> : null}
      </div> 
        </div>
    )
}

export default ProfilePage
