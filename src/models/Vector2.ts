export default class Vector2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    up = () => this.y--;
    down = () => this.y++;
    left = () => this.x--;
    right = () => this.x++;
    
    increment = (vector: Vector2): Vector2 => {
        this.x += vector.x;
        this.y += vector.y;
        
        return new Vector2(this.x, this.y);
    }

    decrement = (vector: Vector2): Vector2 => {
        this.x -= vector.x;
        this.y -= vector.y;
        
        return new Vector2(this.x, this.y);
    }

    multiply = (vector: Vector2): Vector2 => {
        this.x *= vector.x;
        this.y *= vector.y;
        
        return new Vector2(this.x, this.y);
    }

    scale = (scale: number): Vector2 => {
        this.x *= scale;
        this.y *= scale;
        
        return new Vector2(this.x, this.y);
    }

    copy = (): Vector2 => {
        return new Vector2(this.x, this.y);
    }
}