import React, { useContext, useEffect, useState } from 'react'
import './Sidebar.css'
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import Sidebarchat from '../SidebarChat';
import db from '../../firebase';
import { Context } from '../../Context';

const Sidebar = () => {
	const [user] = useContext(Context)
	const [Rooms, setRooms] = useState([]);
	useEffect(() => {
		db.collection('rooms').onSnapshot((snapshot) => {
			setRooms(
				snapshot.docs.map((docs) => {
					let flag = false
					docs.data().auth.map((id) => {
						user.user.email === id ? flag = true : console.log('bye')
					})
					return flag ? ({
						id: docs.id,
						data: docs.data(),
					}) : null
				}))
		})
	}, [user.user.email])
	return (
		<div className="sidebar">
			<div className="sidebar__header">
				<Avatar src={user.user.photoURL}></Avatar>
				<div className="sidebar__headerRight">
					<IconButton>
						<DonutLargeIcon />
					</IconButton>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</div>
			</div>
			<div className="sidebar__search">
				<div className="sidebar__container">
					<SearchOutlined />
					<input placeholder="Search or start new chat" type="text"></input>
				</div>
			</div>
			<div className="sidebar__chats">
				<Sidebarchat prop="Add New Chat"></Sidebarchat>
				{
					Rooms.map((room) => {
						return room !== null ? (
							<Sidebarchat key={room.id} id={room.id} name={room.data.name}></Sidebarchat>
						) : null
					})
				}
			</div>
		</div>
	)
}

export default Sidebar;