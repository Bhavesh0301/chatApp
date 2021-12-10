import React, { useState } from 'react'

export const Context = React.createContext();

const UserProvider = ({ children }) => {
    const [State, setState] = useState(null);
    return (
        <Context.Provider value={[State, setState]}>{children}</Context.Provider>
    )
}

export default UserProvider