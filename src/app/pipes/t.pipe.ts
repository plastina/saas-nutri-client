import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { I18nService } from '../services/i18n.service';

@Pipe({
  name: 't',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription: Subscription;

  constructor(
    private i18nService: I18nService,
    private cdr: ChangeDetectorRef,
  ) {
    this.subscription = this.i18nService.language$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key: string, params?: Record<string, string | number>): string {
    return this.i18nService.t(key, params);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
