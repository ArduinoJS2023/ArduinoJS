import { useEffect, useState } from 'react';
import Navbar from './navbar';

const Nav = () => {
    const [session, setSession] = useState(undefined);

    const onGetServerSession = async () => {
        // const currentSession = await getServerSession(); //TODO: handle github session
        setSession();
    }

    useEffect(() => { onGetServerSession() }, []);

    return <Navbar user={session?.user} />;
}

export default Nav;