import React, { useContext, useEffect, useState } from 'react'
import './chat.css'
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MicIcon from "@material-ui/icons/Mic";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { useParams } from 'react-router-dom';
import db from '../../firebase';
import { Context } from '../../Context';
import firebase from "firebase";

const Chat = () => {
	const { roomId } = useParams();
	const [roomName, setRoomName] = useState('');
	const [message, setMessage] = useState([]);
	const [user] = useContext(Context);
	const [type, setType] = useState('');
	const [checkId, setCheckId] = useState('');
	const [online, setOnline] = useState(false);
	useEffect(async () => {
		const a = await db.collection('login').get()
		a.docs.map(async (doc) => {
			if (doc.data().id === user.user.email) {
				await db.collection('login').doc(doc.id).update({
					doc: roomId
				})
			}
		})
	}, [roomId, user.user.email])
	useEffect(() => {
		const unsub = db.collection('rooms').doc(roomId).collection('message').orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
			setMessage(snapshot.docs.map((doc) => {
				return {
					id: doc.id,
					data: doc.data()
				}
			}))
		})
		return () => {
			unsub();
		}
	}, [roomId])
	useEffect(() => {
		db.collection('rooms').doc(roomId).onSnapshot(async (snapshot) => {
			setRoomName(await snapshot.data().name);
		})
	}, [roomId])

	useEffect(async () => {
		const arr = [];
		const b = await db.collection('rooms').doc(roomId).get()
		const a = await db.collection('rooms').doc(roomId).collection('message').get()
		await b.data().auth.map((id) => {
			if (user.user.email !== id) {
				arr.push(id);
			}
		})
		const unsub1 = db.collection('login').onSnapshot((snapshot) => {
			snapshot.docs.map((id) => {
				if (id.data().id === arr[0]) {
					a.docs.map(async (doc) => {
						const result = await db.collection('rooms').doc(roomId).collection('message').doc(doc.id).get()
						if (result.data().seen === 1) {
							await db.collection('rooms').doc(roomId).collection('message').doc(result.id).update({
								seen: 2
							})
						}
					})
				}
			})
		})
		const unsub2 = db.collection('login').onSnapshot((snapshot) => {
			snapshot.docs.map(async (id) => {
				if (id.data().id === arr[0] && id.data().doc === roomId) {
					a.docs.map(async (doc) => {
						const result = await db.collection('rooms').doc(roomId).collection('message').doc(doc.id).get()
						if (result.data().seen !== 3) {
							await db.collection('rooms').doc(roomId).collection('message').doc(doc.id).update({
								seen: 3
							})
						}
					})
				}
			})
		})
		return () => {
			arr = []
			unsub1();
			unsub2();
		}
	}, [message, roomId, user.user.email])

	const sendMessage = async (e) => {
		e.preventDefault();
		await db.collection('rooms').doc(roomId).collection('message').add({
			name: user.user.displayName,
			message: type,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			seen: 1
		})
		setType("");
	}
	const [flag, setFlag] = useState(false)
	useEffect(async () => {
		const a = await db.collection('rooms').doc(roomId).get()
		a.data().auth.map((id) => {
			user.user.email === id ? setFlag(true) : console.log('bye2')
		})
		a.data().auth.map((id) => {
			user.user.email !== id ? setCheckId(id) : console.log('bye3')
		})
	}, [roomId, user.user.email])
	useEffect(() => {
		const unsub = db.collection('login').onSnapshot((snapshot) => {
			setOnline(false);
			snapshot.docs.map((doc) => {
				if (doc.data().id === checkId) {
					setOnline(true);
				}
				return null;
			})
		})
		return () => {
			unsub();
		}
	}, [roomId, checkId])
	return flag ? (
		<div className="chat">
			<div className="chat__header">
				<Avatar src={`https://avatars.dicebear.com/api/human/${roomId}.svg`} />
				<div className="chat__headerinfo">
					<h3>{roomName}</h3>
					<p>{online ? "online" : "offline"}</p>
				</div>
				<div className="chat__headerRight">
					<IconButton>
						<SearchOutlined />
					</IconButton>
					<IconButton>
						<AttachFileIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</div>
			</div>

			<div className="chat__body">
				{
					message.map((mes) => (
						user.user.displayName !== mes.data.name ? (<p key={mes.id} className="chat__message">
							<span className="chat__name">{mes.data.name}</span>
							{mes.data.message}
							<span className="chat__timestamp">
								{new Date(mes.data.timestamp?.toDate()).toLocaleString("hi-IN")}
							</span>
						</p>) : (
							<p key={mes.id} className="chat__message chat__reciever">
								<span className="chat__name">{mes.data.name}</span>
								{mes.data.message}
								<span className="chat__timestamp">
									{new Date(mes.data.timestamp?.toDate()).toUTCString()}
								</span>
								<span>
									{mes.data.seen === 1 ? (<svg viewBox="0 0 16 15" width="16" height="15" class=""><path fill="currentColor" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>) : null}
									{mes.data.seen === 2 ? (<svg viewBox="0 0 16 15" width="16" height="15" class=""><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>) : null}
									{mes.data.seen === 3 ? (<svg viewBox="0 0 16 15" width="16" height="15" class="blue__tick"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>) : null}
								</span>

							</p>
						)
					))
				}
			</div>

			<div className="chat__footer">
				<IconButton >
					{/* onClick={openEmoji} */}
					<InsertEmoticonIcon />
				</IconButton>.
				<form>
					<input value={type} type="text" placeholder="type mssg here" onChange={(e) => (setType(e.target.value))}></input>
					<button type="submit" onClick={sendMessage}></button>
				</form>
				<IconButton>
					<MicIcon />
				</IconButton>

			</div>

		</div>
	) : null;
}

export default Chat;