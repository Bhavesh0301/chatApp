import React, { useContext } from "react";
import './Login.css'
import { Button } from "@material-ui/core";
import db, { auth, provider } from "../../firebase";
import { Context } from "../../Context";

const Login = () => {
	const [_user, setUser] = useContext(Context);
	const signIn = () => {
		auth.signInWithPopup(provider)
			.then((result) => {

				db.collection('login').add({
					id: result.user.email
				})
				setUser(result)
			})
			.catch((e) => {
				alert(e.message)
				console.log(e);
			})
	}
	return (
		<div className="login">
			<div className="login__container">
				<img
					src="http://pngimg.com/uploads/whatsapp/whatsapp_PNG95169.png"
					alt=""
				/>
				<div className="login__text">
					<h1>Sign in to Chat App</h1>
				</div>
				<Button type="submit" onClick={signIn}>
					Sign in with Google
				</Button>
			</div>
		</div>
	)
}

export default Login;