import Store from 'services/store';
import { IMapState } from 'shared/interfaces/mapInterface';

import map from 'assets/Map/map.json';

const INITIAL_STATE: any = {
}

class MapService extends Store<any> implements IMapState {
    public width = map.width;
    public height = map.height;
    public tileWidth = map.tilewidth;
    public tileHeight = map.tileheight;
    public layers = map.layers;

    public tileset = [];

    constructor() {
        super(INITIAL_STATE);

        this.generateTileset();
    }

    generateTileset = () => {
        let rows = 0;
        let columns = 0;
        let id = 0;

        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                this.tileset.push({
                    id,
                    x: rows * map.tilewidth,
                    y: columns * map.tileheight
                });
                rows++;
                id++;
            }
            columns++;
            rows = 0;
        }
    }


    
}

const mapService = new MapService();
export default mapService;