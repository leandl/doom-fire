import { FIRE_COLORS_PALETTE } from "./FireColorsPalette";


type TypeWind = "NO-WIND" | "LEFT-WIND" | "RIGHT-WIND";
type DoomFireOptions = {
  modeDebug?: boolean;
  typeWind?: TypeWind;
}

export class DoomFire {
  private fireDataStructure: number[];
  private sourceIntensityMax = 36;

  private modeDebug: boolean;
  private fireSourceIntensity = 36;
  private fireColorsPalette = FIRE_COLORS_PALETTE["FIRE-RED"];
  private typeWind: TypeWind;

  constructor(
    private $divDoomFire: Element,
    private fireWidth: number,
    private fireHeight: number,
    options?: DoomFireOptions
  ){
    this.modeDebug = options?.modeDebug || false;
    this.typeWind = options?.typeWind || "NO-WIND";
    
    this.fireDataStructure = this.createFireDataStructure();
    this.createFireSource();
  }

  private createFireDataStructure(): number[] {
    return Array(this.fireWidth * this.fireHeight).fill(0);
  }

  private createFireSource() {
    for (let column = 0; column <= this.fireWidth; column++) {
      const overflowPixelIndex = this.fireWidth * this.fireHeight;
      const pixelIndex = (overflowPixelIndex - this.fireWidth) + column;

      this.fireDataStructure[pixelIndex] = this.fireSourceIntensity;
    }
  }

  private calculateFirePropagation(){
    for (let column = 0; column < this.fireWidth; column++) {
      for (let row = 0; row < this.fireHeight; row++) {
        const pixelIndex = column + (this.fireWidth * row);
        this.updateFireIntesityPerPixel(pixelIndex);
      }
    }
  }

  private updateFireIntesityPerPixel(currentPixelIndex: number) {
    const sizeFireDataStructure = this.fireHeight * this.fireWidth;
    const belowPixelIndex = currentPixelIndex + this.fireWidth;

    if (belowPixelIndex >= sizeFireDataStructure) {
      return;
    }

    const decay = Math.floor(Math.random() * 3);
    const belowPixelFireIntensity = this.fireDataStructure[belowPixelIndex];
    const newFireIntensity = belowPixelFireIntensity - decay;
    const windDirection = this.getWindDirection(currentPixelIndex, decay);

    this.fireDataStructure[windDirection] = Math.max(newFireIntensity, 0);
  }

  private getWindDirection(currentPixelIndex: number, decay: number): number {
    if (this.typeWind === "LEFT-WIND") {
      return currentPixelIndex + decay;
    }

    if (this.typeWind === "RIGHT-WIND") {
      return currentPixelIndex - decay;
    }

    return currentPixelIndex;
  }


  private renderFire() {
    let html = '<table cellpadding=0 cellspacing=0>';
    
    for (let row = 0; row < this.fireHeight; row++) {
      html += '<tr>';
  
      for (let column = 0; column < this.fireWidth; column++) {
        const pixelIndex = (row * this.fireWidth) + column;
        const fireIntensity = this.fireDataStructure[pixelIndex];

        const color = this.fireColorsPalette[fireIntensity];
        const colorString = `${color.r},${color.g},${color.b}`;
  
        if (this.modeDebug) {
          html += `<td style="color: rgb(${colorString})">`;
          html += `<span class="pixel-index">${pixelIndex}</span>`;
          html += fireIntensity;
          html += '</td>';
        } else {
          

          html += `<td class="pixel" style="background-color: rgb(${colorString})">`;
          html += '</td>';
        }
        
      }
  
      html += '</tr>';
  
      this.$divDoomFire.innerHTML = html;
    }
  
    html += '</table>';
  }

  private update() {
    this.renderFire();
    this.calculateFirePropagation()
  }

  public start() {
    this.update()
  }

  private setSizeFireDataStructure(fireWidth: number, fireHeight: number) {
    this.fireWidth = fireWidth;
    this.fireHeight = fireHeight;

    this.fireDataStructure = this.createFireDataStructure();
    this.createFireSource();
  }

  public setHeight(fireHeight: number) {
    this.setSizeFireDataStructure(this.fireWidth, fireHeight);
  }

  public setWidth(fireWidth: number) {
    this.setSizeFireDataStructure(fireWidth, this.fireHeight);
  }

  public setTypeWind(typeWind: TypeWind) {
    this.typeWind = typeWind;
  }
}