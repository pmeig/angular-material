import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2} from '@angular/core';
import {RGB, TagDirective} from "@ngp-material/core";
import {leftPad, NgpDate, ngpDateObjectToDate, NgpDatePipe, NgpDateTime, NgpTime, Optional} from "@ngp/core";

type InputValue =  string | NgpDate | NgpTime | NgpDateTime | Date | undefined | number | boolean | InputWeek | RGB

interface InputMapper {
  input: (item: InputValue) => string | undefined,
  value: () => Optional<InputValue>
}

export interface InputWeek {
  week?: number,
  year?: number,
  monday?: Date | NgpDate,
  sunday?: Date | NgpDate
}

@Directive({
  selector: '[b-input]',
  standalone: true,
  providers: [NgpDatePipe]
})
export class BInputDirective extends TagDirective<HTMLInputElement> implements OnInit {

  @Input() readonly = false
  @Input() value: Optional<InputValue> = undefined
  @Output() valueChange = new EventEmitter<any>()
  @Input() label?: Element
  @Input('value-type') valueType: 'ts-date' | 'ngp-date' | 'default' | 'rgb' = 'default'
  @Input('label-position') labelPosition: 'above' | 'before' | 'default' = 'default'

  private mapper: InputMapper = {
    input: (item: InputValue) => item?.toString(),
    value: () => this.element.value
  }

  constructor(elementRef: ElementRef<HTMLInputElement>, renderer: Renderer2,
              private dateParser: NgpDatePipe) {
    super(elementRef, renderer)
    if (!elementRef.nativeElement.id) {
      throw new Error('id is required! for your test is best item to select this input')
    }
  }

  ngOnInit(): void {
    this.mapper = this.findMapper()
    this.element.addEventListener('input', event => {
      if (this.readonly){
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
      } else {
        this.valueChange.emit(this.mapper.value())
      }
    })
  }

  protected afterViewInit(): void {
    this.element.value = this.value ? this.mapper.input(this.value) ?? this.element.value : this.element.value
    if (this.label) {
      this.linkLabelWithInput(this.label!!)
    }
  }

  @HostListener('focus')
  private labelToTitle() {
    if (this.labelPosition === 'default') {
      this.putClass(this.label, 'input-title')
      this.removeClass('webkit-disable')
    }
  }

  @HostListener('blur')
  private labelToPlaceholder() {
    if (this.labelPosition === 'default' && !this.element.value) {
      this.removeClass(this.label, 'input-title')
      this.putClass('webkit-disable')
    }
  }

  private findMapper(): InputMapper {
    if (this.valueType === 'default' && ['date', 'time', 'month', 'week']
      .find(date => this.element.type.startsWith(date))) {
      return {
        input: item =>  item as string | undefined,
        value: () => this.element.value
      }
    }
    const dateType = this.valueType as 'ts-date' | 'ngp-date'
    switch (this.element.type) {
      case 'checkbox':
      case 'radio': return {
        input: item => item?.toString(),
        value: () => this.element.checked
      }
      case 'date':
      case 'datetime-local':
      case 'time': return this.transformSimpleInputDate(dateType)
      case 'month': {
        if (this.valueType === 'ngp-date') {
          return this.mapperMonthNgpDate()
        }
        return {
          input: item => {
            const date = item as Date | undefined
            if (date) {
              return `${date.getFullYear()}-${date.getMonth() + 1}`
            }
            return undefined
          },
          value: () => this.element.valueAsDate
        }
      }
      case 'week': return this.mapperForWeek()
      case 'color': return this.mapperForColor()
    }
    return {
      input: item => item?.toString(),
      value: () => this.element.value
    }
  }

  private transformSimpleInputDate(dateType: 'ts-date' | 'ngp-date'): InputMapper {
    let transformDateToDate = (date: Date | undefined | null) => date as Date | undefined | NgpDateTime
    const type = this.element.type.replace('-local', '') as 'date' | 'datetime' | 'time'
    if (this.valueType === 'ngp-date') {
      transformDateToDate = date => this.dateParser.transform(date, 'struct=ngp-date', `type=${type}`) as Date | NgpDateTime | undefined
    }
    const value = () => transformDateToDate(this.element.valueAsDate)
    return {
      input: item => this.dateParser.transform(item as Optional< Date | NgpDateTime | NgpDate | NgpTime>,
        `type=${type}`, 'format=input', `struct=${dateType}`) as string,
      value
    }
  }

  private mapperMonthNgpDate(): InputMapper {
    return {
      input: item => {
        const date = item as NgpDate | undefined
        if (!date) return undefined
        return `${date.year}-${leftPad(date.month, '0', 2)}`
      },
      value: () => {
        const date = this.element.value.split('-')
        if (date.length > 1) {
          return {
            year: parseInt(date[0]),
            month: parseInt(date[1])
          }
        }
        return undefined
      }
    }
  }

