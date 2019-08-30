import React from 'react';
import Player from 'components/Player';
import WorldMap from 'components/WorldMap';

export const Root = () => {
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            minWidth: 320,
            minHeight: 320,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
        }}>
            <div style={{
                width: 320,
                height: 320,
                position: 'relative'
            }}>
                <Player />
                <WorldMap />
            </div>
        </div>
    );
}