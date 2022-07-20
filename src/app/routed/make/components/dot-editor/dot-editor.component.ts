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

  /** 各フレームごとのピクセルの状態 */
  frames: string[][][] = []

  /** 選択中のフレームのインデックス */
  frame = 0

  /** ピクセル数, [縦, 横] */
  private pixels: Array2<number> = [14, 16]

  /** 選択中の色 */
  picked: string = '#ffffff'
  // なんか配列にしたらエラー出るからいっぱい変数作った
  picker1: string = '#ffffff'
  picker2: string = '#ffffff'
  picker3: string = '#ffffff'
  picker4: string = '#ffffff'
  picker5: string = '#ffffff'
  picker6: string = '#ffffff'
  picker7: string = '#ffffff'
  picker8: string = '#ffffff'

  /** マウスがクリックされた状態かどうか */
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

  /** フレームの状態を初期化する */
  initPixelColors (): void {
    this.frames = []
    this.frames[0] = this.generateBlankPixels()
  }

  /** 初期状態の1フレームを作る */
  generateBlankPixels (): string[][] {
    const pixels: string[][] = []
    const columns = this.columns.map(() => '#FFFFFF')
    this.rows.forEach(() => {
      pixels.push([...columns])
    })
    return pixels
  }

  /** カラーピッカーで色を変えた時 */
  onColorChange (color: string): void {
    this.picked = color
  }

  /** ピクセルをクリックしたときに選択中のフレームのピクセルに選択中の色を入れる */
  onClickPixel (row: number, column: number): void {
    this.frames[this.frame][row][column] = this.picked
  }

  /** マウスカーソルがピクセルの領域に入った時にマウスがクリック中ならぬる */
  onMouseEnterPixel (row: number, column: number): void {
    if (this.isMouseDown) {
      this.frames[this.frame][row][column] = this.picked
    }
  }

  /** マウスがエリアから出たときにマウスダウンフラグを下げる */
  onMouseLeaveArea (): void {
    this.isMouseDown = false
  }

  /**
   * 選択中のフレームを変える
   * prev: 前のフレーム
   * next: 次のフレーム, なければ追加
   * next-middle: 選択中のフレームと次のフレームの間にフレームを追加
   */
  changeFrame (direction: 'prev' | 'next' | 'next-middle'): void {
    if (direction === 'prev' && this.frame > 0) {
      this.frame--
    }
    if (direction === 'next') {
      if (this.frame + 1 >= this.frames.length) {
        this.frames.push(this.generateBlankPixels())
      }
      this.frame++
    }
    if (direction === 'next-middle' && this.frame + 1 < this.frames.length) {
      this.frames.splice(this.frame + 1, 0, this.generateBlankPixels())
      this.frame++
    }
  }

  get rows (): Array<number> {
    return [...Array(this.pixels[0])].map((_, i) => (i))
  }
  get columns (): Array<number> {
    return [...Array(this.pixels[1])].map((_, i) => (i))
  }

  /** ピクセルの色 */
  color (row: number, column: number): string {
    return this.frames[this.frame][row][column]
  }

  /** 入力欄に入れたフレームの情報を変数に入れる */
  set colorArray(v: string) {
    const lines = v.split('"').join('').split(',\n').filter(v => !!v)
    for(let i = 0; i < lines.length; i += 3) {
      if (i >= this.frames.length) {
        this.frames.push(this.generateBlankPixels())
      }
      this.setPixelArray(lines[i+1], lines[i+2], i / 3)
    }
  }

  setPixelArray (paret: string, v: string, frame: number): void {
    const values = v.split(',')
    this.frames[frame].forEach((rows, r) => {
      rows.forEach((col, c) => {
        const poped = values.shift()
        this.frames[frame][r][c] = '#' + paret.split(',')[Number(poped)].replace(/\s+/g, '')
      })
    })
  }

  /** フレーム情報の変数から適当にフォーマットした文字列にする */
  get colorArray(): string {
    let output: string = ''
    this.frames.forEach((_frame, frameIndex) => {
      const pixels = this.getPixelArrayString(frameIndex)
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
      output += `"100",\n"${colors}",\n"${newPixel.join(',')}",\n`
    })
    return output
  }

  getPixelArrayString (frame: number): string {
    return this.frames[frame].flat().map(v => v?.replace('#', '').toLocaleUpperCase()).join(',')
  }
}
