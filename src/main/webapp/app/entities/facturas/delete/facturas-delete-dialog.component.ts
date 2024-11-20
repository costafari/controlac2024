import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IFacturas } from '../facturas.model';
import { FacturasService } from '../service/facturas.service';

@Component({
  standalone: true,
  templateUrl: './facturas-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FacturasDeleteDialogComponent {
  facturas?: IFacturas;

  protected facturasService = inject(FacturasService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.facturasService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
