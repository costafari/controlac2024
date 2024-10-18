package sv.com.lc.controlac.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Facturas.
 */
@Entity
@Table(name = "facturas")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Facturas implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "numero_factura", nullable = false)
    private Long numeroFactura;

    @Column(name = "fecha_factura")
    private Instant fechaFactura;

    @Column(name = "condicion_pago")
    private Boolean condicionPago;

    @JsonIgnoreProperties(value = { "facturas" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Clientes clientes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "proveedores", "productos", "facturas" }, allowSetters = true)
    private Lotes lotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "facturas" }, allowSetters = true)
    private Detalles detalles;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "facturas")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "facturas" }, allowSetters = true)
    private Set<Abonos> abonos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Facturas id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNumeroFactura() {
        return this.numeroFactura;
    }

    public Facturas numeroFactura(Long numeroFactura) {
        this.setNumeroFactura(numeroFactura);
        return this;
    }

    public void setNumeroFactura(Long numeroFactura) {
        this.numeroFactura = numeroFactura;
    }

    public Instant getFechaFactura() {
        return this.fechaFactura;
    }

    public Facturas fechaFactura(Instant fechaFactura) {
        this.setFechaFactura(fechaFactura);
        return this;
    }

    public void setFechaFactura(Instant fechaFactura) {
        this.fechaFactura = fechaFactura;
    }

    public Boolean getCondicionPago() {
        return this.condicionPago;
    }

    public Facturas condicionPago(Boolean condicionPago) {
        this.setCondicionPago(condicionPago);
        return this;
    }

    public void setCondicionPago(Boolean condicionPago) {
        this.condicionPago = condicionPago;
    }

    public Clientes getClientes() {
        return this.clientes;
    }

    public void setClientes(Clientes clientes) {
        this.clientes = clientes;
    }

    public Facturas clientes(Clientes clientes) {
        this.setClientes(clientes);
        return this;
    }

    public Lotes getLotes() {
        return this.lotes;
    }

    public void setLotes(Lotes lotes) {
        this.lotes = lotes;
    }

    public Facturas lotes(Lotes lotes) {
        this.setLotes(lotes);
        return this;
    }

    public Detalles getDetalles() {
        return this.detalles;
    }

    public void setDetalles(Detalles detalles) {
        this.detalles = detalles;
    }

    public Facturas detalles(Detalles detalles) {
        this.setDetalles(detalles);
        return this;
    }

    public Set<Abonos> getAbonos() {
        return this.abonos;
    }

    public void setAbonos(Set<Abonos> abonos) {
        if (this.abonos != null) {
            this.abonos.forEach(i -> i.setFacturas(null));
        }
        if (abonos != null) {
            abonos.forEach(i -> i.setFacturas(this));
        }
        this.abonos = abonos;
    }

    public Facturas abonos(Set<Abonos> abonos) {
        this.setAbonos(abonos);
        return this;
    }

    public Facturas addAbonos(Abonos abonos) {
        this.abonos.add(abonos);
        abonos.setFacturas(this);
        return this;
    }

    public Facturas removeAbonos(Abonos abonos) {
        this.abonos.remove(abonos);
        abonos.setFacturas(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Facturas)) {
            return false;
        }
        return getId() != null && getId().equals(((Facturas) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Facturas{" +
            "id=" + getId() +
            ", numeroFactura=" + getNumeroFactura() +
            ", fechaFactura='" + getFechaFactura() + "'" +
            ", condicionPago='" + getCondicionPago() + "'" +
            "}";
    }
}
