import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IFacturas } from 'app/entities/facturas/facturas.model';
import { FacturasService } from 'app/entities/facturas/service/facturas.service';
import { IAbonos } from '../abonos.model';
import { AbonosService } from '../service/abonos.service';
import { AbonosFormGroup, AbonosFormService } from './abonos-form.service';

@Component({
  standalone: true,
  selector: 'jhi-abonos-update',
  templateUrl: './abonos-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AbonosUpdateComponent implements OnInit {
  isSaving = false;
  abonos: IAbonos | null = null;

  facturasSharedCollection: IFacturas[] = [];

  protected abonosService = inject(AbonosService);
  protected abonosFormService = inject(AbonosFormService);
  protected facturasService = inject(FacturasService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AbonosFormGroup = this.abonosFormService.createAbonosFormGroup();

  compareFacturas = (o1: IFacturas | null, o2: IFacturas | null): boolean => this.facturasService.compareFacturas(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abonos }) => {
      this.abonos = abonos;
      if (abonos) {
        this.updateForm(abonos);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abonos = this.abonosFormService.getAbonos(this.editForm);
    if (abonos.id !== null) {
      this.subscribeToSaveResponse(this.abonosService.update(abonos));
    } else {
      this.subscribeToSaveResponse(this.abonosService.create(abonos));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbonos>>): void {
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

  protected updateForm(abonos: IAbonos): void {
    this.abonos = abonos;
    this.abonosFormService.resetForm(this.editForm, abonos);

    this.facturasSharedCollection = this.facturasService.addFacturasToCollectionIfMissing<IFacturas>(
      this.facturasSharedCollection,
      abonos.facturas,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.facturasService
      .query()
      .pipe(map((res: HttpResponse<IFacturas[]>) => res.body ?? []))
      .pipe(
        map((facturas: IFacturas[]) => this.facturasService.addFacturasToCollectionIfMissing<IFacturas>(facturas, this.abonos?.facturas)),
      )
      .subscribe((facturas: IFacturas[]) => (this.facturasSharedCollection = facturas));
  }
}
