export interface IMapState {
    width: number;
    height: number;
    tileHeight: number;
    tileWidth: number;
    layers: ILayer[];
}

export interface ILayer {
    data: number[];
    width: number;
    height: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    x: number;
    y: number;
}