import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ILotes } from 'app/entities/lotes/lotes.model';
import { LotesService } from 'app/entities/lotes/service/lotes.service';
import { IProductos } from '../productos.model';
import { ProductosService } from '../service/productos.service';
import { ProductosFormGroup, ProductosFormService } from './productos-form.service';

@Component({
  standalone: true,
  selector: 'jhi-productos-update',
  templateUrl: './productos-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductosUpdateComponent implements OnInit {
  isSaving = false;
  productos: IProductos | null = null;

  lotesSharedCollection: ILotes[] = [];

  protected productosService = inject(ProductosService);
  protected productosFormService = inject(ProductosFormService);
  protected lotesService = inject(LotesService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProductosFormGroup = this.productosFormService.createProductosFormGroup();

  compareLotes = (o1: ILotes | null, o2: ILotes | null): boolean => this.lotesService.compareLotes(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productos }) => {
      this.productos = productos;
      if (productos) {
        this.updateForm(productos);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productos = this.productosFormService.getProductos(this.editForm);
    if (productos.id !== null) {
      this.subscribeToSaveResponse(this.productosService.update(productos));
    } else {
      this.subscribeToSaveResponse(this.productosService.create(productos));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductos>>): void {
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

  protected updateForm(productos: IProductos): void {
    this.productos = productos;
    this.productosFormService.resetForm(this.editForm, productos);

    this.lotesSharedCollection = this.lotesService.addLotesToCollectionIfMissing<ILotes>(this.lotesSharedCollection, productos.lotes);
  }

  protected loadRelationshipsOptions(): void {
    this.lotesService
      .query()
      .pipe(map((res: HttpResponse<ILotes[]>) => res.body ?? []))
      .pipe(map((lotes: ILotes[]) => this.lotesService.addLotesToCollectionIfMissing<ILotes>(lotes, this.productos?.lotes)))
      .subscribe((lotes: ILotes[]) => (this.lotesSharedCollection = lotes));
  }
}
