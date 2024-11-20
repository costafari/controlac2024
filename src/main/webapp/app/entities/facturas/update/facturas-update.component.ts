import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IClientes } from 'app/entities/clientes/clientes.model';
import { ClientesService } from 'app/entities/clientes/service/clientes.service';
import { ILotes } from 'app/entities/lotes/lotes.model';
import { LotesService } from 'app/entities/lotes/service/lotes.service';
import { IDetalles } from 'app/entities/detalles/detalles.model';
import { DetallesService } from 'app/entities/detalles/service/detalles.service';
import { FacturasService } from '../service/facturas.service';
import { IFacturas } from '../facturas.model';
import { FacturasFormGroup, FacturasFormService } from './facturas-form.service';

@Component({
  standalone: true,
  selector: 'jhi-facturas-update',
  templateUrl: './facturas-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FacturasUpdateComponent implements OnInit {
  isSaving = false;
  facturas: IFacturas | null = null;

  clientesCollection: IClientes[] = [];
  lotesSharedCollection: ILotes[] = [];
  detallesSharedCollection: IDetalles[] = [];

  protected facturasService = inject(FacturasService);
  protected facturasFormService = inject(FacturasFormService);
  protected clientesService = inject(ClientesService);
  protected lotesService = inject(LotesService);
  protected detallesService = inject(DetallesService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: FacturasFormGroup = this.facturasFormService.createFacturasFormGroup();

  compareClientes = (o1: IClientes | null, o2: IClientes | null): boolean => this.clientesService.compareClientes(o1, o2);

  compareLotes = (o1: ILotes | null, o2: ILotes | null): boolean => this.lotesService.compareLotes(o1, o2);

  compareDetalles = (o1: IDetalles | null, o2: IDetalles | null): boolean => this.detallesService.compareDetalles(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ facturas }) => {
      this.facturas = facturas;
      if (facturas) {
        this.updateForm(facturas);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const facturas = this.facturasFormService.getFacturas(this.editForm);
    if (facturas.id !== null) {
      this.subscribeToSaveResponse(this.facturasService.update(facturas));
    } else {
      this.subscribeToSaveResponse(this.facturasService.create(facturas));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFacturas>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(facturas: IFacturas): void {
    this.facturas = facturas;
    this.facturasFormService.resetForm(this.editForm, facturas);

    this.clientesCollection = this.clientesService.addClientesToCollectionIfMissing<IClientes>(this.clientesCollection, facturas.clientes);
    this.lotesSharedCollection = this.lotesService.addLotesToCollectionIfMissing<ILotes>(this.lotesSharedCollection, facturas.lotes);
    this.detallesSharedCollection = this.detallesService.addDetallesToCollectionIfMissing<IDetalles>(
      this.detallesSharedCollection,
      facturas.detalles,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clientesService
      .query({ filter: 'facturas-is-null' })
      .pipe(map((res: HttpResponse<IClientes[]>) => res.body ?? []))
      .pipe(
        map((clientes: IClientes[]) => this.clientesService.addClientesToCollectionIfMissing<IClientes>(clientes, this.facturas?.clientes)),
      )
      .subscribe((clientes: IClientes[]) => (this.clientesCollection = clientes));

    this.lotesService
      .query()
      .pipe(map((res: HttpResponse<ILotes[]>) => res.body ?? []))
      .pipe(map((lotes: ILotes[]) => this.lotesService.addLotesToCollectionIfMissing<ILotes>(lotes, this.facturas?.lotes)))
      .subscribe((lotes: ILotes[]) => (this.lotesSharedCollection = lotes));

    this.detallesService
      .query()
      .pipe(map((res: HttpResponse<IDetalles[]>) => res.body ?? []))
      .pipe(
        map((detalles: IDetalles[]) => this.detallesService.addDetallesToCollectionIfMissing<IDetalles>(detalles, this.facturas?.detalles)),
      )
      .subscribe((detalles: IDetalles[]) => (this.detallesSharedCollection = detalles));
  }
}
