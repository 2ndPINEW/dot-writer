import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { Array2 } from 'src/app/shared/service/util-types.interface';

@Component({
  selector: 'app-dot-editor',
  templateUrl: './dot-editor.component.html',
  styleUrls: ['./dot-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ColorPickerModule,
    FormsModule
  ]
})
export class DotEditorComponent implements OnInit{

  constructor() { }

  // private frames: string[][][] = []
  private pixelColors: string[][] = []

  // private frame = 0

  /** ピクセル数, [縦, 横] */
  private pixels: Array2<number> = [14, 16]

  picked: string = '#ffffff'
  picker1: string = '#ffffff'
  picker2: string = '#ffffff'
  picker3: string = '#ffffff'
  picker4: string = '#ffffff'
  picker5: string = '#ffffff'
  picker6: string = '#ffffff'
  picker7: string = '#ffffff'
  picker8: string = '#ffffff'

  isMouseDown: boolean = false

  @HostListener('mousedown', ['$event'])
  onMouseDown (e: Event): void {
    this.isMouseDown = true
  }
  @HostListener('mouseup', ['$event'])
  onMouseUp (e: Event): void {
    this.isMouseDown = false
  }

  ngOnInit(): void {
    this.initPixelColors()
  }

  initPixelColors (): void {
    this.pixelColors = []
    const columns = this.columns.map(() => '#FFFFFF')
    this.rows.forEach(() => {
      this.pixelColors.push([...columns])
    })
  }

  onColorChange (color: string): void {
    this.picked = color
  }

  onClickPixel (row: number, column: number): void {
    this.pixelColors[row][column] = this.picked
  }

  onMouseEnterPixel (row: number, column: number): void {
    if (this.isMouseDown) {
      this.pixelColors[row][column] = this.picked
    }
  }

  onMouseLeaveArea (): void {
    this.isMouseDown = false
  }

  get rows (): Array<number> {
    return [...Array(this.pixels[0])].map((_, i) => (i))
  }
  get columns (): Array<number> {
    return [...Array(this.pixels[1])].map((_, i) => (i))
  }

  color (row: number, column: number): string {
    return this.pixelColors[row][column]
  }

  get colorArray(): string {
    const pixels = this.pixelArrayString
    const colors: string[] = []
    let newPixel: number[] = []
    pixels.split(',').forEach(pixel => {
      const i = colors.findIndex(color => color === pixel)
      if(i < 0) {
        colors.push(pixel)
        newPixel.push(colors.length - 1)
      } else {
        newPixel.push(i)
      }
    })
    return `"${colors}",\n"${newPixel.join(',')}"`
  }

  set pixelArrayString(v: string) {
    const values = v.split(',')
    console.log(values)
    this.pixelColors.forEach((rows, r) => {
      rows.forEach((col, c) => {
        const poped = values.shift()
        if (poped) {
          this.pixelColors[r][c] = `#${poped}`
        }
      })
    })
    console.log(this.pixelColors)
  }

  get pixelArrayString (): string {
    return this.pixelColors.flat().map(v => v?.replace('#', '').toLocaleUpperCase()).join(',')
  }
}
