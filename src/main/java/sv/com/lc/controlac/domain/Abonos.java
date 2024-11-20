package sv.com.lc.controlac.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Abonos.
 */
@Entity
@Table(name = "abonos")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Abonos implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "saldo_anterior", nullable = false)
    private Long saldoAnterior;

    @NotNull
    @Column(name = "abono", nullable = false)
    private Long abono;

    @Column(name = "nuevo_saldo")
    private Long nuevoSaldo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "clientes", "lotes", "detalles", "abonos" }, allowSetters = true)
    private Facturas facturas;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Abonos id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSaldoAnterior() {
        return this.saldoAnterior;
    }

    public Abonos saldoAnterior(Long saldoAnterior) {
        this.setSaldoAnterior(saldoAnterior);
        return this;
    }

    public void setSaldoAnterior(Long saldoAnterior) {
        this.saldoAnterior = saldoAnterior;
    }

    public Long getAbono() {
        return this.abono;
    }

    public Abonos abono(Long abono) {
        this.setAbono(abono);
        return this;
    }

    public void setAbono(Long abono) {
        this.abono = abono;
    }

    public Long getNuevoSaldo() {
        return this.nuevoSaldo;
    }

    public Abonos nuevoSaldo(Long nuevoSaldo) {
        this.setNuevoSaldo(nuevoSaldo);
        return this;
    }

    public void setNuevoSaldo(Long nuevoSaldo) {
        this.nuevoSaldo = nuevoSaldo;
    }

    public Facturas getFacturas() {
        return this.facturas;
    }

    public void setFacturas(Facturas facturas) {
        this.facturas = facturas;
    }

    public Abonos facturas(Facturas facturas) {
        this.setFacturas(facturas);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Abonos)) {
            return false;
        }
        return getId() != null && getId().equals(((Abonos) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Abonos{" +
            "id=" + getId() +
            ", saldoAnterior=" + getSaldoAnterior() +
            ", abono=" + getAbono() +
            ", nuevoSaldo=" + getNuevoSaldo() +
            "}";
    }
}
