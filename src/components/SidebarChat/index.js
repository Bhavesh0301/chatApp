import React, { useContext, useEffect, useState } from 'react'
import { Avatar } from "@material-ui/core";

import './Sidebarchat.css'
import db from '../../firebase';
import { Link } from 'react-router-dom';
import { Context } from '../../Context';

const Sidebarchat = ({ prop, name, id }) => {
	const [user] = useContext(Context)
	const createChat = async () => {
		const RoomName = prompt('name');
		const email = prompt('email');
		await db.collection('rooms').add({
			name: RoomName,
			auth: [email, user.user.email]
		})
	};
	const [message, setMessage] = useState([]);
	useEffect(() => {
		db.collection('rooms').doc(id).collection('message').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
			setMessage(snapshot.docs.map((doc) => {
				return doc.data().message
			}))
		})
	}, [id])
	return !prop ? (
		<Link to={`rooms/${id}`}>
			<div className="sidebarChat">
				<Avatar src={`https://avatars.dicebear.com/api/human/${id}.svg`}></Avatar>
				<div className="sidebarChat__info">
					<h2>{name}</h2>
					<p>{message[0]}</p>
				</div>
			</div>
		</Link>
	) : (
		<div onClick={createChat} className="sidebarChat">
			<h2>{prop}</h2>
		</div>
	);
}

export default Sidebarchat;