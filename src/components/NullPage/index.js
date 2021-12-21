import React, { useContext, useEffect } from 'react'
import { Context } from '../../Context';
import db from '../../firebase';

const NullPage = () => {
    const [user] = useContext(Context);
    useEffect(async () => {
        const a = await db.collection('login').get()
        a.docs.map(async (doc) => {
            if (doc.data().id === user.user.email) {
                await db.collection('login').doc(doc.id).update({
                    doc: ""
                })
            }
        })
    }, [user.user.email])

    return (
        <div></div>
    );
}

export default NullPage;

