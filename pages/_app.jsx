// These styles apply to every route in the application
import { Suspense, useEffect } from 'react'
import '../styles/globals.css'
import Head from 'next/head'
import Nav from '../components/Nav'

export default function App({ Component, pageProps }) {
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault(); // Prevent the default context menu
        };
        // Attach the event listener to the document
        document.addEventListener('contextmenu', handleContextMenu);
        // Cleanup: Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);
    return <>
        <Head>
            <title>ArduinoJS</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="description" content="Generated by create ArduinoJS" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <Suspense>
            <Nav />
        </Suspense>
        <Component {...pageProps} />
    </>
}