  private toNumberWeek(week: InputWeek): InputWeek | undefined {
    const monday = week.monday instanceof Date ? week.monday : ngpDateObjectToDate(week.monday!!)
    const firstDayOfYear = new Date(monday.getFullYear(), 0, 1)
    return {
      year: monday.getUTCFullYear(),
      week: (monday.getTime()  - firstDayOfYear.getTime())/7
    }
  }

  private mapperForWeek(): InputMapper {
    const input: (item: InputValue) => string | undefined = item => {
      let week = item as InputWeek | undefined
      if (week?.monday && week?.sunday) {
        week = this.toNumberWeek(week)
      }
      if (!week) {
        return undefined
      }

      if (week.week && week.year) {
        return `${week.year}-W${week.week}`
      }
      return undefined
    }
    const toDateType = this.valueType === 'ts-date' ? (date: Date) => date : (date: Date) => this.dateParser.transform(date, 'struct=ngp-date', 'type=date')
    return {
      input,
      value: () => {
        const date = this.element.valueAsDate
        if (!date) {
          return undefined
        }
        const [year, week] = this.element.value.split('-W')
        const sunday = new Date(new Date(date.getTime()).setDate(date.getDate() + 6))
        return {
          week: Number(week),
          year: Number(year),
          monday: toDateType(date),
          sunday: toDateType(sunday)
        } as InputWeek
      }
    }
  }

  private mapperForColor(): InputMapper {
    if (this.valueType === 'rgb') {
      return {
        input: item => {
          if (!item) {
            return undefined
          }
          const rgb = item as RGB
          return `#${rgb.red.toString(16)}${rgb.green.toString(16)}${rgb.blue.toString(16)}${rgb.alpha ? (rgb.alpha * 100).toString(16) : ''}`
        },
        value: () => {
          const hex = this.element.value.slice(1)
          const red = hex.substring(0, 2)
          const green = hex.substring(2, 4)
          const blue = hex.substring(4, 6)
          const alpha = hex.length > 6 ? Number.parseInt(hex.substring(6, 8) , 16) / 100: undefined
          return {
            red: Number.parseInt(red, 16),
            green: Number.parseInt(green, 16),
            blue: Number.parseInt(blue, 16),
            alpha
          }
        }
      }
    }
    return {
      input: item => item?.toString(),
      value: () => this.element.value
    };
  }

  private linkLabelWithInput(element: Element) {
    if (element) {
      if (element instanceof HTMLLabelElement) {
        element.htmlFor = this.element.id
      } else {
        this.renderer.listen(element, 'click', () => this.element.focus())
      }
      this.putClass('input-relative')
      this.putClass(element, 'input-label')
      this.removeClass(element, 'input-title')
      this.moveLabel(element)
    }
  }

  private moveLabel(element: Element) {
    const styles = this.element.computedStyleMap()
    switch (this.labelPosition) {
      case "default": this.labelLikeTitle(element, styles); break;
      case "above": this.labelAbove(element, styles); break;
      default: {
        const borderWidth =  this.getNumberOfStyle(styles, 'border-width')
        this.putStyle(element, {
          left: ((this.element.clientLeft + this.getNumberOfStyle(styles, 'margin-left') - element.clientWidth - borderWidth)/16 - .2) + 'em',
          top: (this.element.clientTop + this.getNumberOfStyle(styles, 'margin-top') + this.element.clientHeight/4)/16 + 'em'
        })
      }
    }
  }

  private labelLikeTitle(element: Element, styles: StylePropertyMapReadOnly) {
    const margeY = this.element.clientHeight - element.clientHeight
    const margeX = this.getNumberOfStyle(styles, 'padding-left')
    this.removeStyle(element, 'left', 'top')
    const labelStyles = element.attributes.getNamedItem('style')?.value || ''
    this.renderer.setAttribute(element, 'style', labelStyles + `--title-y: -${margeY/16 * 1.2}em; --title-x: -${margeX/16 * 1.9}em`)
    this.putStyle(element, {
      left: `${(this.element.offsetTop + margeY)/16}em`,
      top: `${(this.element.offsetLeft + margeX)/16}em`,
    })
    if (this.element.clientWidth < element.clientWidth + 3 * 16) {
      this.putStyle({
        width: `${((element.clientWidth - this.element.clientWidth) + this.element.clientWidth)/16 + 3}em`,
      })
    }
    if (this.element.value) {
      this.putClass(element, 'transition-none', 'input-title')
      setTimeout(() => this.removeClass(element, 'transition-none'), 0)
    } else {
      this.putClass('webkit-disable')
    }
  }

  private labelAbove(element: Element, styles: StylePropertyMapReadOnly) {
    const borderWidth =  this.getNumberOfStyle(styles, 'border-width')
    this.putStyle(element, {
      left: (this.element.clientLeft + this.getNumberOfStyle(styles, 'margin-left') - borderWidth)/16 + 'em',
      top: ((this.element.clientTop + this.getNumberOfStyle(styles, 'margin-top') - borderWidth - element.clientHeight)/16 + .2) + 'em',
    })
  }

  private getNumberOfStyle(styles: StylePropertyMapReadOnly, key: string): number {
    return parseInt(styles?.get(key)?.toString().replace('px', '') || '0')
  }
}
