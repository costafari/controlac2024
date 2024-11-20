import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IClientes } from '../clientes.model';
import { ClientesService } from '../service/clientes.service';

@Component({
  standalone: true,
  templateUrl: './clientes-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ClientesDeleteDialogComponent {
  clientes?: IClientes;

  protected clientesService = inject(ClientesService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clientesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
