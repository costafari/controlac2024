import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IAbonos } from '../abonos.model';

@Component({
  standalone: true,
  selector: 'jhi-abonos-detail',
  templateUrl: './abonos-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AbonosDetailComponent {
  abonos = input<IAbonos | null>(null);

  previousState(): void {
    window.history.back();
  }
}
