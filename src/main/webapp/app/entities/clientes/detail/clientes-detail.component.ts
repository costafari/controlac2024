import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IClientes } from '../clientes.model';

@Component({
  standalone: true,
  selector: 'jhi-clientes-detail',
  templateUrl: './clientes-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ClientesDetailComponent {
  clientes = input<IClientes | null>(null);

  previousState(): void {
    window.history.back();
  }
}
