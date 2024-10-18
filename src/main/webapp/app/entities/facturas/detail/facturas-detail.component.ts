import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IFacturas } from '../facturas.model';

@Component({
  standalone: true,
  selector: 'jhi-facturas-detail',
  templateUrl: './facturas-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class FacturasDetailComponent {
  facturas = input<IFacturas | null>(null);

  previousState(): void {
    window.history.back();
  }
}
