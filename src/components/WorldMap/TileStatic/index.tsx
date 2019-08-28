import React from 'react';

interface IProps {
    tile: any;
}

export const TileStatic = (props: IProps) => {
    const { tile } = props;

    return (
        <>
        <div
            style={{
                position: 'absolute',
                left: `${tile.x}px`,
                top: `${tile.y}px`,
                width: 16,
                height: 16,
                fontSize: 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <span>{ tile.id }</span>
        </div>
        </>
    );
}
