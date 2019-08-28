import React from 'react';
import { TileStatic } from 'components/WorldMap/TileStatic';
import mapService from 'services/mapService';

interface IProps { }
interface IState {
    tileset: any;
}

class WorldMap extends React.Component<IProps, IState> {
    state = {
        tileset: []
    }

    componentDidMount() {
        this.setState({ tileset: mapService.tileset });
    }

    render() {
        const { tileset } = this.state;

        if (!tileset) {
            return;
        }

        return (
            <>
                { tileset.map((tile: any, key) => (
                    <TileStatic key={key} tile={tile}  />
                ))}
            </>
        );
    }
}

export default WorldMap;