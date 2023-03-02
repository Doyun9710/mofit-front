import Head from 'next/head'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'
import styled from 'styled-components';

const DynamicComponentWithNoSSR = dynamic(
    () => import('../components/MultiGame/Index'),
    { ssr: false }
)

const Home = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
    }, []);

    return (

        <div id="multigame">
            <Head>
                <title>Phaser Starter</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div key={Math.random()} id="game"></div>
            {loading ? <DynamicComponentWithNoSSR styled="width:100%" /> : null}

        </div>

    );
};

export default Home;
