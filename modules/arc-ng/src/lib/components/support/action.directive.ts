import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { IconClass } from '../../shared/esri-icons';
import { getUuid, trimEmptyFields } from '../../shared/utils';

@Directive({
  selector: 'action'
})
export class ActionDirective implements OnInit, OnDestroy {
  @Input() active: boolean;
  @Input() className: IconClass;
  @Input() disabled: boolean;
  @Input() id: string = getUuid();
  @Input() image: string;
  @Input() title: string;
  @Input() type: 'button' | 'toggle' = 'button';
  @Input() visible: boolean;
  @Input() sectionNumber = 0;
  @Input() sortOrder = 0;

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
