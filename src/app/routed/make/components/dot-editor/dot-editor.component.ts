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
  http: any;

  constructor(
  ) { }

  /** 各フレームごとの時間 */
  times: number[] = []

  /** 各フレームごとのピクセルの状態 */
  frames: number[][][] = []

  /** 選択中のフレームのインデックス */
  frame = 0

  /** ピクセル数, [縦, 横] */
  private pixels: Array2<number> = [14, 16]

  /** 選択中の色 */
  picked: number = 0
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
    this.times[0] = 100
  }

  /** 初期状態の1フレームを作る */
  generateBlankPixels (): number[][] {
    const pixels: number[][] = []
    const columns = this.columns.map(() => 0);
    this.rows.forEach(() => {
      pixels.push([...columns])
    })
    return pixels
  }

  /** カラーピッカーをクリックした時 */
  onClick (event: Event): void {
    const inp = event.target
    const inps = document.querySelectorAll("#divpickers > input")
    inps.forEach((i, n) => {
      if (i == inp) {
        this.picked = n
      }
    })
  }

  /** カラーピッカーで色を変えた時 */
  onColorChange1 (color: string): void {
    this.picked = 0
  }
  onColorChange2 (color: string): void {
    this.picked = 1
  }
  onColorChange3 (color: string): void {
    this.picked = 2
  }
  onColorChange4 (color: string): void {
    this.picked = 3
  }
  onColorChange5 (color: string): void {
    this.picked = 4
  }
  onColorChange6 (color: string): void {
    this.picked = 5
  }
  onColorChange7 (color: string): void {
    this.picked = 6
  }
  onColorChange8 (color: string): void {
    this.picked = 7
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
        // TODO: JSON.stringify だと配列の順番保証されない気がする
        this.frames.push(JSON.parse(JSON.stringify(this.frames[this.frame])))
        this.times.push(100)
      }
      this.frame++
    }
    if (direction === 'next-middle' && this.frame + 1 < this.frames.length) {
      this.frames.splice(this.frame + 1, 0, JSON.parse(JSON.stringify(this.frames[this.frame])))
      this.times.splice(this.frame + 1, 0, 100)
      this.frame++
    }
  }

  get rows (): Array<number> {
    const h = document.location.hash.substring(1).split(",")[1]
    return [...Array(Number(h) || this.pixels[0])].map((_, i) => (i))
  }
  get columns (): Array<number> {
    const w = document.location.hash.substring(1).split(",")[0]
    return [...Array(Number(w) || this.pixels[1])].map((_, i) => (i))
  }

  /** ピクセルの色 */
  color (row: number, column: number): string {
    const c = this.frames[this.frame][row][column];
    const pickers: Array<string> = [this.picker1, this.picker2, this.picker3, this.picker4, this.picker5, this.picker6, this.picker7, this.picker8]
    return pickers[c];
  }

  /** 入力欄に入れたフレームの情報を変数に入れる */
  set colorArray(v: string) {
    const lines = v.split('"').join('').split(',\n').filter(v => !!v)
    for (let i = 0; i < lines.length; i += 3) {
      if (i >= this.frames.length) {
        this.frames.push(this.generateBlankPixels())
      }
      this.setPixelArray(lines[i + 1], lines[i + 2], i / 3)
    }
  }

  setPixelArray (p: string, v: string, frame: number): void {
    const palette = p.split(',')
    this.picker1 = palette[0]
    this.picker2 = palette[1]
    this.picker3 = palette[2]
    this.picker4 = palette[3]
    this.picker5 = palette[4]
    this.picker6 = palette[5]
    this.picker7 = palette[6]
    this.picker8 = palette[7]
    const values = v.split(',')
    this.frames[frame].forEach((rows, r) => {
      rows.forEach((col, c) => {
        const poped = values.shift()
        this.frames[frame][r][c] = Number(poped)
      })
    })
  }

  /** フレーム情報の変数から適当にフォーマットした文字列にする */
  get colorArray(): string {
    let output: string = ''
    const colors: Array<string> = [this.picker1, this.picker2, this.picker3, this.picker4, this.picker5, this.picker6, this.picker7, this.picker8]
    this.frames.forEach((_frame, frameIndex) => {
      const pixels = this.getPixelArrayString(frameIndex)
      const newPixel: string[] = pixels.split(',')
      output += `"${this.times[frameIndex]}",\n"${colors}",\n"${newPixel.join(',')}",\n`
    })
    return output
  }

  getPixelArrayString (frame: number): string {
    return this.frames[frame].flat().join(',')
  }

  get colorArray2(): string {
    let output: string[] = []
    const colors: Array<string> = [this.picker1.replace('#', ''), this.picker2.replace('#', ''), this.picker3.replace('#', ''), this.picker4.replace('#', ''), this.picker5.replace('#', ''), this.picker6.replace('#', ''), this.picker7.replace('#', ''), this.picker8.replace('#', '')]
    this.frames.forEach((_frame, frameIndex) => {
      const pixels = this.getPixelArrayString(frameIndex)
      const newPixel: string[] = pixels.split(',')
      output.push(`${this.times[frameIndex]}-${colors}-${newPixel.join(',')}`)
    })
    return output.join('-')
  }
}
