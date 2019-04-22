import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { Subject } from 'rxjs';
import { trimEmptyFields } from '../../shared/utils';
import { IconClass } from '../../shared/enums';

@Directive({
  selector: 'layer-action'
})
export class ActionDirective implements OnInit, OnDestroy {
  @Input()
  set iconClassName(value: IconClass) {
    this.className = `esri-${value}`;
  }
  @Input() active: boolean;
  @Input() className: string;
  @Input() disabled: boolean;
  @Input() id: string;
  @Input() image: string;
  @Input() title: string;
  @Input() type: 'button' | 'toggle';
  @Input() visible: boolean;
  sectionNumber = 0;
  sortOrder = 0;

  @Output() click = new EventEmitter<void>();
  private destroyed$ = new Subject();

  constructor(private dispatcher: ActionDispatcherService) {}

  ngOnInit(): void {
    this.dispatcher.toggleAction$.pipe(
      filter(actionId => actionId === this.id),
      takeUntil(this.destroyed$)
    ).subscribe(() => this.click.emit());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  createInstance(): Partial<__esri.ActionButton> | Partial<__esri.ActionToggle> {
    const result = {
      active: this.active,
      className: this.className,
      disabled: this.disabled,
      id: this.id,
      image: this.image,
      title: this.title,
      type: this.type,
      visible: this.visible
    };
    return trimEmptyFields(result);
  }
}
