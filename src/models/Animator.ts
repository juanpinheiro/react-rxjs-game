import { IVector2 } from 'shared/interfaces';

export class Animator {
    private spriteSize: IVector2;
    private direction: 'column' | 'row';
    private frames: IVector2[] = [];

    public file: string;
    public frame: IVector2 = { x: 0, y: 0 };
    public spritesLength: number;

    constructor(file: string, spritesLength: number, spriteSize: IVector2, direction: 'column' | 'row') {
        this.file = file;
        this.spritesLength = spritesLength;
        this.spriteSize = spriteSize;
        this.direction = direction;

        this.generateFrames();
    }

    private generateFrames = (): void => {
        let currentSize = 0;
        
        this.frames.push({ 
            x: 0,
            y: 0
        });

        for (let i = 0; i < this.spritesLength - 1; i++) {

            if (this.direction === 'row') {
                currentSize = this.spriteSize.x + currentSize;

                this.frames.push({ 
                    x: currentSize,
                    y: 0
                });
            }
            
            if(this.direction === 'column') {
                currentSize = this.spriteSize.y + currentSize;
                this.frames.push({ 
                    x: 0,
                    y: currentSize
                });
            }
        }
    }

    public nextFrame = () => {
        const frame = this.frames.shift();
        
        if (frame) {
            this.frames.push(frame);
        }

        this.frame = this.frames[0];
    }

}